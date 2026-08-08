import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

let remindersCache: { data: any; timestamp: number } | null = null;
const REMINDERS_CACHE_TTL = 30000;

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPPORT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const now = Date.now();
    if (remindersCache && now - remindersCache.timestamp < REMINDERS_CACHE_TTL) {
      return NextResponse.json(remindersCache.data, { headers: { 'X-Cache': 'HIT' } });
    }

    const reminders = await prisma.reminder.findMany({
      orderBy: { dueDate: 'asc' },
    });

    const payload = { reminders };
    remindersCache = { data: payload, timestamp: now };

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPPORT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, description, dueDate, priority } = await req.json();
    if (!title || !dueDate) {
      return NextResponse.json({ error: 'Title and due date are required.' }, { status: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        title,
        description: description || null,
        dueDate: new Date(dueDate),
        priority: priority || 'MEDIUM',
        assignedTo: user.name,
      },
    });

    return NextResponse.json({ reminder, message: 'Reminder created successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, isCompleted } = await req.json();
    if (!id) return NextResponse.json({ error: 'Reminder ID required' }, { status: 400 });

    const reminder = await prisma.reminder.update({
      where: { id },
      data: { isCompleted: Boolean(isCompleted) },
    });

    return NextResponse.json({ reminder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
