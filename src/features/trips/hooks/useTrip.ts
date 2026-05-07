import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { TripWithBookings } from '../types';

export function useTrip(id: string) {
  const [trip, setTrip] = useState<TripWithBookings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ trip: TripWithBookings }>(`/api/trips/${id}`);
      setTrip(data.trip);
    } catch {
      setError('Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return { trip, loading, error, refetch: fetchTrip };
}
