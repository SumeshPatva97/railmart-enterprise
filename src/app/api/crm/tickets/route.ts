import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const whereClause = user.role === 'ADMIN' || user.role === 'SUPPORT' ? {} : { userId: user.id };

    const tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      select: {
        id: true,
        ticketNumber: true,
        subject: true,
        category: true,
        priority: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { name: true, email: true } },
        _count: { select: { messages: true } },
        crmNotes: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { subject, category, priority, message } = await req.json();
    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and initial message are required.' }, { status: 400 });
    }

    const ticketNumber = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: user.id,
        subject,
        category: category || 'General Query',
        priority: priority || 'MEDIUM',
        status: 'OPEN',
        messages: {
          create: [
            {
              senderId: user.id,
              senderType: 'USER',
              message,
            },
          ],
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ ticket, message: 'Support ticket submitted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPPORT')) {
      return NextResponse.json({ error: 'Unauthorized Staff access required' }, { status: 403 });
    }

    const { id, status, priority } = await req.json();
    if (!id) return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: status || undefined,
        priority: priority || undefined,
      },
    });

    return NextResponse.json({ ticket, message: 'Ticket status updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
