import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseBucket = process.env.SUPABASE_BUCKET;

if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseBucket) {
  console.warn('⚠️  Supabase belum dikonfigurasi lengkap. Pastikan SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan SUPABASE_BUCKET ter-set.');
}

export const supabase = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

export const getSupabaseBucket = () => supabaseBucket;

export const getSupabaseUrl = () => supabaseUrl;

export const isSupabaseConfigured = () => Boolean(supabase && supabaseBucket);

