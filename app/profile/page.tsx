'use client';

import { useEffect, useState } from 'react';
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from 'next/navigation';
import { LogOut, Mail } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/register');
      else setUser(user);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/register');
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold mt-4">{user.user_metadata?.username || 'User'}</h2>
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
