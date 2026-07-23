import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function logActivity(
  userId: string | null,
  action: string,
  details: string,
  req?: NextRequest
) {
  try {
    const ipAddress = req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req?.headers.get('user-agent') || 'Browser';

    await prisma.activityLog.create({
      data: {
        userId: userId || undefined,
        action,
        details,
        ipAddress: typeof ipAddress === 'string' ? ipAddress.split(',')[0] : '127.0.0.1',
        userAgent: typeof userAgent === 'string' ? userAgent.slice(0, 150) : 'Browser',
      },
    });
  } catch (err) {
    console.error('Failed to record activity log:', err);
  }
}
