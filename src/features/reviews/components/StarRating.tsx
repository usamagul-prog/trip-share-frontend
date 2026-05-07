export default function StarRating({ value }: { value: number }) {
  return <span>{'★'.repeat(value)}{'☆'.repeat(5 - value)}</span>;
}
