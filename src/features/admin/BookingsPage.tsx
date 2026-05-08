import { useEffect, useState, useCallback } from 'react';
import adminApi from '@/lib/adminApi';
import type { AdminBookingFull } from './types';

const STATUS_OPTIONS = ['', 'pending', 'confirmed', 'rejected', 'cancelled', 'completed'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingFull[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const limit = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (status) params.set('status', status);
      const { data } = await adminApi.get<{ bookings: AdminBookingFull[]; total: number }>(
        `/admin/bookings?${params}`,
      );
      setBookings(data.bookings);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { fetch(); }, [fetch]);

  const pages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <span className="text-gray-500 text-sm">{total} total</span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || 'All statuses'}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {['Rider', 'Driver', 'Route', 'Departure', 'Status', 'Created'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td>
              </tr>
            )}
            {!loading && bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{b.rider?.name}</p>
                  <p className="text-gray-500 text-xs">{b.rider?.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{b.trip?.driver?.name}</p>
                  <p className="text-gray-500 text-xs">{b.trip?.driver?.phone}</p>
                </td>
                <td className="px-4 py-3">
                  {b.trip?.origin} → {b.trip?.destination}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {b.trip?.departure_time
                    ? new Date(b.trip.departure_time).toLocaleString('en-PK')
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] ?? ''}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(b.createdAt).toLocaleDateString('en-PK')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button className="px-3 py-1 border rounded disabled:opacity-40" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">{page} / {pages}</span>
          <button className="px-3 py-1 border rounded disabled:opacity-40" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
