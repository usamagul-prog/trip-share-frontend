import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
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

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['driver', 'rider'] as const, { error: 'Please select a role' }),
  dob: z.string().optional(),
  terms_accepted: z.literal(true, { error: 'You must accept the Terms of Service' }),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post<{ token: string; user: AuthUser }>('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        dob: data.dob,
        terms_accepted: data.terms_accepted,
      });
      setAuth(res.data.token, res.data.user);
      navigate('/trips');
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } }).response?.status;
      const msg = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
      if (status === 409) {
        toast.error('Email already registered. Please login instead.');
      } else {
        toast.error(msg ?? 'Registration failed. Please try again.');
      }
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
      <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="md:hidden flex items-center gap-2 mb-6">
          <div className="bg-primary rounded-xl p-2">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">TripShare</span>
        </div>

        <div className="w-full max-w-md space-y-2">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join thousands of Pakistanis already carpooling</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Ali Khan" {...register('name')} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register('email')} autoComplete="email" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      {...register('password')}
                      autoComplete="new-password"
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
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>I want to</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['driver', 'rider'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setValue('role', r, { shouldValidate: true })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedRole === r
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="text-2xl mb-1">{r === 'driver' ? '🚗' : '🎒'}</div>
                        <div className="font-semibold capitalize">{r}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {r === 'driver' ? 'Post trips & earn' : 'Find seats & travel'}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
                </div>

                {selectedRole === 'driver' && (
                  <div className="space-y-1">
                    <Label htmlFor="dob">
                      Date of Birth <span className="text-muted-foreground text-xs">(must be 18+)</span>
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                      {...register('dob')}
                    />
                    {errors.dob && <p className="text-xs text-destructive">{errors.dob.message}</p>}
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                    {...register('terms_accepted')}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-snug cursor-pointer">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                      Terms of Service
                    </a>
                  </Label>
                </div>
                {errors.terms_accepted && (
                  <p className="text-xs text-destructive">{errors.terms_accepted.message}</p>
                )}

                <Button type="submit" className="w-full h-11 font-semibold" disabled={isSubmitting}>
                  {isSubmitting && <Spinner size="sm" className="mr-2" />}
                  Create Account
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary underline underline-offset-4">
                    Login
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
