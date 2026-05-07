import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { step, loading, error, sendOtp, confirmOtp } = usePhoneAuth();
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
    if (phone.length < 9) {
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
        { idToken, name: data.name, role: data.role },
      );
      setAuth(res.data.token, res.data.user);
      navigate('/');
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div id="recaptcha-container" />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">TripShare</h1>
          <p className="text-muted-foreground mt-1">Intercity carpooling for Pakistan</p>
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
  );
}
