import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Pacifico } from 'next/font/google';
import { ThemeProvider } from './theme-provider';

const inter = Inter({ subsets: ['latin'] });
const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' });

export const metadata: Metadata = {
  metadataBase: new URL('https://sarthakurlshort.vercel.app'),
  title: {
    default: 'Sarthak URL Shortener – Shorten, Share, QR',
    template: '%s | Sarthak URL Shortener',
  },
  description: 'Free, fast URL shortener with API keys, QR codes, and daily limits. Create short links instantly.',
  keywords: ['url shortener', 'link shortener', 'qr code generator', 'bitly alternative', 'free url shortener'],
  authors: [{ name: 'Sarthak', url: 'https://github.com/itzsarthak78' }],
  creator: 'Sarthak',
  openGraph: {
    title: 'Sarthak URL Shortener',
    description: 'Shorten links, generate QR codes, and track usage with API keys.',
    url: 'https://sarthakurlshort.vercel.app',
    siteName: 'Sarthak URL Shortener',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sarthak URL Shortener' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarthak URL Shortener',
    description: 'Shorten links, generate QR codes, and track usage with API keys.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${pacifico.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
