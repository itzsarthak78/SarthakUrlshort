import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateSlug(length = 6): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export async function POST(request: NextRequest) {
  try {
    const { longUrl, customSlug } = await request.json();

    if (!longUrl || !isValidUrl(longUrl)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    let slug = customSlug?.trim();
    if (slug) {
      const existing = await kv.get(slug);
      if (existing) {
        return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
      }
    } else {
      let attempts = 0;
      do {
        slug = generateSlug();
        attempts++;
        if (attempts > 5) break;
      } while (await kv.get(slug));
    }

    await kv.set(slug, longUrl);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const shortUrl = `${baseUrl}/${slug}`;

    return NextResponse.json({ shortUrl, slug });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
