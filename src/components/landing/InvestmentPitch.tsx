import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Gold3DIcon } from '@/components/ui/Gold3DIcon';
import { ChevronLeft, ChevronRight, Diamond, Globe, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/db/supabase';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

// ... (rest of your pitches array and chartConfig stay exactly the same)

export function InvestmentPitch() {
  const [currentStep, setCurrentStep] = useState(0);
  const [amount, setAmount] = useState('1000');
  const [monthlyRoi, setMonthlyRoi] = useState(10);
  const [isCompounding, setIsCompounding] = useState(true);
  const [payoutCounter, setPayoutCounter] = useState(85429100.45);
  const [activeInvestors, setActiveInvestors] = useState(12450);

  useEffect(() => {
    fetchSettings();
    const timer = setInterval(() => {
      setPayoutCounter(prev => prev + (Math.random() * 100));
      if (Math.random() > 0.95) setActiveInvestors(prev => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const fetchSettings = async () => {
    // FIXED: call the function with ()
    if (!isSupabaseConfigured()) {
      console.warn('[v0] InvestmentPitch: Skipping settings fetch - Supabase not configured');
      return;
    }
    
    try {
      const { data, error } = await supabase.from('settings').select('key, value');
      if (error) {
        console.warn('[v0] InvestmentPitch settings fetch warning:', error.message);
        return;
      }
      if (data) {
        const roiSetting = (data as any[]).find(s => s.key === 'monthly_roi_percentage');
        if (roiSetting) setMonthlyRoi(parseFloat(roiSetting.value));
      }
    } catch (e) {
      console.error('[v0] InvestmentPitch settings error:', e);
    }
  };

  // ... (rest of your component - nextStep, prevStep, chartData, return JSX - stays exactly the same)
}
