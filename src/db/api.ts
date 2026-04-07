// src/db/api.ts
import { supabase } from './supabase';
import type { Database } from '../types/supabase'; // create this file if it doesn't exist

// ==================== REFERRAL TREE ====================
export const getReferralTree = async (userId: string) => {
  const { data, error } = await supabase
    .from('referrals')
    .select(`
      id,
      referrer_id,
      referred_id,
      level,
      created_at,
      referred:profiles!referred_id (
        id,
        username,
        avatar_url,
        total_invested
      )
    `)
    .eq('referrer_id', userId)
    .order('level', { ascending: true });

  if (error) throw error;
  return data;
};

// ==================== LEADERBOARD ====================
export const getLeaderboard = async (limit: number = 10) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, total_invested, referral_count')
    .order('total_invested', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// ==================== ADMIN AUDIT LOGS ====================
export const getAdminAuditLogs = async (limit: number = 50) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// ==================== PLATFORM SETTINGS ====================
export const getPlatformSetting = async (key: string) => {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data?.value ?? null;
};

export const updatePlatformSetting = async (key: string, value: any) => {
  const { data, error } = await supabase
    .from('platform_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== DEPOSITS ====================
export const rejectDeposit = async (depositId: string, reason?: string) => {
  const { data, error } = await supabase
    .from('deposits')
    .update({ 
      status: 'rejected',
      rejected_reason: reason,
      updated_at: new Date().toISOString()
    })
    .eq('id', depositId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== LANDING PAGE SETTINGS ====================
export const getLandingPageSettings = async () => {
  const { data, error } = await supabase
    .from('landing_page_settings')
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const updateLandingPageSection = async (section: string, content: any) => {
  const { data, error } = await supabase
    .from('landing_page_settings')
    .update({ [section]: content, updated_at: new Date().toISOString() })
    .eq('id', 1) // assuming single row
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Add any other functions you already have in api.ts below...
// (Keep your existing functions and just make sure parameters have proper types)
