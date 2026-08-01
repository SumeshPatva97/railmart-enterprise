import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

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
      whereClause.category = {
        slug: category,
      };
    }

    if (brand) {
      whereClause.brand = {
        slug: brand,
      };
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

    let orderBy: any = [{ alternateName: 'asc' }, { sku: 'asc' }, { createdAt: 'asc' }];
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
        include: {
          category: true,
          brand: true,
          images: true,
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
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

    return NextResponse.json({ product, message: 'Product created successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
