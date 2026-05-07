export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  return (
    <input
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onSend((e.target as HTMLInputElement).value);
          (e.target as HTMLInputElement).value = '';
        }
      }}
      placeholder="Type a message..."
    />
  );
}
