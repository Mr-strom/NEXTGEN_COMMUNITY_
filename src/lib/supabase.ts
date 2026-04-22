import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

/** Supabase client. Only created when env vars are set and valid (not placeholder). */
let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  if (
    typeof supabaseUrl === "string" &&
    supabaseUrl.length > 0 &&
    supabaseUrl !== "your_url" &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.length > 0
  ) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
  }
  return null;
}

export { getSupabase };
