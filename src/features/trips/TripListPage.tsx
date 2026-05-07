import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTrips } from './hooks/useTrips';
import { useSearchTrips } from './hooks/useSearchTrips';
import TripCard from './components/TripCard';
import CitySelect from './components/CitySelect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Trip } from './types';

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
  const { results, loading, error, search } = useSearchTrips();

  const handleFromChange = (v: string) => { setFrom(v); setSearched(false); };
  const handleToChange   = (v: string) => { setTo(v);   setSearched(false); };
  const handleDateChange = (v: string) => { setDate(v); setSearched(false); };

  const handleSearch = () => {
    if (!from || !to || !date) return;
    setSearched(true);
    search({ from, to, date });
  };

  const filtered = searched ? applyFilters(results, maxPrice, timeWindow) : [];
  const hasActiveFilters = maxPrice < 50000 || timeWindow !== 'all';

  return (
    <div className="container mx-auto p-4 max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Find a Trip</h1>

      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <CitySelect value={from} onChange={handleFromChange} placeholder="From" />
            <CitySelect value={to} onChange={handleToChange} placeholder="To" />
          </div>
          <input
            type="date"
            aria-label="Departure date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button
            className="w-full"
            onClick={handleSearch}
            disabled={!from || !to || !date || loading}
          >
            {loading ? 'Searching…' : 'Search Trips'}
          </Button>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Filters</p>
            {hasActiveFilters && (
              <button
                onClick={() => { setMaxPrice(50000); setTimeWindow('all'); }}
                className="text-xs text-primary underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Max price: PKR {maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min={0}
              max={50000}
              step={500}
              value={maxPrice}
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

      {loading && <div className="flex justify-center py-10"><Spinner /></div>}
      {!loading && error && <p className="text-center text-destructive py-6">{error}</p>}
      {!loading && searched && results.length === 0 && (
        <p className="text-center text-muted-foreground py-10">No trips found for this route</p>
      )}
      {!loading && searched && results.length > 0 && filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No trips match the current filters — try adjusting price or time.
        </p>
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
    <div className="container mx-auto p-4 max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Button onClick={() => navigate('/trips/create')}>Post a Trip</Button>
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
      {loading && <div className="flex justify-center py-10"><Spinner /></div>}
      {!loading && error && <p className="text-center text-destructive py-6">{error}</p>}
      {!loading && !error && trips.length === 0 && (
        <p className="text-center text-muted-foreground py-10">No {tab} trips yet</p>
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
