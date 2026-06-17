export const metadata: Metadata = {
  metadataBase: new URL('https://sarthakurll.vercel.app'),

  verification: {
    google: '2UFijFK-Fb4U8Hw9hti7d-TyD5-i1LtauXgdXcuMGl0',
  },

  title: {
    default: 'Sarthak Shortener | Free URL Shortener & QR Code Generator',
    template: '%s | Sarthak Shortener',
  },

  description:
    'Sarthak Shortener is a free URL shortener that lets you shorten long links, generate QR codes and share URLs instantly.',

  keywords: [
    'Sarthak Shortener',
    'Sarthak URL Shortener',
    'URL Shortener',
    'Link Shortener',
    'Free URL Shortener',
    'QR Code Generator',
    'Short URL',
    'Bitly Alternative',
    'Custom Short Links',
  ],

  authors: [{ name: 'Sarthak' }],
  creator: 'Sarthak',
  publisher: 'Sarthak Shortener',

  openGraph: {
    title: 'Sarthak Shortener | Free URL Shortener',
    description:
      'Shorten long URLs instantly with Sarthak Shortener. Generate QR codes and create shareable short links.',
    url: 'https://sarthakurll.vercel.app',
    siteName: 'Sarthak Shortener',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sarthak Shortener',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sarthak Shortener',
    description:
      'Free URL shortener and QR code generator by Sarthak.',
    images: ['/og-image.png'],
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  robots: {
    index: true,
    follow: true,
  },
};
