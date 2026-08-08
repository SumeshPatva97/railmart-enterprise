import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// READ-ONLY Audit Logs Endpoint (Logs cannot be updated or deleted)
let logsCache: { data: any; timestamp: number } | null = null;
const LOGS_CACHE_TTL = 30000;

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const now = Date.now();
    if (logsCache && now - logsCache.timestamp < LOGS_CACHE_TTL) {
      return NextResponse.json(logsCache.data, { headers: { 'X-Cache': 'HIT' } });
    }

    const logs = await prisma.activityLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const payload = { logs };
    logsCache = { data: payload, timestamp: now };

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
