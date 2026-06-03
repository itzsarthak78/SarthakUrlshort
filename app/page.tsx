'use client';

import { useState } from 'react';
import { Link, Copy, Check, Loader2 } from 'lucide-react';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl backdrop-blur mb-4">
            <Link className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
            URL Shortener
          </h1>
          <p className="text-gray-400 mt-2">Fast, secure & developer‑friendly</p>
        </div>

        {/* 3D Card */}
        <div className="card-3d bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Long URL</label>
              <input
                type="url"
                required
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very/long/address"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none text-white placeholder-gray-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Link className="w-5 h-5" />}
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <p className="text-sm font-medium text-purple-300 mb-2 text-center">Your short link</p>
              <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-2 py-1 text-purple-300 bg-transparent outline-none text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-sm flex items-center gap-1"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard link */}
        <div className="text-center mt-8">
          <a href="/dashboard" className="text-purple-400 hover:text-purple-300 text-sm underline underline-offset-2">
            Developer API → Generate your API key
          </a>
        </div>
      </div>
    </main>
  );
}
