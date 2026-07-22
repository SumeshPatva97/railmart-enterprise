import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized Admin access required.' }, { status: 403 });
    }

    const [totalUsers, totalOrders, pendingOrdersCount, revenueResult, bestSellers, recentOrders] =
      await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { paymentStatus: 'COMPLETED' },
        }),
        prisma.orderItem.groupBy({
          by: ['productId'],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, email: true } },
          },
        }),
      ]);

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // Fetch product details for best sellers
    const bestSellerIds = bestSellers.map((b) => b.productId);
    const productsMap = await prisma.product.findMany({
      where: { id: { in: bestSellerIds } },
      select: { id: true, name: true, price: true, sku: true },
    });

    const bestSellingProducts = bestSellers.map((item) => {
      const prod = productsMap.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: prod?.name || 'Railway Tool',
        sku: prod?.sku || 'N/A',
        totalSold: item._sum.quantity || 0,
      };
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,
        pendingOrders: pendingOrdersCount,
        monthlySales: Math.round(totalRevenue * 0.4),
      },
      bestSellingProducts,
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
