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

// Helper to convert DB array → WalletBalances object (matches your exact WalletBalances interface)
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
    if (key in balances && typeof item.balance === 'number') {
      balances[key] = item.balance;
    }
  });

  balances.total = (balances.deposit ?? 0) + (balances.roi ?? 0) + (balances.bonus ?? 0) + (balances.withdrawal ?? 0);
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

      // Realtime subscriptions
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
        {/* Total Assets Card */}
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

        {/* Deposit Balance */}
        <Card className="v56-glass premium-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Deposit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">${(balances?.deposit ?? 0).toFixed(2)}</p>
          </CardContent>
        </Card>

        {/* ROI Balance */}
        <Card className="v56-glass premium-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">${(balances?.roi ?? 0).toFixed(2)}</p>
          </CardContent>
        </Card>

        {/* Bonus Balance */}
        <Card className="v56-glass premium-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Bonus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">${(balances?.bonus ?? 0).toFixed(2)}</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 v56-glass premium-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Quick Actions
              <Link to="/deposit" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                Deposit <ArrowRight className="h-3 w-3" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild size="lg" className="h-14 text-base font-semibold">
              <Link to="/deposit">
                <ArrowDownToLine className="mr-2 h-5 w-5" />
                Deposit
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 text-base font-semibold">
              <Link to="/withdraw">
                <ArrowUpFromLine className="mr-2 h-5 w-5" />
                Withdraw
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className={cn("h-14 text-base font-semibold")}>
              <Link to="/referrals">
                <Users className="mr-2 h-5 w-5" />
                Invite
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 text-base font-semibold">
              <Link to="/profile">
                <Activity className="mr-2 h-5 w-5" />
                Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 v56-glass premium-border">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/transactions" className="text-primary text-sm flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center",
                        tx.transaction_type === 'deposit' || tx.transaction_type === 'roi_credit' || tx.transaction_type === 'referral_commission'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      )}>
                        {(tx.transaction_type === 'deposit' || tx.transaction_type === 'roi_credit' || tx.transaction_type === 'referral_commission') 
                          ? <ArrowDownToLine className="h-4 w-4" /> 
                          : <ArrowUpFromLine className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{tx.transaction_type.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-black",
                        (tx.transaction_type === 'deposit' || tx.transaction_type === 'roi_credit' || tx.transaction_type === 'referral_commission')
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}>
                        {(tx.transaction_type === 'deposit' || tx.transaction_type === 'roi_credit' || tx.transaction_type === 'referral_commission') ? '+' : '-'}
                        ${tx.net_amount.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">USDT</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ROI Timer - Fixed with required prop */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 v56-glass premium-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Next ROI Credit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ROITimer lastCreditAt={null} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
