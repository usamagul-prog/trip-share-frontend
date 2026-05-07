import { useState } from 'react';
import { toast } from 'sonner';
import { useMyBookings } from './hooks/useMyBookings';
import BookingCard from './components/BookingCard';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

type Tab = 'upcoming' | 'history';

export default function MyBookingsPage() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const { bookings, loading, error, refetch } = useMyBookings(tab);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    setCancelLoading(bookingId);
    try {
      await api.delete(`/api/bookings/${bookingId}`);
      toast.success('Booking cancelled');
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to cancel booking';
      toast.error(msg);
    } finally {
      setCancelLoading(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      <div className="flex gap-2 mb-4">
        {(['upcoming', 'history'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
              tab === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-10"><Spinner /></div>}
      {!loading && error && <p className="text-center text-destructive py-6">{error}</p>}
      {!loading && !error && bookings.length === 0 && (
        <p className="text-center text-muted-foreground py-10">No {tab} bookings</p>
      )}
      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={() => handleCancel(booking._id)}
              cancelLoading={cancelLoading === booking._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
