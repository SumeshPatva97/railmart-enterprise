import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { calculateCartTotals } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
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
                gstPercent: true,
                deliveryCharges: true,
                isVisible: true,
                is_deleted: true,
                status: true,
                images: {
                  select: { id: true, url: true, alt: true, isPrimary: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: {
          items: {
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
                  gstPercent: true,
                  deliveryCharges: true,
                  isVisible: true,
                  is_deleted: true,
                  status: true,
                  images: {
                    select: { id: true, url: true, alt: true, isPrimary: true },
                  },
                },
              },
            },
          },
        },
      });
    }

    // Auto-clean any invalid/deleted/hidden products from user's cart
    if (cart.items && cart.items.length > 0) {
      const invalidItemIds = cart.items
        .filter(
          (item) =>
            !item.product ||
            item.product.is_deleted === 1 ||
            item.product.isVisible === false ||
            item.product.status !== 'ACTIVE'
        )
        .map((item) => item.id);

      if (invalidItemIds.length > 0) {
        await prisma.cartItem.deleteMany({
          where: { id: { in: invalidItemIds } },
        });
        cart.items = cart.items.filter((item) => !invalidItemIds.includes(item.id));
      }
    }

    const totals = calculateCartTotals(
      cart.items.map((item) => ({
        price: item.product.price * (1 - item.product.discount / 100),
        quantity: item.quantity,
        gstPercent: item.product.gstPercent,
        deliveryCharges: item.product.deliveryCharges,
      }))
    );

    return NextResponse.json({ cart, totals }, {
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
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    // Verify product is active, visible, and not deleted
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isVisible: true, is_deleted: true, status: true },
    });

    if (!product || product.is_deleted === 1 || product.isVisible === false || product.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This product is currently unavailable or disabled in the catalog.' },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.id } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty <= 0) {
        await prisma.cartItem.delete({ where: { id: existingItem.id } });
      } else {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQty },
        });
      }
    } else if (quantity > 0) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ message: 'Cart updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) return NextResponse.json({ message: 'Cart empty' });

    if (itemId) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ message: 'Item removed from cart.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
