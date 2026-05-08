import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Search, Users, Shield, CreditCard, Star } from 'lucide-react';
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
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Intercity carpooling<br className="hidden sm:block" /> for Pakistan
          </h1>
          <p
            className="text-2xl font-medium text-primary"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}
          >
            سفر آسان، خرچ کم
          </p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Share a ride between cities. Drivers offset fuel costs — riders travel
            cheaper than the bus, faster than the train.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Find a Trip
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center border border-primary text-primary font-semibold px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Post a Trip
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">How TripShare works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step {i + 1}</span>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular routes */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Popular routes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROUTES.map((r) => (
              <div
                key={`${r.from}-${r.to}`}
                className="bg-white rounded-xl border p-5 space-y-2 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{r.from}</span>
                  <span className="text-muted-foreground text-xs">→</span>
                  <span className="font-semibold text-sm">{r.to}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{r.duration}</span>
                  <span className="font-medium text-foreground">from PKR {r.fare}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/register"
              className="text-primary font-medium hover:underline underline-offset-4 text-sm"
            >
              Browse all trips →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Why riders trust TripShare</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TRUST.map((t) => (
              <div key={t.title} className="flex flex-col items-start space-y-3 p-6 rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to share the road?</h2>
          <p className="text-primary-foreground/80">Join thousands of Pakistanis already saving money on intercity travel.</p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Create your account
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
