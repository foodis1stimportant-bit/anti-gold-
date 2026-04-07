// src/db/api.ts
import { supabase } from './supabase';

// ==================== PROFILE ====================
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (profile: { id: string; [key: string]: any }) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', profile.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCompoundingPreference = async (userId: string, compounding: boolean) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ compounding_enabled: compounding })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== REFERRALS ====================
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

export const getReferralStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('referrals')
    .select('count', { count: 'exact' })
    .eq('referrer_id', userId);

  if (error) throw error;
  return { total_referrals: data?.[0]?.count || 0 };
};

export const getReferralCommissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('referral_commissions')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getDownlineSummary = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('get_downline_summary', { user_id: userId }); // Use RPC if you have it, or replace with custom query

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

// ==================== WALLET & TRANSACTIONS ====================
export const getWalletBalances = async (walletAddress: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .select('balance, currency')
    .eq('wallet_address', walletAddress);

  if (error) throw error;
  return data || [];
};

export const getTransactions = async (userId: string, limit = 20) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const createWithdrawal = async (withdrawal: {
  user_id: string;
  amount: number;
  wallet_address: string;
  currency?: string;
}) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .insert(withdrawal)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== SUPPORT ====================
export const createSupportTicket = async (ticket: {
  user_id: string;
  subject: string;
  message: string;
  category?: string;
}) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert(ticket)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSupportTickets = async (userId: string) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ==================== ADMIN ====================
export const getAdminAuditLogs = async (limit: number = 50) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getPlatformSetting = async (key: string) => {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.value ?? null;
};

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

// ==================== LANDING PAGE ====================
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
    .eq('id', 1)
    .select()
    .single();

  if (error) throw error;
  return data;
};
