import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PhoneInput({ value, onChange, disabled }: PhoneInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <div className="flex">
        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm select-none">
          🇵🇰 +92
        </span>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="3001234567"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          disabled={disabled}
          maxLength={10}
          className={cn('rounded-l-none')}
          autoComplete="tel"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Enter your 10-digit mobile number without the leading 0 (e.g. 3001234567)
      </p>
    </div>
  );
}

/** Converts a local Pakistani number like "3001234567" → "+923001234567" (E.164) */
export function toE164(localPhone: string): string {
  const digits = localPhone.replace(/\D/g, '');
  if (digits.startsWith('0')) return `+92${digits.slice(1)}`;
  return `+92${digits}`;
}
