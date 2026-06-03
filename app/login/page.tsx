'use client';

import { useState } from 'react';
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Link as LinkIcon } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-sm border border-purple-100 dark:border-purple-900/30">
          <LinkIcon className="w-6 h-6 text-purple-600" />
          <span className="font-['Pacifico'] text-3xl bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
            Sarthak
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to shorten URLs</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-gray-700 p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"><p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p></div>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-2.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md disabled:opacity-70">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-purple-600 font-semibold hover:underline">Create one</a>
        </p>
      </div>
    </div>
  );
}
