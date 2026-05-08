import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export interface ChatMessage {
  _id: string;
  booking: string;
  sender: { _id: string; name: string; avatar_url?: string };
  text: string;
  is_read: boolean;
  createdAt: string;
}

export function useChat(bookingId: string) {
  const token = useAuthStore((s) => s.token);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!bookingId || !token) return;

    api.get<{ messages: ChatMessage[] }>(`/chat/${bookingId}/messages`)
      .then((r) => setMessages(r.data.messages))
      .catch(() => {});

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') ?? '', {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', bookingId);
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('new-message', (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      socket.emit('mark-read', bookingId);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bookingId, token]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current) return;
    socketRef.current.emit('send-message', { bookingId, text: trimmed });
  }, [bookingId]);

  const reportMessage = useCallback(async (messageId: string, reason: string) => {
    await api.post(`/chat/messages/${messageId}/report`, { reason });
  }, []);

  return { messages, connected, send, reportMessage };
}
