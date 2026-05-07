export default function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder="6-digit OTP" maxLength={6} />;
}
