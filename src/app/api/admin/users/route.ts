import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, hashPassword } from '@/lib/auth';
import { logActivity } from '@/lib/logger';

let usersCache: { data: any; timestamp: number } | null = null;
const USERS_CACHE_TTL = 30000;

export function clearAdminUsersCache() {
  usersCache = null;
}

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const now = Date.now();
    if (usersCache && now - usersCache.timestamp < USERS_CACHE_TTL) {
      return NextResponse.json(usersCache.data, { headers: { 'X-Cache': 'HIT' } });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        addresses: true,
        _count: {
          select: { orders: true, supportTickets: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const payload = { users };
    usersCache = { data: payload, timestamp: now };

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// ADMIN: Add New Customer
export async function POST(req: NextRequest) {
  try {
    const admin = getUserFromRequest(req);
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, password, role = 'CUSTOMER' } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 });
    }

    const passToHash = password || 'Customer@123456';
    const passwordHash = await hashPassword(passToHash);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role,
        emailVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Record immutable audit log
    await logActivity(
      admin.id,
      'ADMIN_CREATE_CUSTOMER',
      `Admin ${admin.email} created new ${role} user: ${newUser.name} (${newUser.email}).`,
      req
    );

    return NextResponse.json({ user: newUser, message: 'Customer created successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// ADMIN: Edit Customer Details
export async function PUT(req: NextRequest) {
  try {
    const admin = getUserFromRequest(req);
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, name, email, phone, role } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Check email conflict
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
      });
      if (existing) {
        return NextResponse.json({ error: 'Email is already used by another account.' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        role: role !== undefined ? role : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Record immutable audit log
    await logActivity(
      admin.id,
      'ADMIN_EDIT_CUSTOMER',
      `Admin ${admin.email} updated customer ${updatedUser.name} (${updatedUser.email}) [Role: ${updatedUser.role}, Phone: ${updatedUser.phone || 'N/A'}].`,
      req
    );

    return NextResponse.json({ user: updatedUser, message: 'User details updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
