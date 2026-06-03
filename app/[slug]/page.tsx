import { kv } from '@vercel/kv';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params;
  const longUrl = await kv.get<string>(slug);

  if (!longUrl) {
    notFound();
  }

  redirect(longUrl);
}

export async function generateStaticParams() {
  return [];
}
