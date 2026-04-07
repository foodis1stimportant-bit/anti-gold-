import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getROIAnalytics } from '@/db/api';
import { BarChart3, TrendingUp, Calendar, Zap, DollarSign, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SEOHead } from '@/lib/seo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ProjectionHub } from '@/components/dashboard/ProjectionHub';

export default function AnalyticsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await getROIAnalytics(user!.id, parseInt(period));
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalROI = data.reduce((sum, d) => sum + d.roi, 0);
  const totalBonus = data.reduce((sum, d) => sum + d.bonus, 0);

  return (
    <div className="p-6 space-y-6">
      <SEOHead 
        title="Earnings Analytics" 
        description="Track your historical earnings growth with interactive charts."
      />

      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit flex items-center gap-2 hover:bg-white/5" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold v56-gradient-text">Earnings Analytics</h1>
            <p className="text-muted-foreground">Detailed track of your growth on the platform</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px] v56-glass border-white/10">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="v56-glass premium-border bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Total Period Earnings</CardDescription>
            <CardTitle className="text-3xl font-black text-primary">${(totalROI + totalBonus).toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Overall growth in selected period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="v56-glass premium-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Personal ROI</CardDescription>
            <CardTitle className="text-3xl font-black text-foreground">${totalROI.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>Earnings from your capital</span>
            </div>
          </CardContent>
        </Card>

        <Card className="v56-glass premium-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Referral Bonuses</CardDescription>
            <CardTitle className="text-3xl font-black text-foreground">${totalBonus.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span>Earnings from your network</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="v56-glass premium-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Historical Earnings Growth</CardTitle>
          </div>
          <CardDescription>Daily breakdown of ROI and Bonuses</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {loading ? (
            <div className="h-full flex items-center justify-center">Loading chart data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBonus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.95)', 
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area 
                  type="monotone" 
                  dataKey="roi" 
                  name="Personal ROI"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRoi)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="bonus" 
                  name="Referral Bonus"
                  stroke="#fff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBonus)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="v56-glass border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Wealth Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enable "Auto-Compound" in your Profile settings to automatically reinvest your daily ROI. This triggers compound interest, accelerating your earnings growth exponentially over time.
            </p>
          </CardContent>
        </Card>
        
        <Card className="v56-glass border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Withdrawal Rule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Remember that referral bonuses have a 30-day cooling period before they can be moved to the withdrawal wallet. Personal ROI can be withdrawn every 48 hours once minimum limits are met.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="pt-10 border-t border-white/5">
        <ProjectionHub 
          initialInvestment={profile?.target_usdt ? Number(profile.target_usdt) : undefined} 
          initialRoi={profile?.custom_roi_percentage ? Number(profile.custom_roi_percentage) : undefined} 
          profileTargets={profile?.referral_level_targets}
        />
      </div>
    </div>
  );
}
// ... (all imports stay the same)

export default function AnalyticsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // FIXED: removed the 2 arguments (function now takes 0)
      const analyticsData = await getROIAnalytics();
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of your component stays exactly the same)
}
