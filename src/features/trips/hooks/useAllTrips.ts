import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Trip } from '../types';

export function useAllTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ trips: Trip[] }>('/trips', { params: { limit: 50 } })
      .then((r) => setTrips(r.data.trips))
      .catch(() => setError('Failed to load trips'))
      .finally(() => setLoading(false));
  }, []);

  return { trips, loading, error };
}
