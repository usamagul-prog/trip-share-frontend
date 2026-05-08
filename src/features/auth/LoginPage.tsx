import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { MapPin, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PhoneInput, toE164 } from './components/PhoneInput';
import { OtpInput } from './components/OtpInput';
import { usePhoneAuth } from './hooks/usePhoneAuth';
import { useAuthStore } from '@/store/authStore';
import type { AuthUser } from '@/store/authStore';
import api from '@/lib/api';

const TRUST_BULLETS = [
  'Verified users only — OTP on every account',
  'Trips across 50+ cities in Pakistan',
  'No hidden fees — pay cash on arrival',
];

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { step, loading, error, sendOtp, confirmOtp, resetError } = usePhoneAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async () => {
    setOtp('');
    resetError();
    if (phone.length < 10) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    await sendOtp(toE164(phone));
  };

  const handleConfirmAndLogin = async (code: string) => {
    if (code.length < 6) return;
    if (submitting) return;
    setSubmitting(true);
    try {
      const idToken = await confirmOtp(code);
      const res = await api.post<{ token: string; user: AuthUser }>('/auth/login', { idToken });
      setAuth(res.data.token, res.data.user);
      navigate('/trips');
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } }).response?.status;
      const firebaseCode = (err as { code?: string }).code;
      if (status === 404) {
        toast.info('No account found for this number. Redirecting to register…');
        navigate('/register');
      } else if (!firebaseCode?.startsWith('auth/')) {
        // Firebase errors are already shown by the hook; only show toast for API errors
        toast.error('Login failed. Please try again.');
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
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to your account to continue</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                {step === 'phone'
                  ? 'Enter your registered mobile number'
                  : 'Enter the 6-digit code sent to your phone'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'phone' && (
                <div className="space-y-4">
                  <PhoneInput value={phone} onChange={setPhone} disabled={loading} />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                    {loading && <Spinner size="sm" className="mr-2" />}
                    Send OTP
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    New to TripShare?{' '}
                    <Link to="/register" className="text-primary underline underline-offset-4">
                      Create account
                    </Link>
                  </p>
                </div>
              )}

              {step === 'otp' && (
                <div className="space-y-4">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleConfirmAndLogin}
                    disabled={loading || submitting}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    className="w-full"
                    onClick={() => handleConfirmAndLogin(otp)}
                    disabled={loading || submitting || otp.length < 6}
                  >
                    {(loading || submitting) && <Spinner size="sm" className="mr-2" />}
                    Verify &amp; Login
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={handleSendOtp}
                    disabled={loading || submitting}
                  >
                    Resend OTP
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
