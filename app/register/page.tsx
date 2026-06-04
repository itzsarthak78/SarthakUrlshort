'use client';

import { useState } from 'react';
import { supabase } from "../lib/supabaseClient";
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center max-w-md">
          <h1 className="text-xl font-semibold mb-2">Check your email</h1>
          <p className="text-gray-600">We sent a confirmation link to <strong>{email}</strong></p>
          <a href="/login" className="inline-block mt-4 text-purple-600">Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            className="w-full p-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white p-2 rounded"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-purple-600">Login</a>
        </p>
      </div>
    </div>
  );
}
