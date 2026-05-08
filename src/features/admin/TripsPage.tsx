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
      <h2 className="text-2xl font-semibold mb-4">Trips</h2>

      {stats && (
        <div className="flex gap-4 mb-6">
          {[
            { label: 'Today', value: stats.today },
            { label: 'This Week', value: stats.thisWeek },
            { label: 'This Month', value: stats.thisMonth },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg shadow px-5 py-3 flex items-center gap-3">
              <span className="text-gray-500 text-sm">{label}:</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
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
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 w-36"
        />
        <input
          type="text"
          placeholder="Destination"
          value={filters.destination}
          onChange={(e) => handleFilterChange('destination', e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 w-36"
        />
        <input
          type="date"
          value={filters.from}
          onChange={(e) => handleFilterChange('from', e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => handleFilterChange('to', e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Route', 'Driver', 'Date', 'Seats', 'Bookings', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => navigate(`/admin/trips/${t._id}`)}
                    className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium">{t.origin} → {t.destination}</td>
                    <td className="px-4 py-3 text-gray-600">{t.driver.name}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(t.departure_time).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{t.seats_available}/{t.seats_total}</td>
                    <td className="px-4 py-3">{t.bookingCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No trips found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="flex items-center gap-2 mt-4">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-40">Previous</button>
              <span className="text-sm text-gray-600">Page {page} of {pages}</span>
              <button disabled={page === pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
