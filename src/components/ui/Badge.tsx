export default function Badge({ label }: { label: string }) {
  return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{label}</span>;
}
