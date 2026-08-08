import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

let categoriesCache: { data: any; timestamp: number } | null = null;
const CAT_CACHE_TTL = 60000;

export async function GET() {
  try {
    const now = Date.now();
    if (categoriesCache && now - categoriesCache.timestamp < CAT_CACHE_TTL) {
      return NextResponse.json(categoriesCache.data, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      });
    }

    const categories = await prisma.category.findMany({
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const responsePayload = { categories };
    categoriesCache = { data: responsePayload, timestamp: now };

    return NextResponse.json(responsePayload, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { name, description, image, parentId } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const slug = slugify(name);
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId,
      },
    });

    return NextResponse.json({ category, message: 'Category created successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
