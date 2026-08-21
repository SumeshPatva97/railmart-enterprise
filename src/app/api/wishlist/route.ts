import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Clean up any disabled or soft-deleted products from user's wishlist
    await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
        product: {
          OR: [
            { is_deleted: 1 },
            { isVisible: false },
            { status: 'OUT_OF_STOCK' },
          ],
        },
      },
    });

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: user.id,
        product: {
          is_deleted: 0,
          isVisible: true,
          status: 'ACTIVE',
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            alternateName: true,
            slug: true,
            sku: true,
            price: true,
            discount: true,
            rating: true,
            reviewsCount: true,
            isVisible: true,
            is_deleted: true,
            status: true,
            images: {
              select: { id: true, url: true, isPrimary: true },
            },
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ wishlist }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    // Validate product catalog visibility
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isVisible: true, is_deleted: true, status: true },
    });

    if (!product || product.is_deleted === 1 || product.isVisible === false || product.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This product is currently disabled or unavailable in the catalog.' },
        { status: 400 }
      );
    }

    const existing = await prisma.wishlist.findFirst({
      where: { userId: user.id, productId },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ message: 'Removed from wishlist', isFavorited: false });
    } else {
      await prisma.wishlist.create({
        data: { userId: user.id, productId },
      });
      return NextResponse.json({ message: 'Added to wishlist', isFavorited: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
