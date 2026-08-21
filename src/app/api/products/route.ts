import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { productsCache, getCatSlugMap, setCatSlugMap, clearProductsCache } from '@/lib/cache';
import { saveImageFile } from '@/lib/storage';

async function getCategoryIdBySlug(slug: string): Promise<string | null> {
  const now = Date.now();
  const { catSlugMapCache, catSlugMapTime } = getCatSlugMap();
  if (!catSlugMapCache || now - catSlugMapTime > 300000) {
    const allCats = await prisma.category.findMany({ select: { id: true, slug: true } });
    const newMap = new Map(allCats.map((c) => [c.slug, c.id]));
    setCatSlugMap(newMap, now);
    return newMap.get(slug) || null;
  }
  return catSlugMapCache.get(slug) || null;
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

    const startTime = performance.now();

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
      whereClause.category = { slug: category };
    }

    if (brand) {
      whereClause.brand = { slug: brand };
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
          categoryId: true,
          price: true,
          discount: true,
          stock: true,
          features: true,
          gstPercent: true,
          deliveryCharges: true,
          rating: true,
          reviewsCount: true,
          status: true,
          isVisible: true,
          isFeatured: true,
          isPopular: true,
          is_deleted: true,
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

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Response-Time': `${Math.round(performance.now() - startTime)}ms`,
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
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
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
            url: saveImageFile(img, sku),
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
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/products');
      revalidatePath('/admin');
    } catch {
      // ignore
    }

    return NextResponse.json({ product, message: 'Product created successfully.' }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
