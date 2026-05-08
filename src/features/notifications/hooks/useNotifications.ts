import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { AppNotification } from '@/features/trips/types';

interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const LIMIT = 20;

  const fetchPage1 = useCallback(async () => {
    try {
      const { data } = await api.get<NotificationsResponse>(`/notifications?page=1&limit=${LIMIT}`);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setTotal(data.total);
      setPage(1);
    } catch {
      // silent — network errors shouldn't break UI
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage1();
    intervalRef.current = setInterval(fetchPage1, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPage1]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const { data } = await api.get<NotificationsResponse>(`/notifications?page=${nextPage}&limit=${LIMIT}`);
      setNotifications((prev) => [...prev, ...data.notifications]);
      setUnreadCount(data.unreadCount);
      setTotal(data.total);
      setPage(nextPage);
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  }, [page]);

  const markRead = useCallback(async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await api.patch('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  const hasMore = notifications.length < total;

  return {
    notifications,
    unreadCount,
    total,
    loading,
    loadingMore,
    hasMore,
    markRead,
    markAllRead,
    loadMore,
    refetch: fetchPage1,
  };
}
