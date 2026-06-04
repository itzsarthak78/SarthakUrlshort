import { kv } from '@vercel/kv';
import { notFound, redirect } from 'next/navigation';

// Reserved routes that should NOT be treated as short links
const reservedRoutes = ['login', 'register', 'profile', 'dashboard'];

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { slug } = params;

  // If it's a reserved route, return 404 so Next.js can match the actual page
  if (reservedRoutes.includes(slug)) {
    notFound();
  }

  // Otherwise, treat it as a short link
  const longUrl = await kv.get<string>(slug);

  if (!longUrl) {
    notFound();
  }

  redirect(longUrl);
}
