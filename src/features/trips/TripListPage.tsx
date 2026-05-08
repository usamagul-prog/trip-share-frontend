import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTrips } from './hooks/useTrips';
import { useAllTrips } from './hooks/useAllTrips';
import { useSearchTrips } from './hooks/useSearchTrips';
import TripCard from './components/TripCard';
import CitySelect from './components/CitySelect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TripCardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import { Trip } from './types';
import { Search, MapPin, X } from 'lucide-react';

type DriverTab = 'scheduled' | 'completed' | 'cancelled';
type TimeWindow = 'all' | 'morning' | 'afternoon' | 'evening';

const DRIVER_TABS: { label: string; value: DriverTab }[] = [
  { label: 'Upcoming', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const TIME_WINDOWS: { label: string; value: TimeWindow }[] = [
  { label: 'All times', value: 'all' },
  { label: 'Morning 6–12', value: 'morning' },
  { label: 'Afternoon 12–18', value: 'afternoon' },
  { label: 'Evening 18–24', value: 'evening' },
];

function applyFilters(trips: Trip[], maxPrice: number, timeWindow: TimeWindow): Trip[] {
  return trips.filter((t) => {
    if (t.fare > maxPrice) return false;
    if (timeWindow === 'all') return true;
    const h = new Date(t.departure_time).getHours();
    if (timeWindow === 'morning') return h >= 6 && h < 12;
    if (timeWindow === 'afternoon') return h >= 12 && h < 18;
    return h >= 18 && h < 24;
  });
}

function RiderView() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');
  const [searched, setSearched] = useState(false);

  const { trips: allTrips, loading: allLoading, error: allError } = useAllTrips();
  const { results: searchResults, loading: searchLoading, error: searchError, search } = useSearchTrips();

  const loading = searched ? searchLoading : allLoading;
  const error = searched ? searchError : allError;
  const baseTrips: Trip[] = searched ? searchResults : allTrips;
  const filtered = applyFilters(baseTrips, maxPrice, timeWindow);
  const hasActiveFilters = maxPrice < 50000 || timeWindow !== 'all';
  const hasSearchCriteria = from || to || date;

  const handleSearch = () => {
    if (!from || !to || !date) return;
    setSearched(true);
    search({ from, to, date });
  };

  const handleClearSearch = () => {
    setFrom(''); setTo(''); setDate('');
    setSearched(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Find a Trip</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Search available routes across Pakistan</p>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <CitySelect value={from} onChange={(v) => { setFrom(v); setSearched(false); }} placeholder="From" />
            <CitySelect value={to} onChange={(v) => { setTo(v); setSearched(false); }} placeholder="To" />
          </div>
          <input
            type="date"
            aria-label="Departure date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setSearched(false); }}
            min={new Date().toISOString().split('T')[0]}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleSearch}
              disabled={!from || !to || !date || loading}
            >
              {searchLoading ? 'Searching…' : 'Search Trips'}
            </Button>
            {(searched || hasSearchCriteria) && (
              <Button variant="outline" size="icon" onClick={handleClearSearch} title="Clear search">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {baseTrips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {searched ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found` : `${filtered.length} upcoming trip${filtered.length !== 1 ? 's' : ''}`}
            </p>
            {hasActiveFilters && (
              <button onClick={() => { setMaxPrice(50000); setTimeWindow('all'); }} className="text-xs text-primary underline">
                Clear filters
              </button>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Max price: PKR {maxPrice.toLocaleString()}</label>
            <input
              type="range" min={0} max={50000} step={500} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TIME_WINDOWS.map((tw) => (
              <Badge
                key={tw.value}
                variant={timeWindow === tw.value ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setTimeWindow(tw.value)}
              >
                {tw.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <TripCardSkeleton key={i} />)}
        </div>
      )}
      {!loading && error && <p className="text-center text-destructive py-6">{error}</p>}
      {!loading && searched && searchResults.length === 0 && (
        <EmptyState
          icon={Search}
          title="No trips found"
          description="Try a different route or date — new trips are posted daily."
        />
      )}
      {!loading && !error && baseTrips.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="No matches for these filters"
          description="Try adjusting the price range or time window."
          action={
            <button onClick={() => { setMaxPrice(50000); setTimeWindow('all'); }} className="text-sm text-primary underline">
              Clear filters
            </button>
          }
        />
      )}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((trip) => <TripCard key={trip._id} trip={trip} />)}
        </div>
      )}
    </div>
  );
}

function DriverView() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<DriverTab>('scheduled');
  const { trips, loading, error } = useTrips(tab);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Trips</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your posted routes</p>
        </div>
        <Button onClick={() => navigate('/trips/create')} className="shadow-sm shadow-primary/30">
          + Post a Trip
        </Button>
      </div>
      <div className="flex gap-2 mb-4">
        {DRIVER_TABS.map((t) => (
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
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <TripCardSkeleton key={i} />)}
        </div>
      )}
      {!loading && error && <p className="text-center text-destructive py-6">{error}</p>}
      {!loading && !error && trips.length === 0 && (
        <EmptyState
          icon={MapPin}
          title={`No ${tab} trips`}
          description={tab === 'scheduled' ? 'Post your first trip to get started.' : undefined}
          action={tab === 'scheduled' ? (
            <Button size="sm" onClick={() => navigate('/trips/create')}>Post a Trip</Button>
          ) : undefined}
        />
      )}
      {!loading && !error && trips.length > 0 && (
        <div className="space-y-3">
          {trips.map((trip) => <TripCard key={trip._id} trip={trip} />)}
        </div>
      )}
    </div>
  );
}

export default function TripListPage() {
  const { user } = useAuthStore();
  return user?.role === 'driver' ? <DriverView /> : <RiderView />;
}
