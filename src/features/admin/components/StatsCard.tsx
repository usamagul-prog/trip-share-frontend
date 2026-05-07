export default function StatsCard({ label, value }: { label: string; value: number }) {
  return <div className="p-4 bg-white rounded shadow"><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold">{value}</p></div>;
}
