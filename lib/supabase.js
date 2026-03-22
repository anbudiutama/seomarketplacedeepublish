import { createClient } from '@supabase/supabase-js';

let supabase = null;

export function getSupabase() {
  if (supabase) return supabase;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('Supabase env vars missing');
    return null;
  }
  
  supabase = createClient(url, key);
  return supabase;
}
