import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Medal, Users } from 'lucide-react';
import { getLeaderboard } from '@/db/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Leader {
  id: string;
  username: string;
  avatar_url: string | null;
  total_invested: number;
  referral_count: number;
}

export function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaders() {
      try {
        const data = await getLeaderboard(5);
        setLeaders(data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    loadLeaders();
  }, []);

  if (loading) {
    return (
      <Card className="v56-glass premium-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Network Leaders
          </CardTitle>
          <CardDescription>Top earners by total invested</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 1: return <Medal className="h-4 w-4 text-slate-400" />;
      case 2: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return <Award className="h-4 w-4 text-primary opacity-50" />;
    }
  };

  const maskName = (name: string) => {
    if (name.length <= 3) return name;
    return name.substring(0, 1) + '***' + name.substring(name.length - 1);
  };

  return (
    <Card className="v56-glass premium-border overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Network Leaders
            </CardTitle>
            <CardDescription>Top performers by total invested</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-bold">
            Live Rankings
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {leaders.map((leader, index) => (
            <div key={leader.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {leader.username?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 border border-primary/20">
                    {getRankIcon(index)}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">{maskName(leader.username)}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {leader.referral_count} referrals
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-lg font-black text-primary">${leader.total_invested.toLocaleString()}</span>
                  <span className="text-[10px] font-bold opacity-60">USDT</span>
                </div>
              </div>
            </div>
          ))}
          {leaders.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              <p>Establishing rankings...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
