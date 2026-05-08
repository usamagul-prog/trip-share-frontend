import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAdminStore } from '@/store/adminStore';
import adminApi from '@/lib/adminApi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAdminStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await adminApi.post<{ token: string }>('/admin/auth/login', { username, password });
      login(data.token);
      navigate('/admin');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 429) {
        toast.error('Too many attempts. Try again in 15 minutes.');
      } else {
        toast.error('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  }

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
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">TripShare Admin</span>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-extrabold leading-tight">
            Platform<br />Control Centre
          </h2>
          <p className="text-primary-foreground/80 text-base">
            Manage users, trips, driver documents, and reported content from one place.
          </p>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/50">© 2025 TripShare · Admin Access Only</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-background flex flex-col items-center justify-center p-6">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <div className="bg-primary rounded-xl p-2">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">TripShare Admin</span>
        </div>

        <div className="w-full max-w-md space-y-2">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Admin Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">Restricted access — authorised personnel only</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your admin username and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    autoComplete="username"
                    required
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
                      required
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
                <Button
                  className="w-full h-11 font-semibold"
                  type="submit"
                  disabled={loading || !username || !password}
                >
                  {loading && <Spinner size="sm" className="mr-2" />}
                  Sign in
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
