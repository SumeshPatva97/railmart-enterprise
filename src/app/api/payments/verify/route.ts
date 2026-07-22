import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature verification failed.' }, { status: 400 });
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'CONFIRMED',
      },
    });

    // Save payment record
    await prisma.payment.create({
      data: {
        orderId,
        paymentProvider: 'RAZORPAY',
        transactionId: razorpayPaymentId,
        amount: order.totalAmount,
        currency: 'INR',
        status: 'SUCCESS',
        rawResponse: JSON.stringify({ razorpayOrderId, razorpayPaymentId }),
      },
    });

    return NextResponse.json({ message: 'Payment verified and order confirmed successfully!', orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
