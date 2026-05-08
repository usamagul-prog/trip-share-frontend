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

interface MessagesResponse {
  messages: ChatMessage[];
  hasMore: boolean;
}

export function useChat(bookingId: string) {
  const token = useAuthStore((s) => s.token);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const oldestIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!bookingId || !token) return;

    api.get<MessagesResponse>(`/chat/${bookingId}/messages`)
      .then((r) => {
        setMessages(r.data.messages);
        setHasMore(r.data.hasMore);
        if (r.data.messages.length > 0) {
          oldestIdRef.current = r.data.messages[0]._id;
        }
      })
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

  const loadEarlier = useCallback(async () => {
    if (!oldestIdRef.current || loadingEarlier) return;
    setLoadingEarlier(true);
    try {
      const { data } = await api.get<MessagesResponse>(
        `/chat/${bookingId}/messages?before=${oldestIdRef.current}`
      );
      if (data.messages.length > 0) {
        oldestIdRef.current = data.messages[0]._id;
        setMessages((prev) => [...data.messages, ...prev]);
      }
      setHasMore(data.hasMore);
    } catch {
      // silent
    } finally {
      setLoadingEarlier(false);
    }
  }, [bookingId, loadingEarlier]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current) return;
    socketRef.current.emit('send-message', { bookingId, text: trimmed });
  }, [bookingId]);

  const reportMessage = useCallback(async (messageId: string, reason: string) => {
    await api.post(`/chat/messages/${messageId}/report`, { reason });
  }, []);

  return { messages, hasMore, loadingEarlier, connected, send, loadEarlier, reportMessage };
}
