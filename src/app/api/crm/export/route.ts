import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'orders';

    let csvContent = '';
    let filename = `${type}-report-${Date.now()}.csv`;

    if (type === 'orders') {
      const orders = await prisma.order.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });

      csvContent = 'Order Number,Customer Name,Email,Status,Subtotal,GST Tax,Shipping Fee,Total Amount,Payment Method,Payment Status,Date\n';
      orders.forEach((o) => {
        csvContent += `"${o.orderNumber}","${o.user.name}","${o.user.email}","${o.status}",${o.subtotal},${o.taxAmount},${o.shippingFee},${o.totalAmount},"${o.paymentMethod}","${o.paymentStatus}","${o.createdAt.toISOString()}"\n`;
      });
    } else if (type === 'leads') {
      const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
      csvContent = 'Name,Company,Email,Phone,Status,Source,Notes,Date\n';
      leads.forEach((l) => {
        csvContent += `"${l.name}","${l.company || ''}","${l.email}","${l.phone}","${l.status}","${l.source}","${(l.notes || '').replace(/"/g, '""')}","${l.createdAt.toISOString()}"\n`;
      });
    } else if (type === 'products') {
      const products = await prisma.product.findMany({ include: { category: true }, orderBy: { name: 'asc' } });
      csvContent = 'SKU,Name,Category,Price,Discount,Stock,GST Percent,Rating,Status\n';
      products.forEach((p) => {
        csvContent += `"${p.sku}","${p.name}","${p.category.name}",${p.price},${p.discount},${p.stock},${p.gstPercent},${p.rating},"${p.status}"\n`;
      });
    } else {
      const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
      csvContent = 'Name,Email,Phone,Email Verified,Registered Date\n';
      customers.forEach((c) => {
        csvContent += `"${c.name}","${c.email}","${c.phone || ''}",${c.emailVerified},"${c.createdAt.toISOString()}"\n`;
      });
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
