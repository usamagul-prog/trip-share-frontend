import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useReviews } from './hooks/useReviews';
import ReviewCard from './components/ReviewCard';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

type Tab = 'received' | 'given';

export default function ReviewHistoryPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('received');
  const { reviews, loading, error } = useReviews(user?._id ?? '', tab);

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Reviews</h1>

      <div className="flex gap-2 border-b">
        {(['received', 'given'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      )}

      {error && <p className="text-center text-destructive">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {tab === 'received' ? 'No reviews received yet' : "You haven't reviewed anyone yet"}
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <Card>
          <CardContent className="pt-2">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} perspective={tab} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
