'use client';

import { useEffect, useState } from 'react';
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from './theme-provider';
import {
  Link,
  Copy,
  Check,
  Loader2,
  Download,
  QrCode,
  Sparkles,
  Globe,
  Zap,
  Shield,
  Moon,
  Sun,
  X,
  BarChart3,
  Infinity,
  User
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Auth check – redirect to register if not logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/register');
      } else {
        setSession(session);
      }
      setLoadingAuth(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShortUrl(data.shortUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = png;
        link.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) return null; // redirecting

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link className="w-6 h-6 text-primary" />
            <span className="font-['Pacifico'] text-2xl bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              Sarthak
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/profile" className="text-sm text-muted-foreground hover:text-primary transition flex items-center gap-1">
              <User className="w-4 h-4" /> Profile
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
          Short URLs, Big Impact
        </h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          Create short, memorable links with QR codes and developer API.
        </p>
      </section>

      {/* Main Card */}
      <div className="max-w-xl mx-auto px-4 pb-16">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-6 card-hover">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Paste your long URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="url"
                  required
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/very/long/address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border input-focus transition"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {error && (
            <div className="mt-5 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 animate-in">
              <p className="text-sm font-medium text-primary mb-2 text-center">Your short link is ready</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center bg-background rounded-lg border border-border p-2">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="flex-1 bg-transparent outline-none text-sm px-2"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-muted rounded-md transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => setShowQR(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition"
                >
                  <QrCode className="w-4 h-4" /> QR Code
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-4 mt-12">
          <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
            <Zap className="w-6 h-6 text-purple-500" />
            <span className="text-sm font-medium">Fast redirects</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
            <Shield className="w-6 h-6 text-purple-500" />
            <span className="text-sm font-medium">No spam</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <span className="text-sm font-medium">Analytics ready</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
            <Infinity className="w-6 h-6 text-purple-500" />
            <span className="text-sm font-medium">Unlimited links</span>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && shortUrl && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-sm w-full p-6 relative animate-in">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Scan QR Code</h3>
              <div className="flex justify-center bg-white p-4 rounded-xl inline-block mx-auto">
                <QRCodeSVG id="qr-svg" value={shortUrl} size={180} bgColor="#ffffff" fgColor="#000000" />
              </div>
              <button
                onClick={downloadQR}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Download className="w-4 h-4" /> Download QR
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
