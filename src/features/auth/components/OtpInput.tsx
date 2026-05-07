import { useRef, useId, KeyboardEvent, ClipboardEvent } from 'react';
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
  const firstId = useId();

  // Derive 6-slot array from string value
  const slots: string[] = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const setValue = (slots: string[]) => {
    const next = slots.join('');
    onChange(next);
    if (next.length === 6 && /^\d{6}$/.test(next)) onComplete?.(next);
  };

  const updateSlot = (index: number, digit: string) => {
    const next = [...slots];
    next[index] = digit;
    setValue(next);
    if (digit && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (slots[index]) {
        // Clear current slot
        const next = [...slots];
        next[index] = '';
        setValue(next);
      } else if (index > 0) {
        // Move to previous slot if current is empty
        refs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? '');
    setValue(next);
    const focusIndex = Math.min(pasted.length, 5);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${firstId}-0`}>Verification Code</Label>
      <div className="flex gap-2 justify-center">
        {slots.map((digit, i) => (
          <Input
            key={i}
            id={i === 0 ? `${firstId}-0` : undefined}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => updateSlot(i, e.target.value.replace(/\D/g, '').slice(-1))}
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
