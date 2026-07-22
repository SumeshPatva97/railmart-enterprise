import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { message, internalNote } = await req.json();

    if (internalNote && (user.role === 'ADMIN' || user.role === 'SUPPORT')) {
      const note = await prisma.cRMNote.create({
        data: {
          ticketId: id,
          author: user.name,
          note: internalNote,
        },
      });
      return NextResponse.json({ note, message: 'Internal staff note added.' });
    }

    if (!message) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const senderType = user.role === 'ADMIN' || user.role === 'SUPPORT' ? 'AGENT' : 'USER';

    const msg = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderId: user.id,
        senderType,
        message,
      },
    });

    if (senderType === 'AGENT') {
      await prisma.supportTicket.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return NextResponse.json({ message: msg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
