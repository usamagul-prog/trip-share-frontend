import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PhoneInput, toE164 } from './components/PhoneInput';
import { OtpInput } from './components/OtpInput';
import { usePhoneAuth } from './hooks/usePhoneAuth';
import { useAuthStore } from '@/store/authStore';
import type { AuthUser } from '@/store/authStore';
import api from '@/lib/api';

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
    setSubmitting(true);
    try {
      const idToken = await confirmOtp(code);
      const res = await api.post<{ token: string; user: AuthUser }>('/auth/login', { idToken });
      setAuth(res.data.token, res.data.user);
      navigate('/');
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div id="recaptcha-container" />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">TripShare</h1>
          <p className="text-muted-foreground mt-1">Welcome back</p>
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
  );
}
