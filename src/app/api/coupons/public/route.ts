import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const coupons = await prisma.coupon.findMany({
      where: {
        status: 'ACTIVE',
        isOnline: true,
        validUntil: { gte: now },
        validFrom: { lte: now },
      },
      select: {
        id: true,
        code: true,
        discountType: true,
        value: true,
        minOrderValue: true,
        maxDiscount: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
