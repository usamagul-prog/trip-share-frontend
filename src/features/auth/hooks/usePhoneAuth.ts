import { useState, useRef, useEffect } from 'react';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type PhoneAuthStep = 'phone' | 'otp';

export interface UsePhoneAuthReturn {
  step: PhoneAuthStep;
  loading: boolean;
  error: string | null;
  sendOtp: (phone: string) => Promise<void>;
  confirmOtp: (otp: string) => Promise<string>;
  resetError: () => void;
}

export function usePhoneAuth(): UsePhoneAuthReturn {
  const [step, setStep] = useState<PhoneAuthStep>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };
  }, []);

  const sendOtp = async (phone: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      confirmationRef.current = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaRef.current
      );
      setStep('otp');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Use format: +92XXXXXXXXXX');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait before trying again.');
      } else {
        setError('Failed to send OTP. Check the phone number and try again.');
      }
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const confirmOtp = async (otp: string): Promise<string> => {
    if (!confirmationRef.current) {
      setError('No OTP request in progress. Please request a new code.');
      throw new Error('No OTP request in progress');
    }
    setLoading(true);
    setError(null);
    try {
      const result = await confirmationRef.current.confirm(otp);
      return await result.user.getIdToken();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/invalid-verification-code') {
        setError('Incorrect OTP, try again.');
      } else if (code === 'auth/code-expired') {
        setError('OTP expired. Press "Resend".');
      } else {
        setError('OTP verification failed. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { step, loading, error, sendOtp, confirmOtp, resetError: () => setError(null) };
}
