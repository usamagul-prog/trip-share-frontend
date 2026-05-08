import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '@/lib/adminApi';
import type { AdminTrip, AdminStats } from './types';

export default function TripsPage() {
  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    origin: '',
    destination: '',
    from: '',
    to: '',
  });
  const navigate = useNavigate();
  const limit = 20;

  useEffect(() => {
    adminApi.get<AdminStats>('/admin/trips/stats').then(({ data }) => setStats(data));
  }, []);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (filters.status) params.set('status', filters.status);
      if (filters.origin) params.set('origin', filters.origin);
      if (filters.destination) params.set('destination', filters.destination);
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);
      const { data } = await adminApi.get<{ trips: AdminTrip[]; total: number }>(`/admin/trips?${params}`);
      setTrips(data.trips);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  function handleFilterChange(key: keyof typeof filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Trips</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Monitor all trips across the platform</p>
      </div>

      {stats && (
        <div className="flex gap-4 mb-6">
          {[
            { label: 'Today', value: stats.today },
            { label: 'This Week', value: stats.thisWeek },
            { label: 'This Month', value: stats.thisMonth },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card rounded-xl border px-5 py-3 flex items-center gap-3">
              <span className="text-muted-foreground text-sm">{label}:</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All statuses</option>
          {['scheduled', 'active', 'completed', 'cancelled'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Origin"
          value={filters.origin}
          onChange={(e) => handleFilterChange('origin', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 w-36"
        />
        <input
          type="text"
          placeholder="Destination"
          value={filters.destination}
          onChange={(e) => handleFilterChange('destination', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 w-36"
        />
        <input
          type="date"
          value={filters.from}
          onChange={(e) => handleFilterChange('from', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => handleFilterChange('to', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : (
        <>
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {['Route', 'Driver', 'Date', 'Seats', 'Bookings', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => navigate(`/admin/trips/${t._id}`)}
                    className="border-b last:border-0 hover:bg-muted/30 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium">{t.origin} → {t.destination}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.driver.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(t.departure_time).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{t.seats_available}/{t.seats_total}</td>
                    <td className="px-4 py-3">{t.bookingCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No trips found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="flex items-center gap-2 mt-4">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-sm rounded-lg border bg-card hover:bg-muted disabled:opacity-40 transition-colors">Previous</button>
              <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
              <button disabled={page === pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-sm rounded-lg border bg-card hover:bg-muted disabled:opacity-40 transition-colors">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    scheduled: 'bg-primary/10 text-primary border border-primary/20',
    active: 'bg-green-500/10 text-green-600 border border-green-500/20',
    completed: 'bg-muted text-muted-foreground border border-border',
    cancelled: 'bg-destructive/10 text-destructive border border-destructive/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${colors[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
      {status}
    </span>
  );
}
