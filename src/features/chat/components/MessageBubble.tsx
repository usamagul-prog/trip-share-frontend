export default function MessageBubble({ text, isOwn }: { text: string; isOwn: boolean }) {
  return <div className={isOwn ? 'text-right' : 'text-left'}>{text}</div>;
}
