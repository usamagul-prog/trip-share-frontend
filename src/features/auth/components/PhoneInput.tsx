export default function PhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder="+92XXXXXXXXXX" />;
}
