export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 pb-16">{children}</div>;
}
