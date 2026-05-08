import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Trip } from '../types';

export function useTrips(status: 'scheduled' | 'completed' | 'cancelled' = 'scheduled') {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ trips: Trip[] }>('/trips/my-trips', {
        params: { status },
      });
      setTrips(data.trips);
    } catch {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, refetch: fetchTrips };
}
