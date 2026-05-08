import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { Trip } from '../types';

interface SearchParams {
  from: string;
  to: string;
  date: string;
}

export function useSearchTrips() {
  const [results, setResults] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const { data } = await api.get<{ trips: Trip[] }>('/trips/search', { params });
      setResults(data.trips);
    } catch {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
