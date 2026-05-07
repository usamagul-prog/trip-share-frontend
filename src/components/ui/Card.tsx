export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg shadow p-4 bg-white ${className}`}>{children}</div>;
}
