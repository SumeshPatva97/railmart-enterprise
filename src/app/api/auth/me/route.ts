import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { logActivity } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone } = body;

    // Check email uniqueness if email is changed
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: payload.id } },
      });
      if (existing) {
        return NextResponse.json({ error: 'Email address is already in use by another user.' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Record immutable audit log
    await logActivity(
      payload.id,
      'USER_PROFILE_UPDATE',
      `User ${updatedUser.name} (${updatedUser.email}) updated profile details (Phone: ${updatedUser.phone || 'N/A'}).`,
      req
    );

    return NextResponse.json({ user: updatedUser, message: 'Profile updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
