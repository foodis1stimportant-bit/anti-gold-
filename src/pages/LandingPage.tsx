import { Shield, TrendingUp, Users, Zap, Globe, BarChart3, Loader2, Diamond } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '@/lib/analytics';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Gold3DIcon } from '@/components/ui/Gold3DIcon';
import { SEOHead, organizationSchema, websiteSchema, financialServiceSchema } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { getLandingPageSettings } from '@/db/api';
import { InvestmentPitch } from '@/components/landing/InvestmentPitch';

const iconMap: Record<string, any> = {
  "High Yield ROI": TrendingUp,
  "Bank-Grade Security": Shield,
  "Multi-Level Referral": Users,
  "Instant Processing": Zap,
  "Real-Time Analytics": BarChart3,
  "Global Access": Globe,
};

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { trackFunnelStep } = useAnalytics();

  useEffect(() => {
    fetchSettings();
    try {
      trackFunnelStep('landing_page_view', 1);
    } catch (e) {
      // Analytics tracking is optional - don't block render
      console.warn('[v0] Analytics tracking failed:', e);
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getLandingPageSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('[v0] Failed to fetch landing page settings:', err);
      setError('Failed to load settings');
      // Continue with default settings instead of blocking render
    } finally {
      setLoading(false);
    }
  };

  const getSectionContent = (name: string, defaultValue: any) => {
    const section = settings.find(s => s.section_name === name);
    return section ? section.content : defaultValue;
  };

  const hero = getSectionContent('hero', {
    badge: "Live Platform Status: Active",
    title: "The Gold Standard of Digital Wealth",
    description: "Join the elite circle of investors earning consistent 10% monthly ROI. Secure, transparent, and built for your financial freedom.",
    primary_button: "Start Investing",
    secondary_button: "Member Login"
  });

  const stats = getSectionContent('stats', [
    { value: "10K+", label: "Active Investors" },
    { value: "$5M+", label: "Total Deposited" },
    { value: "100%", label: "Payout Record" },
    { value: "24/7", label: "Live Support" }
  ]);

  const features = getSectionContent('features', {
    title: "Why Choose Us",
    subtitle: "Built for Performance",
    description: "We combine traditional gold stability with modern blockchain efficiency to deliver unmatched returns and security for our investors.",
    items: [
      { title: "High Yield ROI", desc: "Earn a consistent 10% monthly return on your investment, paid out automatically to your wallet." },
      { title: "Bank-Grade Security", desc: "Your assets are protected by enterprise-level encryption and secure cold storage protocols." },
      { title: "Multi-Level Referral", desc: "Unlock a powerful 15-tier commission structure, allowing you to earn from your network's growth at every depth." },
      { title: "Instant Processing", desc: "Deposits and withdrawals are processed with lightning speed through our automated system." },
      { title: "Real-Time Analytics", desc: "Track your earnings, team performance, and growth with our advanced dashboard." },
      { title: "Global Access", desc: "Invest from anywhere in the world using USDT. No borders, no limits, just pure growth." }
    ]
  });

  const seo = getSectionContent('seo', {
    title: "Gold X Usdt - Premium Crypto Investment Platform",
    description: "Experience the future of wealth generation with Gold X Usdt. 10% monthly ROI, secure blockchain infrastructure, and a powerful multi-level referral system.",
    keywords: ['gold usdt', 'crypto investment', 'passive income', 'high roi', 'secure wallet', 'usdt mining', 'wealth generation']
  });

  const cta = getSectionContent('cta', {
    title: "Ready to Transform Your Finances?",
    description: "Join thousands of satisfied investors who are already building their wealth with Gold X Usdt. Don't wait for opportunity—create it.",
    button_text: "Create Free Account"
  });

  const investment = getSectionContent('investment_plan', {
    title: "One Plan, Infinite Potential",
    description: "We believe in simplicity. One powerful plan designed to maximize your returns while minimizing risk. No hidden fees, no complex tiers.",
    features: [
      "Minimum Investment: 100 USDT",
      "Monthly ROI: 10% Guaranteed",
      "Principal Protection Included",
      "Instant Withdrawal Availability"
    ],
    plan_title: "Gold Plan",
    plan_subtitle: "The ultimate wealth builder",
    roi: "10%",
    min_deposit: "100 USDT",
    referral_bonus: "Up to 15%",
    duration: "Lifetime"
  });

  // Debug log to track render state
  console.log('[v0] LandingPage render state:', { loading, settingsCount: settings.length, error });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading Gold X Usdt...</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        type="website"
      />
      <Helmet>
        <script type="application/ld+json">{organizationSchema}</script>
        <script type="application/ld+json">{websiteSchema}</script>
        <script type="application/ld+json">{financialServiceSchema}</script>
      </Helmet>
      <div className="min-h-screen overflow-x-hidden">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-yellow-500/5 blur-[150px]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-4 overflow-hidden min-h-screen flex items-center">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 text-center lg:text-left space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full v56-glass mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/80">{hero.badge}</span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl lg:text-9xl font-black mb-6 tracking-tighter leading-[1.0] animate-in fade-in slide-in-from-bottom-8 duration-1000 italic">
                  {hero.title.includes('<br />') ? hero.title.split('<br />').map((text: string, i: number) => (
                    <span key={i} className={i === 1 ? "v56-gradient-text block mt-2" : ""}>
                      {text}
                    </span>
                  )) : (
                    <>
                      The Gold Standard <br />
                      <span className="v56-gradient-text italic">of Digital Wealth</span>
                    </>
                  )}
                </h1>
                
                <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 opacity-90 italic">
                  {hero.description} Experience the world's most sophisticated gold investment ecosystem. Designed for the discerning elite, built for the future of finance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 pt-4">
                  <Button asChild size="lg" className="h-16 px-12 rounded-2xl font-black tracking-widest uppercase premium-gradient shadow-luxury group transition-all hover:scale-105 active:scale-95">
                    <Link to="/signup" className="flex items-center gap-2">
                      {hero.primary_button} <Diamond className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-2xl font-black tracking-widest uppercase border-primary/20 hover:bg-primary/5 group transition-all hover:scale-105 active:scale-95">
                    <Link to="/login" className="flex items-center gap-2">
                      {hero.secondary_button} <TrendingUp className="ml-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Audited Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Instant Withdrawals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Global Access</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative w-full max-w-lg lg:max-w-xl animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-[80px]" />
                <div className="relative v56-glass p-2 rounded-3xl border border-primary/20 floating">
                  <div className="bg-background/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Logo size={40} className="" />
                        <div>
                          <p className="font-bold text-lg">Gold X Portfolio</p>
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +10.0% Monthly
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Current Balance</p>
                        <p className="text-xl font-bold font-mono">$12,450.00</p>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Monthly Growth</span>
                          <span className="text-primary font-bold">+ $1,245.00</span>
                        </div>
                        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                          <div className="h-full w-[75%] bg-gradient-to-r from-primary to-yellow-300 rounded-full animate-pulse" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-accent/30 border border-white/5">
                          <p className="text-xs text-muted-foreground mb-1">Active Deposit</p>
                          <p className="font-bold text-lg">$10,000</p>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/30 border border-white/5">
                          <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
                          <p className="font-bold text-lg text-primary">$2,450</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-12 -right-12 v56-glass p-4 rounded-2xl animate-bounce delay-700 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI Paid</p>
                      <p className="font-bold text-green-500">Successfully</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-8 v56-glass p-4 rounded-2xl animate-bounce delay-1000 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Community</p>
                      <p className="font-bold">Growing Fast</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 border-y border-primary/10 bg-black/60 backdrop-blur-3xl intersect-once intersect:animate-reveal-bottom opacity-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gold-shimmer opacity-5 pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {stats.map((stat: any, idx: number) => (
                <div key={idx} className="space-y-3 group hover:scale-110 transition-transform duration-500">
                  <div className="p-4 inline-block bg-white/5 border border-white/5 mb-4 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all rounded-[1px]">
                    <p className="text-4xl md:text-7xl font-black v56-gradient-text tracking-tighter italic">{stat.value}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 relative intersect-once intersect:animate-reveal-bottom opacity-0">
          <div className="container mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
              <Badge variant="outline" className="border-primary/30 text-primary font-black tracking-[0.3em] uppercase px-8 py-2 rounded-full bg-primary/10">
                {features.title}
              </Badge>
              <h3 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter italic">
                {features.subtitle.includes('Performance') ? (
                  <>Built for <span className="v56-gradient-text italic">Performance</span></>
                ) : features.subtitle}
              </h3>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto italic font-medium opacity-80 leading-relaxed">
                "{features.description}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.items.map((feature: any, idx: number) => {
                const Icon = iconMap[feature.title] || Shield;
                return (
                  <div key={idx} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative h-full v56-glass p-12 rounded-[3rem] border border-primary/10 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Icon size={120} className="text-primary" />
                      </div>
                      <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 border border-primary/20">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <h4 className="text-2xl font-black italic mb-4 tracking-tight uppercase">{feature.title}</h4>
                      <p className="text-muted-foreground leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                        "{feature.desc}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Interactive Investment Pitch */}
        <InvestmentPitch />


        {/* Investment Plan */}
        <section className="py-32 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent relative intersect-once intersect:animate-reveal-bottom opacity-0">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="flex-1 space-y-12">
                <div className="space-y-6">
                  <Badge variant="outline" className="border-primary/30 text-primary font-black tracking-[0.3em] uppercase px-8 py-2 rounded-full bg-primary/10">
                    Investment Plan
                  </Badge>
                  <h2 className="text-4xl md:text-7xl font-black italic leading-tight tracking-tighter">
                    {investment.title.includes('Infinite Potential') ? (
                      <>One Plan, <span className="v56-gradient-text italic">Infinite Potential</span></>
                    ) : investment.title}
                  </h2>
                  <p className="text-2xl text-muted-foreground leading-relaxed italic font-medium opacity-80">
                    "{investment.description}"
                  </p>
                </div>
                
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {investment.features.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
                        <Gold3DIcon name="security" size={24} />
                      </div>
                      <span className="text-xl font-black italic opacity-90">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="h-16 px-12 rounded-2xl font-black tracking-widest uppercase premium-gradient shadow-luxury group transition-all hover:scale-105 active:scale-95" asChild>
                  <Link to="/signup">
                    Start Earning Today <Diamond className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </Link>
                </Button>
              </div>

              <div className="flex-1 w-full max-w-lg">
                <Card className="v56-glass border-primary/20 rounded-[3rem] relative overflow-hidden group gold-shimmer p-2">
                  <div className="bg-black/80 backdrop-blur-3xl rounded-[2.8rem] overflow-hidden border border-white/5 p-12 space-y-12">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
                        Most Popular
                      </div>
                      <h3 className="text-4xl font-black v56-gradient-text tracking-tighter italic leading-none">{investment.plan_title}</h3>
                      <p className="text-xl text-muted-foreground italic font-medium opacity-60">"{investment.plan_subtitle}"</p>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                        <span className="text-8xl font-black text-white italic relative z-10">{investment.roi}</span>
                      </div>
                      <p className="text-muted-foreground text-xl font-bold uppercase tracking-widest opacity-60">Monthly ROI</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: "Minimum Deposit", value: investment.min_deposit },
                        { label: "Referral Bonus", value: investment.referral_bonus, highlight: true },
                        { label: "Plan Duration", value: investment.duration }
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center p-6 rounded-3xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                          <span className="text-muted-foreground uppercase font-black text-[10px] tracking-widest">{row.label}</span>
                          <span className={cn("font-black text-xl italic", row.highlight ? "text-primary" : "text-white")}>{row.value}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl premium-gradient shadow-luxury group transition-all hover:scale-105" asChild>
                      <Link to="/signup">Choose Elite Plan</Link>
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground italic opacity-60">
                      *T&Cs apply. Secure your financial future today.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Referral Section */}
        <section className="py-24 px-4 bg-accent/5 intersect-once intersect:animate-reveal-bottom opacity-0">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black v56-gradient-text tracking-tighter italic">
                15-Tier <span className="text-white">Elite Network</span>
              </h2>
              <p className="text-xl text-muted-foreground italic">Build your circle of trust and unlock massive global commissions across 15 levels of depth.</p>
            </div>

            <div className="mt-16 p-12 v56-glass border-primary/10 rounded-[3rem] text-center max-w-4xl mx-auto gold-shimmer relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-primary/20">
                Unlimited Scaling
              </div>
              <p className="text-2xl text-muted-foreground leading-relaxed italic font-medium">
                "Our multi-tier system is designed for massive growth. As your team expands into deeper levels, your earnings grow exponentially. There is no limit to how many direct partners you can have or how large your total network can become."
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 intersect-once intersect:animate-reveal-bottom opacity-0">
          <div className="container mx-auto">
            <div className="v56-glass rounded-[4rem] p-12 md:p-24 relative overflow-hidden text-center gold-shimmer border border-primary/20">
              <div className="absolute inset-0 bg-primary/5" />
              <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                <div className="space-y-6">
                  <Badge variant="outline" className="border-primary/30 text-primary font-black tracking-[0.3em] uppercase px-8 py-2 rounded-full bg-primary/10">
                    VIP ACCESS
                  </Badge>
                  <h2 className="text-4xl md:text-8xl font-black v56-gradient-text tracking-tighter italic leading-none">{cta.title}</h2>
                  <p className="text-xl md:text-2xl text-muted-foreground italic font-medium opacity-80 leading-relaxed">
                    "{cta.description}"
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                  <Button size="lg" className="h-20 px-16 rounded-[2rem] font-black tracking-[0.2em] uppercase premium-gradient shadow-luxury group transition-all hover:scale-105 active:scale-95 text-xl" asChild>
                    <Link to="/signup" className="flex items-center gap-3">
                      {cta.button_text} <Diamond className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-12 text-muted-foreground pt-12 border-t border-white/5 opacity-60">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="uppercase font-black text-[10px] tracking-widest">Bank-Grade Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="uppercase font-black text-[10px] tracking-widest">Instant Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span className="uppercase font-black text-[10px] tracking-widest">Global VIP Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
