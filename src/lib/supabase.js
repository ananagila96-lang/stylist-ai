import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const backendReady = Boolean(url && anonKey);
export const supabase = backendReady
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export async function loadJourney(userId) {
  const { data, error } = await supabase.from('journeys').select('payload').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data?.payload ?? { answers: [], photos: {}, favorites: [], completed: false };
}

export async function saveJourney(userId, payload) {
  const { error } = await supabase.from('journeys').upsert({ user_id: userId, payload, updated_at: new Date().toISOString() });
  if (error) throw error;
}
