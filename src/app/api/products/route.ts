import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// Simple In-Memory Cache for GET /api/products
interface CacheEntry {
  data: any;
  timestamp: number;
}

const productsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60000; // 60 seconds cache

// Fast In-Memory Category Slug-to-ID lookup
let catSlugMapCache: Map<string, string> | null = null;
let catSlugMapTime = 0;

async function getCategoryIdBySlug(slug: string): Promise<string | null> {
  const now = Date.now();
  if (!catSlugMapCache || now - catSlugMapTime > 300000) {
    const allCats = await prisma.category.findMany({ select: { id: true, slug: true } });
    catSlugMapCache = new Map(allCats.map((c) => [c.slug, c.id]));
    catSlugMapTime = now;
  }
  return catSlugMapCache.get(slug) || null;
}

export function clearProductsCache() {
  productsCache.clear();
  catSlugMapCache = null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const featured = searchParams.get('featured');
    const popular = searchParams.get('popular');
    const deletedOnly = searchParams.get('deletedOnly');
    const includeDeleted = searchParams.get('includeDeleted');
    const adminView = searchParams.get('adminView');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Deterministic Normalized Cache Key
    const cacheKey = searchParams.toString() || 'default';
    const now = Date.now();
    const cached = productsCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }

    const whereClause: any = {};

    // Soft delete filtering
    if (deletedOnly === 'true') {
      whereClause.is_deleted = 1;
    } else if (includeDeleted !== 'true') {
      whereClause.is_deleted = 0;
    }

    // Customer vs Admin visibility filtering
    if (adminView !== 'true') {
      whereClause.isVisible = true;
    }

    if (category) {
      const catId = await getCategoryIdBySlug(category);
      if (catId) {
        whereClause.categoryId = catId;
      } else {
        whereClause.categoryId = 'non-existent-id';
      }
    }

    if (brand) {
      const brandObj = await prisma.brand.findUnique({
        where: { slug: brand },
        select: { id: true },
      });
      if (brandObj) {
        whereClause.brandId = brandObj.id;
      } else {
        whereClause.brandId = 'non-existent-id';
      }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    if (minRating) {
      whereClause.rating = { gte: parseFloat(minRating) };
    }

    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    if (popular === 'true') {
      whereClause.isPopular = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'popular') orderBy = { reviewsCount: 'desc' };

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          alternateName: true,
          slug: true,
          sku: true,
          price: true,
          discount: true,
          stock: true,
          gstPercent: true,
          deliveryCharges: true,
          rating: true,
          reviewsCount: true,
          status: true,
          isVisible: true,
          isFeatured: true,
          isPopular: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            take: 1,
            select: {
              id: true,
              url: true,
              alt: true,
              isPrimary: true,
            },
          },
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const responsePayload = {
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    // Set cache
    productsCache.set(cacheKey, { data: responsePayload, timestamp: Date.now() });

    return NextResponse.json(responsePayload, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error: any) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      alternateName,
      sku,
      categoryId,
      brandId,
      description,
      features,
      price,
      discount,
      stock,
      gstPercent,
      deliveryCharges,
      images,
      isFeatured,
      isPopular,
      isVisible,
    } = body;

    if (!name || !sku || !categoryId || price === undefined) {
      return NextResponse.json({ error: 'Missing required product fields.' }, { status: 400 });
    }

    const slug = slugify(name) + '-' + Math.floor(Math.random() * 1000);

    const product = await prisma.product.create({
      data: {
        name,
        alternateName: alternateName || '',
        slug,
        sku,
        categoryId,
        brandId,
        description: description || '',
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        price: parseFloat(price),
        discount: parseFloat(discount || 0),
        stock: parseInt(stock || 0),
        gstPercent: parseFloat(gstPercent || 18),
        deliveryCharges: parseFloat(deliveryCharges || 0),
        isFeatured: Boolean(isFeatured),
        isPopular: Boolean(isPopular),
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
        is_deleted: 0,
        images: {
          create: (images || []).map((img: string, idx: number) => ({
            url: img,
            alt: name,
            isPrimary: idx === 0,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    clearProductsCache();
    return NextResponse.json({ product, message: 'Product created successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
