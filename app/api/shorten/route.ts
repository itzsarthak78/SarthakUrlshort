import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}
function generateSlug(len = 6): string {
  return Math.random().toString(36).substring(2, 2 + len);
}

export async function POST(req: NextRequest) {
  try {
    // Check API key from Authorization header
    const authHeader = req.headers.get('authorization');
    let apiKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    // Allow public usage without key (optional, you can restrict)
    const isPublic = !apiKey;
    
    let longUrl: string;
    try {
      const body = await req.json();
      longUrl = body.longUrl;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!longUrl || !isValidUrl(longUrl)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // If API key provided, check rate limit
    if (apiKey) {
      const keyData = await kv.hgetall<{ requests: number; lastReset: string }>(`apikey:${apiKey}`);
      if (!keyData) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      const today = new Date().toISOString().slice(0, 10);
      if (keyData.lastReset !== today) {
        // reset counter
        await kv.hset(`apikey:${apiKey}`, { requests: 0, lastReset: today });
        keyData.requests = 0;
      }
      if (keyData.requests >= 100) {
        return NextResponse.json({ error: 'Daily limit reached (100 requests/day)' }, { status: 429 });
      }
      // increment request count
      await kv.hincrby(`apikey:${apiKey}`, 'requests', 1);
    }

    // generate unique slug
    let slug = '';
    let attempts = 0;
    do {
      slug = generateSlug();
      attempts++;
      if (attempts > 10) {
        return NextResponse.json({ error: 'Failed to generate slug' }, { status: 500 });
      }
    } while (await kv.get(slug));

    await kv.set(slug, longUrl);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const shortUrl = `${baseUrl}/${slug}`;

    return NextResponse.json({ shortUrl, slug });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
