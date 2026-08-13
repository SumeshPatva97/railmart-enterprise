import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { code, discountType, value, minOrderValue, maxDiscount, validFrom, validUntil, usageLimit, isOnline } = body;

    if (!code || value === undefined || value === null || value === '' || !validUntil) {
      return NextResponse.json({ error: 'Missing required coupon fields (Code, Value, Valid Until Date).' }, { status: 400 });
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return NextResponse.json({ error: 'Discount value must be a valid number.' }, { status: 400 });
    }

    const parsedValidUntil = new Date(validUntil);
    if (isNaN(parsedValidUntil.getTime())) {
      return NextResponse.json({ error: 'Valid Until date is invalid.' }, { status: 400 });
    }

    const parsedValidFrom = validFrom && !isNaN(new Date(validFrom).getTime()) ? new Date(validFrom) : new Date();
    const numMinOrder = minOrderValue && !isNaN(parseFloat(minOrderValue)) ? parseFloat(minOrderValue) : 0;
    const numMaxDiscount = maxDiscount && !isNaN(parseFloat(maxDiscount)) ? parseFloat(maxDiscount) : null;
    const numUsageLimit = usageLimit && !isNaN(parseInt(usageLimit)) ? parseInt(usageLimit) : 100;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType: discountType || 'PERCENTAGE',
        value: numValue,
        minOrderValue: numMinOrder,
        maxDiscount: numMaxDiscount,
        validFrom: parsedValidFrom,
        validUntil: parsedValidUntil,
        usageLimit: numUsageLimit,
        isOnline: isOnline !== undefined ? Boolean(isOnline) : true,
      },
    });

    return NextResponse.json({ coupon, message: 'Coupon created successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, code, discountType, value, minOrderValue, maxDiscount, validFrom, validUntil, usageLimit, status, isOnline } = body;

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (code !== undefined && code !== null && code !== '') updateData.code = code.toUpperCase();
    if (discountType !== undefined) updateData.discountType = discountType;
    if (value !== undefined && value !== null && value !== '' && !isNaN(parseFloat(value))) {
      updateData.value = parseFloat(value);
    }
    if (minOrderValue !== undefined) {
      const numMin = parseFloat(minOrderValue);
      updateData.minOrderValue = isNaN(numMin) ? 0 : numMin;
    }
    if (maxDiscount !== undefined) {
      if (maxDiscount === null || maxDiscount === '' || isNaN(parseFloat(maxDiscount))) {
        updateData.maxDiscount = null;
      } else {
        updateData.maxDiscount = parseFloat(maxDiscount);
      }
    }
    if (validFrom !== undefined && validFrom !== null && validFrom !== '' && !isNaN(new Date(validFrom).getTime())) {
      updateData.validFrom = new Date(validFrom);
    }
    if (validUntil !== undefined && validUntil !== null && validUntil !== '' && !isNaN(new Date(validUntil).getTime())) {
      updateData.validUntil = new Date(validUntil);
    }
    if (usageLimit !== undefined && usageLimit !== null && usageLimit !== '') {
      const numLimit = parseInt(usageLimit);
      if (!isNaN(numLimit)) updateData.usageLimit = numLimit;
    }
    if (status !== undefined) updateData.status = status;
    if (isOnline !== undefined) updateData.isOnline = Boolean(isOnline);

    const coupon = await prisma.coupon.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ coupon, message: 'Coupon updated successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ message: 'Coupon deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
