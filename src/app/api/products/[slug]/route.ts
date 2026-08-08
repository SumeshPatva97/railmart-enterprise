import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { clearProductsCache } from '../route';

interface SlugCacheEntry {
  data: any;
  timestamp: number;
}

const productSlugCache = new Map<string, SlugCacheEntry>();
const SLUG_CACHE_TTL = 60000;

export function clearProductSlugCache(slug?: string) {
  if (slug) {
    productSlugCache.delete(slug);
  } else {
    productSlugCache.clear();
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const now = Date.now();
    const cached = productSlugCache.get(slug);
    if (cached && now - cached.timestamp < SLUG_CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product || product.is_deleted === 1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const responsePayload = { product };
    productSlugCache.set(slug, { data: responsePayload, timestamp: now });

    return NextResponse.json(responsePayload, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { slug } = await params;
    const body = await req.json();

    // If new images provided, update product images
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      const existingProduct = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
      if (existingProduct) {
        // Remove old images and add new ones
        await prisma.productImage.deleteMany({ where: { productId: existingProduct.id } });
        await prisma.productImage.createMany({
          data: body.images.map((imgUrl: string, idx: number) => ({
            productId: existingProduct.id,
            url: imgUrl,
            alt: body.name || 'Product Image',
            isPrimary: idx === 0,
          })),
        });
      }
    }

    const product = await prisma.product.update({
      where: { slug },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        alternateName: body.alternateName !== undefined ? body.alternateName : undefined,
        categoryId: body.categoryId !== undefined ? body.categoryId : undefined,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        discount: body.discount !== undefined ? parseFloat(body.discount) : undefined,
        description: body.description !== undefined ? body.description : undefined,
        features: body.features !== undefined ? (typeof body.features === 'string' ? body.features : JSON.stringify(body.features || [])) : undefined,
        status: body.status !== undefined ? body.status : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPopular: body.isPopular !== undefined ? Boolean(body.isPopular) : undefined,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : undefined,
        is_deleted: body.is_deleted !== undefined ? parseInt(body.is_deleted) : undefined,
        // SKU is purposefully omitted to prevent modifying unique SKU code on edit
      },
      include: {
        images: true,
        category: true,
      },
    });

    clearProductSlugCache(slug);
    clearProductsCache();
    return NextResponse.json({ product, message: 'Product updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { slug } = await params;

    // SOFT DELETE: Update is_deleted = 1 instead of removing from database
    const product = await prisma.product.update({
      where: { slug },
      data: { is_deleted: 1 },
    });

    clearProductSlugCache(slug);
    clearProductsCache();
    return NextResponse.json({ product, message: 'Product soft-deleted successfully (can be restored).' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
