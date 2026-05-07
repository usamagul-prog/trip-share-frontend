import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { BookingWithTrip } from '@/features/trips/types';

export function useMyBookings(tab: 'upcoming' | 'history' = 'upcoming') {
  const [bookings, setBookings] = useState<BookingWithTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ bookings: BookingWithTrip[] }>('/api/bookings/my', {
        params: { tab },
        signal,
      });
      setBookings(data.bookings);
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ERR_CANCELED') return;
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    const controller = new AbortController();
    fetchBookings(controller.signal);
    return () => controller.abort();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: () => fetchBookings() };
}
