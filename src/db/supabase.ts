// src/db/supabase.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ✅ Fix TS2305 (missing export)
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

// Singleton instance
let supabase: SupabaseClient | null = null;

// ✅ Fix TS18047 (possibly null)
export const getSupabase = (): SupabaseClient => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not set.");
  }

  if (!supabase) {
    supabase = createClient(
      supabaseUrl as string,
      supabaseAnonKey as string
    );
  }

  return supabase;
};
