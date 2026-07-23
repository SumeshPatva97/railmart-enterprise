import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { logActivity } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
        payments: true,
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status, paymentStatus, trackingNumber, courierName, notes } = await req.json();

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isAdmin = user.role === 'ADMIN';
    const isOwner = existingOrder.userId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Handle customer actions (Cancel or Refund Request)
    if (!isAdmin && isOwner) {
      if (status === 'CANCELLED') {
        if (existingOrder.status !== 'PENDING' && existingOrder.status !== 'CONFIRMED') {
          return NextResponse.json({ error: 'Cannot cancel an order that is already packed or shipped.' }, { status: 400 });
        }
      } else if (status === 'REFUND_REQUESTED') {
        if (existingOrder.status !== 'DELIVERED') {
          return NextResponse.json({ error: 'Refund can only be requested for delivered orders.' }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized action.' }, { status: 403 });
      }
    }

    // Auto-update paymentStatus to REFUNDED if order status becomes REFUNDED
    let newPaymentStatus = paymentStatus;
    if (status === 'REFUNDED') {
      newPaymentStatus = 'REFUNDED';
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: newPaymentStatus || undefined,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
        notes: notes || undefined,
      },
    });

    // Record Immutable Audit Log
    if (status === 'REFUND_REQUESTED') {
      await logActivity(
        user.id,
        'ORDER_REFUND_REQUESTED',
        `Customer ${existingOrder.user?.name || user.email} requested refund for Order #${existingOrder.orderNumber}. Reason: ${notes || 'Not specified'}`,
        req
      );
    } else if (status === 'REFUNDED') {
      await logActivity(
        user.id,
        'ORDER_REFUND_APPROVED',
        `Admin ${user.email} approved refund for Order #${existingOrder.orderNumber} (Amount: ₹${existingOrder.totalAmount}).`,
        req
      );
    } else if (status === 'CANCELLED') {
      await logActivity(
        user.id,
        'ORDER_CANCELLED',
        `Order #${existingOrder.orderNumber} was cancelled by ${user.role === 'ADMIN' ? 'Admin' : 'Customer'}.`,
        req
      );
    }

    return NextResponse.json({ order, message: `Order #${order.orderNumber} status updated to ${order.status}.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
