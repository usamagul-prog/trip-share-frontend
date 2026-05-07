import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { BookingWithTrip } from '@/features/trips/types';

export function useMyBookings(tab: 'upcoming' | 'history' = 'upcoming') {
  const [bookings, setBookings] = useState<BookingWithTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ bookings: BookingWithTrip[] }>('/api/bookings/my', {
        params: { tab },
      });
      setBookings(data.bookings);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}
