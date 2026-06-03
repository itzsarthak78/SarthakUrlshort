'use client';

import { useEffect, useState } from 'react';
import { Key, Plus, Trash2, Copy, Check, Loader2, Activity, ArrowLeft, Shield, Clock } from 'lucide-react';
import { useTheme } from '../theme-provider';

interface ApiKey {
  key: string;
  name: string;
  createdAt: number;
  requests: number;
  dailyLimit: number;
}

export default function Dashboard() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { theme } = useTheme();

  const fetchKeys = async () => {
    const res = await fetch('/api/keys');
    const data = await res.json();
    setKeys(data.keys || []);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const generateKey = async () => {
    if (!newKeyName.trim()) return;
    setLoading(true);
    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newKeyName }),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchKeys();
      setNewKeyName('');
      alert(`Your new API key: ${data.apiKey}\nStore it safely.`);
    } else {
      alert(data.error);
    }
    setLoading(false);
  };

  const deleteKey = async (key: string) => {
    if (!confirm('Delete this API key? It cannot be undone.')) return;
    await fetch('/api/keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: key }),
    });
    fetchKeys();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const truncateKey = (key: string) => {
    if (key.length <= 20) return key;
    return `${key.slice(0, 14)}...${key.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              API Dashboard
            </h1>
          </div>
          <a
            href="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Create new key card */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Create new API key</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Each key gets <strong className="text-primary">100 requests/day</strong>. Name it so you remember the project.
          </p>

          {/* Fixed layout: vertical on mobile, horizontal on larger screens */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., My Mobile App, Website"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none text-base"
            />
            <button
              onClick={generateKey}
              disabled={loading || !newKeyName.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition sm:w-auto w-full"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
              {loading ? 'Creating...' : 'Create Key'}
            </button>
          </div>
        </div>

        {/* Your API keys section */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Your API Keys</h2>
          </div>

          {keys.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Key className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No keys yet. Create your first API key above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((k) => (
                <div
                  key={k.key}
                  className="border border-primary/20 rounded-xl p-4 bg-background/50 transition hover:border-primary/40"
                >
                  {/* Key name and delete button */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-primary text-lg">{k.name}</div>
                    <button
                      onClick={() => deleteKey(k.key)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* API key (truncated) + copy */}
                  <div className="flex items-center justify-between gap-2 bg-background rounded-lg p-2 border border-border mt-2">
                    <code className="text-xs font-mono text-muted-foreground break-all">
                      {truncateKey(k.key)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(k.key, k.key)}
                      className="p-2 hover:bg-primary/10 rounded-md transition shrink-0"
                    >
                      {copiedKey === k.key ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(k.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>
                        {k.requests || 0} / {k.dailyLimit} today
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API usage example */}
        <div className="mt-8 bg-card rounded-xl p-4 border border-border">
          <p className="text-primary font-mono text-sm mb-2">📘 Example request</p>
          <pre className="bg-black/50 p-3 rounded-lg overflow-x-auto text-xs text-muted-foreground">
{`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.vercel.app'}/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"longUrl": "https://example.com"}'`}
          </pre>
        </div>
      </main>
    </div>
  );
}
