import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { MapPin, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { PhoneInput, toE164 } from './components/PhoneInput';
import { OtpInput } from './components/OtpInput';
import { usePhoneAuth } from './hooks/usePhoneAuth';
import { useAuthStore } from '@/store/authStore';
import type { AuthUser } from '@/store/authStore';
import api from '@/lib/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  role: z.enum(['driver', 'rider'] as const, { error: 'Please select a role' }),
  dob: z.string().optional(),
  terms_accepted: z.literal(true, { error: 'You must accept the Terms of Service' }),
});
type ProfileForm = z.infer<typeof profileSchema>;

const TRUST_BULLETS = [
  'Verified users only — OTP on every account',
  'Trips across 50+ cities in Pakistan',
  'No hidden fees — pay cash on arrival',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { step, loading, error, sendOtp, confirmOtp, resetError } = usePhoneAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [idToken, setIdToken] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });
  const selectedRole = watch('role');

  const handleSendOtp = async () => {
    setOtp('');
    resetError();
    if (phone.length < 10) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    await sendOtp(toE164(phone));
  };

  const handleConfirmOtp = async (code: string) => {
    if (code.length < 6) return;
    try {
      const token = await confirmOtp(code);
      setIdToken(token);
    } catch {
      // error message already set by the hook
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    if (!idToken) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ token: string; user: AuthUser }>(
        '/auth/register',
        { idToken, name: data.name, role: data.role, dob: data.dob, terms_accepted: data.terms_accepted },
      );
      setAuth(res.data.token, res.data.user);
      navigate('/trips');
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } }).response?.status;
      if (status === 409) {
        toast.error('Phone already registered. Please login instead.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div id="recaptcha-container" />

      {/* Left branded panel — desktop only */}
      <div className="hidden md:flex md:w-1/2 lg:w-[45%] bg-primary text-primary-foreground flex-col justify-between p-10 relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">TripShare</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold leading-tight">
              Share the road.<br />Share the cost.
            </h2>
            <p className="text-primary-foreground/70 text-base leading-relaxed">
              Pakistan's intercity carpooling platform — connecting drivers and riders across every major city.
            </p>
          </div>

          <ul className="space-y-3">
            {TRUST_BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-primary-foreground/90">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/40">© 2025 TripShare · Pakistan</p>
      </div>

      {/* Right panel — the form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-6 sm:p-10">
        {/* Mobile logo — shown only below md */}
        <div className="md:hidden flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">TripShare</span>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-1 text-sm">Intercity carpooling for Pakistan</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                {step === 'phone' && 'Enter your mobile number to get started'}
                {step === 'otp' && !idToken && 'Enter the 6-digit code sent to your phone'}
                {idToken && 'Almost there — tell us about yourself'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Phone */}
              {step === 'phone' && (
                <div className="space-y-4">
                  <PhoneInput value={phone} onChange={setPhone} disabled={loading} />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                    {loading && <Spinner size="sm" className="mr-2" />}
                    Send OTP
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary underline underline-offset-4">
                      Login
                    </Link>
                  </p>
                </div>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && !idToken && (
                <div className="space-y-4">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleConfirmOtp}
                    disabled={loading}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    className="w-full"
                    onClick={() => handleConfirmOtp(otp)}
                    disabled={loading || otp.length < 6}
                  >
                    {loading && <Spinner size="sm" className="mr-2" />}
                    Verify
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </Button>
                </div>
              )}

              {/* Step 3: Profile */}
              {idToken && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Ali Khan" {...register('name')} />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
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
                    {errors.role && (
                      <p className="text-sm text-destructive">{errors.role.message}</p>
                    )}
                  </div>

                  {selectedRole === 'driver' && (
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth <span className="text-muted-foreground text-xs">(must be 18+)</span></Label>
                      <Input
                        id="dob"
                        type="date"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        {...register('dob')}
                      />
                      {errors.dob && <p className="text-sm text-destructive">{errors.dob.message}</p>}
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
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Terms of Service</a>
                      {selectedRole === 'driver' && (
                        <> and the <a href="/terms#driver-liability" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Driver Liability Disclaimer</a></>
                      )}
                    </Label>
                  </div>
                  {errors.terms_accepted && (
                    <p className="text-sm text-destructive">{errors.terms_accepted.message}</p>
                  )}

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Spinner size="sm" className="mr-2" />}
                    Create Account
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
