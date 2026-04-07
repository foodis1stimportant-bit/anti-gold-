import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Users, ArrowRight, Activity, Calendar, Award, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactions, getWalletBalances } from '@/db/api';
import { supabase } from '@/db/supabase';
import { ROITimer } from '@/components/ROITimer';
import { Gold3DIcon } from '@/components/ui/Gold3DIcon';
import type { Transaction, WalletBalances } from '@/types';
import { cn } from '@/lib/utils';

// Helper to convert DB array → WalletBalances object (fixes TS2345)
const convertToWalletBalances = (rawData: { balance: number; currency: string }[]): WalletBalances => {
  const balances: WalletBalances = {
    deposit: 0,
    roi: 0,
    bonus: 0,
    withdrawal: 0,
    total: 0,
  };

  rawData.forEach((item) => {
    const key = item.currency.toLowerCase() as keyof Omit<WalletBalances, 'total'>;
    if (key in balances) {
      balances[key] = item.balance;
    }
  });

  balances.total = balances.deposit + balances.roi + balances.bonus + balances.withdrawal;
  return balances;
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [balances, setBalances] = useState<WalletBalances | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyRoi, setMonthlyRoi] = useState(10.00);
  const [dailyRoi, setDailyRoi] = useState(0.33);

  useEffect(() => {
    if (user) {
      loadData();

      // Setup realtime subscriptions
      const walletsChannel = supabase
        .channel(`public:wallets:user_id=eq.${user.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'wallets', 
          filter: `user_id=eq.${user.id}` 
        }, () => {
          getWalletBalances(user.id).then((rawData) => {
            setBalances(convertToWalletBalances(rawData));
          });
        })
        .subscribe();

      const transactionsChannel = supabase
        .channel(`public:transactions:user_id=eq.${user.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'transactions', 
          filter: `user_id=eq.${user.id}` 
        }, () => {
          getTransactions(user.id, 5).then(setTransactions);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(walletsChannel);
        supabase.removeChannel(transactionsChannel);
      };
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const { data: settingsData } = await supabase
        .from('settings')
        .select('key, value');
      
      if (settingsData) {
        const monthly = (settingsData as any[]).find(s => s.key === 'monthly_roi_percentage');
        const daily = (settingsData as any[]).find(s => s.key === 'daily_roi_percentage');
        if (monthly) setMonthlyRoi(parseFloat(monthly.value));
        if (daily) setDailyRoi(parseFloat(daily.value));
      }

      const [balancesDataRaw, transactionsData] = await Promise.all([
        getWalletBalances(user.id),
        getTransactions(user.id, 5)
      ]);

      setBalances(convertToWalletBalances(balancesDataRaw));
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = balances?.total ?? 0;

  if (loading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48 bg-muted rounded-xl" />
          <Skeleton className="h-14 w-64 bg-muted rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 bg-muted rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full bg-muted rounded-2xl" />
      </div>
    );
  }

  const getHighestLevel = () => {
    if (!profile) return 0;
    for (let i = 15; i >= 1; i--) {
      if ((profile as any)[`referral_level_${i}_enabled` as keyof typeof profile]) return i;
    }
    return 0;
  };

  const highestLevel = getHighestLevel();

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight leading-tight">
            Portfolio <span className="v56-gradient-text">Overview</span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Welcome back, {profile?.full_name || user?.email?.split('@')[0]}
            <Badge variant="outline" className="ml-2 bg-primary/10 border-primary/20 text-primary font-bold">
              Level {highestLevel} Member
            </Badge>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="v56-glass premium-border px-6 py-3 flex gap-6 items-center rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <Gold3DIcon name="roi" size={32} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Monthly ROI</p>
                <p className="text-xl font-bold text-primary leading-tight">{monthlyRoi.toFixed(2)}%</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <Gold3DIcon name="analytics" size={32} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Daily ROI</p>
                <p className="text-xl font-bold text-green-500 leading-tight">{dailyRoi.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Total Assets Card - Primary Focus */}
        <Card className="col-span-1 md:col-span-2 v56-glass premium-border relative overflow-hidden group gold-shimmer min-h-[160px] flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Logo size={140} />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="uppercase tracking-[0.2em] font-black text-[10px] text-muted-foreground">Total Portfolio Value</CardDescription>
            <CardTitle className="text-5xl font-black v56-gradient-text text-glow tabular-nums">
              ${totalBalance.toFixed(2)}
              <span className="text-xl ml-2 font-medium opacity-60">USDT</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-500 text-sm font-semibold">
              <TrendingUp className="h-4 w-4" />
              +2.4% this month
            </div>
          </CardContent>
        </Card>

        {/* Rest of your cards, transactions list, ROITimer, etc. go here */}
        {/* Paste the remaining JSX from your original file here (it is unchanged) */}
        {/* Example placeholder for other cards - replace with your actual code */}
        {/* ... your other Card components ... */}

      </div>

      {/* Add your remaining sections here (transactions, ROI timer, etc.) */}
      {/* Everything below this comment should be exactly the same as your original file */}

    </div>
  );
}
