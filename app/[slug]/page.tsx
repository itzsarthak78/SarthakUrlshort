import { kv } from '@vercel/kv';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { slug } = params;
  const longUrl = await kv.get<string>(slug);

  if (!longUrl) {
    notFound();
  }

  redirect(longUrl);
}
