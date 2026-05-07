import { useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, onComplete, disabled }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  const updateDigit = (index: number, digit: string) => {
    const next = [...digits];
    next[index] = digit || ' ';
    const newValue = next.join('').trimEnd();
    onChange(newValue);
    if (digit && index < 5) refs.current[index + 1]?.focus();
    const complete = next.join('').replace(/ /g, '');
    if (complete.length === 6) onComplete?.(complete);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && digits[index] === ' ' && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, 5);
    refs.current[focusIndex]?.focus();
    if (pasted.length === 6) onComplete?.(pasted);
  };

  return (
    <div className="space-y-2">
      <Label>Verification Code</Label>
      <div className="flex gap-2 justify-center">
        {digits.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d"
            maxLength={1}
            value={digit.trim()}
            onChange={(e) => updateDigit(i, e.target.value.replace(/\D/g, '').slice(-1))}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="w-12 h-14 text-center text-xl font-semibold p-0"
            autoComplete="one-time-code"
          />
        ))}
      </div>
    </div>
  );
}
