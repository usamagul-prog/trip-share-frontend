import { useState } from 'react';
import { MoreHorizontal, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '../hooks/useChat';

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  onReport: (messageId: string, reason: string) => Promise<void>;
}

export default function MessageBubble({ message, isOwn, onReport }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [reporting, setReporting] = useState(false);

  const handleReport = async () => {
    const reason = window.prompt('Reason for reporting this message:');
    if (!reason?.trim()) return;
    setReporting(true);
    try {
      await onReport(message._id, reason.trim());
      window.alert('Message reported. Thank you.');
    } finally {
      setReporting(false);
      setShowMenu(false);
    }
  };

  const time = new Date(message.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={cn('flex mb-2', isOwn ? 'justify-end' : 'justify-start')}>
      <div className="relative max-w-[75%] group">
        <div
          className={cn(
            'px-3 py-2 rounded-2xl text-sm leading-snug',
            isOwn
              ? 'bg-emerald-600 text-white rounded-br-sm'
              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm',
          )}
        >
          {!isOwn && (
            <p className="text-xs font-semibold text-emerald-700 mb-0.5">{message.sender.name}</p>
          )}
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
          <p className={cn('text-[10px] mt-1 text-right', isOwn ? 'text-emerald-200' : 'text-gray-400')}>
            {time}
          </p>
        </div>
        {!isOwn && (
          <button
            className="absolute -right-7 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600"
            onClick={() => setShowMenu((v) => !v)}
          >
            <MoreHorizontal size={14} />
          </button>
        )}
        {showMenu && (
          <div className="absolute -right-28 top-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
              onClick={handleReport}
              disabled={reporting}
            >
              <Flag size={14} /> Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
