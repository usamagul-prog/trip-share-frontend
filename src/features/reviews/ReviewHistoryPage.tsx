import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useReviews } from './hooks/useReviews';
import ReviewCard from './components/ReviewCard';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewCardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

type Tab = 'received' | 'given';

export default function ReviewHistoryPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('received');
  const { reviews, loading, error } = useReviews(user?._id ?? '', tab);

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-4">
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
        <Card>
          <CardContent className="pt-2">
            {Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
          </CardContent>
        </Card>
      )}

      {error && <p className="text-center text-destructive">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <EmptyState
          icon={Star}
          title={tab === 'received' ? 'No reviews received yet' : "You haven't reviewed anyone yet"}
          description={tab === 'received' ? 'Reviews appear here after completed trips.' : 'After a completed trip, you can leave a review for your driver or rider.'}
        />
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
