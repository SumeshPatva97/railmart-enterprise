import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

let leadsCache: { data: any; timestamp: number } | null = null;
const LEADS_CACHE_TTL = 30000;

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPPORT')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const now = Date.now();
    if (leadsCache && now - leadsCache.timestamp < LEADS_CACHE_TTL) {
      return NextResponse.json(leadsCache.data, { headers: { 'X-Cache': 'HIT' } });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const payload = { leads };
    leadsCache = { data: payload, timestamp: now };

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, status, source, notes, assignedTo } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required.' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company: company || null,
        status: status || 'NEW',
        source: source || 'Website Inquiry',
        notes: notes || null,
        assignedTo: assignedTo || null,
      },
    });

    return NextResponse.json({ lead, message: 'Lead created successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPPORT')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { id, status, notes, assignedTo } = await req.json();
    if (!id) return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        status: status || undefined,
        notes: notes || undefined,
        assignedTo: assignedTo || undefined,
      },
    });

    return NextResponse.json({ lead, message: 'Lead updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
