export default function Avatar({ src, name }: { src?: string; name: string }) {
  return src
    ? <img src={src} alt={name} className="w-10 h-10 rounded-full object-cover" />
    : <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">{name[0]}</div>;
}
