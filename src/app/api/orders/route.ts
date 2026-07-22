import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { calculateCartTotals } from '@/lib/utils';
import { sendOrderConfirmationEmail } from '@/lib/mailer';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { shippingAddress, billingAddress, paymentMethod, couponCode, notes } = body;

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Shipping address and payment method are required.' }, { status: 400 });
    }

    // Get user cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    // Check coupon if provided
    let couponDiscount: any = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && coupon.status === 'ACTIVE') {
        couponDiscount = {
          type: coupon.discountType as 'PERCENTAGE' | 'FIXED',
          value: coupon.value,
          maxDiscount: coupon.maxDiscount || undefined,
        };
        // Increment coupon times used
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { timesUsed: { increment: 1 } },
        });
      }
    }

    // Calculate totals
    const totals = calculateCartTotals(
      cart.items.map((i) => ({
        price: i.product.price * (1 - i.product.discount / 100),
        quantity: i.quantity,
        gstPercent: i.product.gstPercent,
        deliveryCharges: i.product.deliveryCharges,
      })),
      couponDiscount
    );

    const orderNumber = `RM-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PENDING',
        totalAmount: totals.totalAmount,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        shippingFee: totals.shippingFee,
        discountAmount: totals.discountAmount,
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        billingAddress: typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress || shippingAddress),
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        notes: notes || null,
        items: {
          create: cart.items.map((i) => {
            const finalPrice = i.product.price * (1 - i.product.discount / 100);
            return {
              productId: i.productId,
              price: finalPrice,
              quantity: i.quantity,
              total: finalPrice * i.quantity,
            };
          }),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Reduce stock for products
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Send confirmation email
    await sendOrderConfirmationEmail(user.email, order);

    return NextResponse.json({ order, message: 'Order placed successfully!' });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
