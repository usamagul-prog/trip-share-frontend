import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useTrip } from '@/features/trips/hooks/useTrip';
import StarRating from './components/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';

interface FormValues {
  rating: number;
  comment: string;
}

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') ?? '';
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trip, loading: tripLoading } = useTrip(id ?? '');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ defaultValues: { rating: 0, comment: '' } });

  const rating = watch('rating');
  const comment = watch('comment');

  const onSubmit = async (values: FormValues) => {
    if (values.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    try {
      await api.post('/api/reviews', {
        booking_id: bookingId,
        rating: values.rating,
        comment: values.comment || undefined,
      });
      toast.success('Review submitted');
      navigate(user?.role === 'rider' ? '/bookings' : '/');
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string; code?: string } } }).response
        ?.data;
      if (data?.code === 'DUPLICATE_REVIEW') {
        toast.error('You already reviewed this trip');
      } else if (data?.code === 'WINDOW_EXPIRED') {
        toast.error('Review window has closed (48 hours)');
      } else {
        toast.error(data?.error || 'Failed to submit review');
      }
    }
  };

  if (tripLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-lg space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {trip && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Reviewing trip</p>
            <p className="font-medium">
              {trip.origin} → {trip.destination}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(trip.departure_time).toLocaleDateString('en-PK', {
                dateStyle: 'medium',
              })}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Leave a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating *</label>
              <Controller
                control={control}
                name="rating"
                rules={{ min: { value: 1, message: 'Please select a rating' } }}
                render={() => (
                  <StarRating
                    value={rating}
                    interactive
                    onChange={(v) => setValue('rating', v)}
                  />
                )}
              />
              {errors.rating && (
                <p className="text-xs text-destructive">{errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="comment">
                Comment (optional)
              </label>
              <Controller
                control={control}
                name="comment"
                render={({ field }) => (
                  <textarea
                    id="comment"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Share your experience..."
                    maxLength={500}
                    rows={3}
                    {...field}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/500
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
