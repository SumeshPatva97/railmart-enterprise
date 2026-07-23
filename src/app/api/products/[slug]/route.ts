import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

    return NextResponse.json({ product });
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

    const product = await prisma.product.update({
      where: { slug },
      data: {
        name: body.name !== undefined ? body.name : undefined,
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
      },
      include: {
        images: true,
        category: true,
      },
    });

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

    return NextResponse.json({ product, message: 'Product soft-deleted successfully (can be restored).' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
