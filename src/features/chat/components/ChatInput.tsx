import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t bg-white">
      <textarea
        className={cn(
          'flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          'max-h-32 min-h-[40px]',
        )}
        rows={1}
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
      <button
        className={cn(
          'p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors',
          (!text.trim() || disabled) && 'opacity-50 cursor-not-allowed',
        )}
        onClick={submit}
        disabled={!text.trim() || disabled}
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
