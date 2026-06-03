import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

function generateApiKey(): string {
  return `pk_${randomBytes(24).toString('hex')}`;
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  
  const apiKey = generateApiKey();
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  await kv.hset(`apikey:${apiKey}`, {
    name,
    createdAt: now,
    requests: 0,
    lastReset: today,
  });
  await kv.sadd('apikeys:list', apiKey);
  return NextResponse.json({ apiKey });
}

export async function GET() {
  const keys = await kv.smembers('apikeys:list');
  const keyDetails = await Promise.all(
    keys.map(async (key) => {
      const data = await kv.hgetall<{ name: string; createdAt: number; requests: number }>(`apikey:${key}`);
      if (!data) return null;
      return { key, name: data.name, createdAt: data.createdAt, requests: data.requests || 0, dailyLimit: 100 };
    })
  );
  return NextResponse.json({ keys: keyDetails.filter(Boolean) });
}

export async function DELETE(req: NextRequest) {
  const { apiKey } = await req.json();
  if (!apiKey) return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  await kv.del(`apikey:${apiKey}`);
  await kv.srem('apikeys:list', apiKey);
  return NextResponse.json({ success: true });
}
