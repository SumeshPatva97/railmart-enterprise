import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items payload. Array of product items required.' }, { status: 400 });
    }

    // Batch update alternateName for each product to save sort order
    await prisma.$transaction(
      items.map((item: { id: string; alternateName: string }) =>
        prisma.product.update({
          where: { id: item.id },
          data: { alternateName: item.alternateName },
        })
      )
    );

    return NextResponse.json({ success: true, message: 'Product sort order updated successfully.' });
  } catch (error: any) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: error.message || 'Failed to reorder products.' }, { status: 500 });
  }
}
