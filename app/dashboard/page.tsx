'use client';

import { useEffect, useState } from 'react';
import { Key, Plus, Trash2, Copy, Check, Loader2, Activity } from 'lucide-react';

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
      // show new key once
      alert(`Your new API key: ${data.apiKey}\nStore it safely.`);
    } else {
      alert(data.error);
    }
    setLoading(false);
  };

  const deleteKey = async (key: string) => {
    if (!confirm('Delete this API key?')) return;
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
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Developer Dashboard</h1>
            <p className="text-gray-400">Manage your API keys – 100 requests/day per key</p>
          </div>
          <a href="/" className="text-purple-400 hover:text-purple-300 text-sm border border-purple-500/30 px-4 py-2 rounded-lg">← Back to Shortener</a>
        </div>

        {/* Generate new key */}
        <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Plus className="w-5 h-5" /> Generate new API key</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., My Project, Mobile App"
              className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-purple-500/30 focus:border-purple-500 outline-none"
            />
            <button
              onClick={generateKey}
              disabled={loading || !newKeyName.trim()}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              Create
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Each key can make up to 100 shorten requests per day.</p>
        </div>

        {/* List of keys */}
        <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Key className="w-5 h-5" /> Your API Keys</h2>
          {keys.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No keys yet. Create your first API key above.</p>
          ) : (
            <div className="space-y-4">
              {keys.map((k) => (
                <div key={k.key} className="border border-purple-500/20 rounded-xl p-4 bg-black/30">
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <div className="font-semibold text-purple-300">{k.name}</div>
                      <div className="text-xs font-mono text-gray-400 break-all mt-1">Key: {k.key.slice(0, 15)}...{k.key.slice(-10)}</div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Created: {new Date(k.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {k.requests || 0} / 100 today</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => copyToClipboard(k.key, k.key)} className="p-2 hover:bg-purple-500/20 rounded-lg transition">
                        {copiedKey === k.key ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteKey(k.key)} className="p-2 hover:bg-red-500/20 rounded-lg transition">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API usage example */}
        <div className="mt-8 bg-white/5 rounded-xl p-4 border border-white/10 text-sm">
          <p className="text-purple-300 font-mono mb-2">📌 Usage example:</p>
          <pre className="bg-black/50 p-3 rounded-lg overflow-x-auto text-gray-300">
{`curl -X POST https://yourdomain.vercel.app/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"longUrl": "https://example.com"}'`}
          </pre>
        </div>
      </div>
    </main>
  );
}
