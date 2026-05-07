import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTrips } from './hooks/useTrips';
import TripCard from './components/TripCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type Tab = 'scheduled' | 'completed' | 'cancelled';

const TABS: { label: string; value: Tab }[] = [
  { label: 'Upcoming', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function TripListPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('scheduled');
  const { trips, loading, error } = useTrips(tab);

  if (user?.role !== 'driver') {
    return (
      <div className="container mx-auto p-4 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Find a Trip</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-lg font-medium">Search coming soon</p>
            <p className="text-sm text-muted-foreground mt-1">
              Full trip search and booking arrives in the next release.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Button onClick={() => navigate('/trips/create')}>Post a Trip</Button>
      </div>

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              tab === t.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {!loading && error && (
        <p className="text-center text-destructive py-6">{error}</p>
      )}

      {!loading && !error && trips.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No {tab} trips yet
        </p>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
