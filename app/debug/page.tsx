'use client';

import { useEffect, useState } from 'react';
import { supabase } from "../../lib/supabaseClient";

export default function Debug() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      setSession(data.session);
      setError(error);
    });
  }, []);

  return (
    <div className="p-8">
      <h1>Debug Info</h1>
      <pre>{JSON.stringify({ session, error, env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      } }, null, 2)}</pre>
    </div>
  );
}
