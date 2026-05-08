import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import adminApi from '@/lib/adminApi';
import type { AdminBookingFull } from './types';

const FILTER_OPTIONS = ['', 'pending', 'confirmed', 'rejected', 'cancelled', 'completed'];
const OVERRIDE_OPTIONS = ['confirmed', 'cancelled', 'completed'] as const;
type OverrideStatus = (typeof OVERRIDE_OPTIONS)[number];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
};

interface OverridePending {
  bookingId: string;
  status: OverrideStatus;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingFull[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [overridePending, setOverridePending] = useState<OverridePending | null>(null);
  const [overriding, setOverriding] = useState(false);
  const limit = 20;

  const fetchBookings = useCallback(async () => {
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

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function confirmOverride() {
    if (!overridePending) return;
    setOverriding(true);
    try {
      const { data } = await adminApi.put<{ booking: AdminBookingFull }>(
        `/admin/bookings/${overridePending.bookingId}/status`,
        { status: overridePending.status }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === overridePending.bookingId ? data.booking : b))
      );
      setOverridePending(null);
      toast.success(`Booking marked as ${overridePending.status}`);
    } catch {
      toast.error('Failed to update booking status');
    } finally {
      setOverriding(false);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <span className="text-gray-500 text-sm">{total} total</span>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          {FILTER_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || 'All statuses'}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {['Rider', 'Driver', 'Route', 'Departure', 'Status', 'Override', 'Created'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td>
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
                <td className="px-4 py-3">
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        setOverridePending({ bookingId: b._id, status: e.target.value as OverrideStatus });
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Set status…</option>
                    {OVERRIDE_OPTIONS.filter((o) => o !== b.status).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(b.createdAt).toLocaleDateString('en-PK')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {overridePending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-lg mb-2">Override booking status?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Change status to <strong>{overridePending.status}</strong>. This bypasses normal workflow rules.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setOverridePending(null)} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmOverride} disabled={overriding} className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-50">
                {overriding ? 'Updating…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
