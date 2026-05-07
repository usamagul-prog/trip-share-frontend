import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Review } from '@/features/trips/types';

export function useReviews(userId: string, type: 'received' | 'given') {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (signal?: AbortSignal) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/api/reviews', {
          params: { userId, type },
          signal,
        });
        setReviews(data.reviews);
      } catch (err) {
        if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ERR_CANCELED') return;
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    },
    [userId, type]
  );

  useEffect(() => {
    const controller = new AbortController();
    setReviews([]);
    fetch(controller.signal);
    return () => controller.abort();
  }, [fetch]);

  return { reviews, loading, error, refetch: () => fetch() };
}
