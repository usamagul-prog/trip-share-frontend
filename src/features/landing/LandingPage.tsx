import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Search, Users, Shield, CreditCard, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import PublicLayout from '@/components/layout/PublicLayout';

const ROUTES = [
  { from: 'Islamabad', to: 'Lahore', duration: '4h', fare: '1,200' },
  { from: 'Lahore', to: 'Karachi', duration: '14h', fare: '3,500' },
  { from: 'Islamabad', to: 'Mardan', duration: '2h', fare: '700' },
  { from: 'Lahore', to: 'Faisalabad', duration: '2.5h', fare: '600' },
];

const HOW_STEPS = [
  {
    icon: Car,
    title: 'Driver posts a trip',
    desc: 'Drivers heading intercity add their route, departure time, and available seats.',
  },
  {
    icon: Search,
    title: 'Rider finds & books',
    desc: 'Riders search by city and date, choose a trip, and specify their pickup point.',
  },
  {
    icon: Users,
    title: 'Travel together',
    desc: 'Driver confirms, both parties chat in-app, and payment is settled on arrival.',
  },
];

const TRUST = [
  { icon: Shield, title: 'SMS-verified accounts', desc: 'Every user verifies their phone number via OTP before joining.' },
  { icon: Star, title: 'Mutual ratings', desc: 'After each trip drivers and riders rate each other — bad actors get filtered out.' },
  { icon: CreditCard, title: 'No hidden fees', desc: 'Cash on arrival. You see the full fare upfront, we charge nothing extra.' },
];

export default function LandingPage() {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/trips', { replace: true });
  }, [token, navigate]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24 px-4">
        {/* Dot grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(221 83% 53% / 0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Radial glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Pakistan's #1 carpooling app
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-foreground leading-[1.05] tracking-tight">
            Intercity carpooling<br className="hidden sm:block" /> for Pakistan
          </h1>

          <p
            className="text-3xl font-bold text-primary"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}
          >
            سفر آسان، خرچ کم
          </p>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Share a ride between cities. Drivers offset fuel costs — riders travel
            cheaper than the bus, faster than the train.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Find a Trip
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center border border-primary text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/5 transition-colors"
            >
              Post a Trip
            </Link>
          </div>

          {/* Stat strip */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2 flex-wrap">
            <span className="font-medium text-foreground">10,000+ users</span>
            <span className="text-primary/40">·</span>
            <span className="font-medium text-foreground">50+ cities</span>
            <span className="text-primary/40">·</span>
            <span className="font-medium text-foreground">PKR 0 hidden fees</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold">How TripShare works</h2>
            <p className="text-muted-foreground mt-2 text-sm">Three simple steps to share the road</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative">
            {/* Connecting dashed lines — desktop only */}
            <div className="hidden sm:block absolute top-10 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] border-t-2 border-dashed border-primary/20" />

            {HOW_STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center space-y-4 relative">
                {/* Big background number */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <span className="absolute text-7xl font-black text-primary/10 select-none leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {i + 1}
                  </span>
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {i + 1}</span>
                <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular routes */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Popular routes</h2>
            <p className="text-muted-foreground mt-2 text-sm">Most-booked intercity trips on TripShare</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROUTES.map((r) => (
              <div
                key={`${r.from}-${r.to}`}
                className="bg-card rounded-xl border border-border p-5 space-y-3 hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">{r.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                  <span className="font-semibold text-sm text-foreground">{r.to}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                    {r.duration}
                  </span>
                  <span className="text-xs font-semibold text-foreground">from PKR {r.fare}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4 text-sm"
            >
              Browse all trips
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold">Why riders trust TripShare</h2>
            <p className="text-muted-foreground mt-2 text-sm">Safety and transparency at every step</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TRUST.map((t) => (
              <div key={t.title} className="flex flex-col items-start space-y-4 p-7 rounded-2xl border border-border bg-background hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                  <t.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative blurred circles */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to share the road?</h2>
          <p className="text-primary-foreground/80 text-lg">Join thousands of Pakistanis already saving money on intercity travel.</p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
          >
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
