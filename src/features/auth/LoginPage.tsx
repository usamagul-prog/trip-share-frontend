import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { MapPin, Check, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/store/authStore';
import type { AuthUser } from '@/store/authStore';
import api from '@/lib/api';

const TRUST_BULLETS = [
  'Verified users only — secure email sign-in',
  'Trips across 50+ cities in Pakistan',
  'No hidden fees — pay cash on arrival',
];

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await api.post<{ token: string; user: AuthUser }>('/auth/login', { email, password });
      setAuth(res.data.token, res.data.user);
      navigate('/trips');
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } }).response?.status;
      if (status === 401) {
        toast.error('Invalid email or password.');
      } else if (status === 404) {
        toast.info('No account found. Redirecting to register…');
        navigate('/register');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel — desktop only */}
      <div className="hidden md:flex md:w-1/2 lg:w-[45%] bg-primary text-primary-foreground flex-col justify-between p-10 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">TripShare</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">Share the road.<br />Share the cost.</h2>
            <p className="mt-3 text-primary-foreground/80 text-base">
              Pakistan's intercity carpooling platform — connecting drivers and riders across every major city.
            </p>
          </div>
          <ul className="space-y-3">
            {TRUST_BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/50">© 2025 TripShare · Pakistan</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-background flex flex-col items-center justify-center p-6">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <div className="bg-primary rounded-xl p-2">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">TripShare</span>
        </div>

        <div className="w-full max-w-md space-y-2">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your email and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button className="w-full h-11 font-semibold" type="submit" disabled={loading || !email || !password}>
                  {loading && <Spinner size="sm" className="mr-2" />}
                  Sign In
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  New to TripShare?{' '}
                  <Link to="/register" className="text-primary underline underline-offset-4">
                    Create account
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
