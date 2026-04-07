// src/db/api.ts
import { supabase } from './supabase';
import type { Database } from '../types/supabase'; // Adjust path if your types are elsewhere

// Example interfaces (add more as needed)
interface Profile {
  id: string;
  wallet?: string;
  // add other fields...
}

// ==================== USER / PROFILE ====================

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (profile: Partial<Profile> & { id: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', profile.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== WALLET / INVESTMENT ====================

export const getWalletBalance = async (wallet: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .select('balance')
    .eq('wallet_address', wallet)
    .single();

  if (error) throw error;
  return data?.balance || 0;
};

export const updateWalletBalance = async (wallet: string, amount: number) => {
  const { data, error } = await supabase
    .from('wallets')
    .update({ balance: amount })
    .eq('wallet_address', wallet)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Add other API functions you have in the file...

// Example of a common function that had the 'any' error:
export const createInvestment = async (userId: string, amount: number, wallet: string) => {
  const { data, error } = await supabase
    .from('investments')
    .insert({ user_id: userId, amount, wallet_address: wallet })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ... rest of your api.ts functions (keep them as they are, just ensure parameters have types)
