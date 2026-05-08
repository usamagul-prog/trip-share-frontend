import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useChat } from './hooks/useChat';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';

export default function ChatPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const { messages, connected, send, reportMessage } = useChat(bookingId ?? '');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!bookingId) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900">Trip Chat</h1>
        </div>
        <div className="flex items-center gap-1 text-xs">
          {connected ? (
            <><Wifi size={14} className="text-emerald-500" /><span className="text-emerald-600">Live</span></>
          ) : (
            <><WifiOff size={14} className="text-gray-400" /><span className="text-gray-400">Connecting…</span></>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-12">
            No messages yet. Say hello!
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.sender._id === currentUser?._id}
            onReport={reportMessage}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={send} disabled={!connected} />
    </div>
  );
}
