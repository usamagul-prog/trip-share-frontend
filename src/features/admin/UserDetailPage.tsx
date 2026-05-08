import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import adminApi from '@/lib/adminApi';
import type { AdminUserDetail, AdminTrip } from './types';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [reason, setReason] = useState('');
  const [acting, setActing] = useState(false);

  useEffect(() => {
    adminApi.get<{ user: AdminUserDetail }>(`/admin/users/${id}`)
      .then(({ data }) => setUser(data.user))
      .catch(() => toast.error('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSuspend() {
    if (!reason.trim()) { toast.error('Please enter a suspension reason'); return; }
    setActing(true);
    try {
      const { data } = await adminApi.put<{ user: AdminUserDetail }>(`/admin/users/${id}/suspend`, { reason });
      setUser(data.user);
      setShowSuspendModal(false);
      setReason('');
      toast.success('User suspended');
    } catch {
      toast.error('Failed to suspend user');
    } finally {
      setActing(false);
    }
  }

  async function handleUnsuspend() {
    setActing(true);
    try {
      const { data } = await adminApi.put<{ user: AdminUserDetail }>(`/admin/users/${id}/unsuspend`);
      setUser(data.user);
      toast.success('User unsuspended');
    } catch {
      toast.error('Failed to unsuspend user');
    } finally {
      setActing(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>;
  if (!user) return <div className="p-8 text-gray-500">User not found</div>;

  return (
    <div className="p-8 max-w-4xl">
      <button onClick={() => navigate('/admin/users')} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back to Users</button>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.phone} {user.email ? `· ${user.email}` : ''}</p>
            <p className="text-sm mt-1 capitalize">{user.role} · Rating {user.avg_rating.toFixed(1)} ({user.review_count} reviews)</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {user.status}
            </span>
            {user.status === 'active' ? (
              <button
                onClick={() => setShowSuspendModal(true)}
                disabled={user.role === 'admin'}
                className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 disabled:opacity-40"
              >
                Suspend
              </button>
            ) : (
              <button
                onClick={handleUnsuspend}
                disabled={acting}
                className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 disabled:opacity-40"
              >
                Unsuspend
              </button>
            )}
          </div>
        </div>
        {user.suspension_reason && (
          <p className="mt-3 text-sm text-red-600">Suspended: {user.suspension_reason}</p>
        )}
      </div>

      <Section title="Recent Trips as Driver">
        {user.trips.length === 0 ? (
          <p className="text-sm text-gray-500">No trips</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                {['Route', 'Date', 'Status', 'Seats'].map((h) => (
                  <th key={h} className="text-left pb-2 text-xs text-gray-500 uppercase font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {user.trips.map((t: AdminTrip) => (
                <tr key={t._id} className="border-b last:border-0">
                  <td className="py-2">{t.origin} → {t.destination}</td>
                  <td className="py-2">{new Date(t.departure_time).toLocaleDateString()}</td>
                  <td className="py-2 capitalize">{t.status}</td>
                  <td className="py-2">{t.seats_available}/{t.seats_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Recent Bookings as Rider">
        {user.bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                {['Route', 'Date', 'Status', 'Pickup'].map((h) => (
                  <th key={h} className="text-left pb-2 text-xs text-gray-500 uppercase font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {user.bookings.map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="py-2">{b.trip.origin} → {b.trip.destination}</td>
                  <td className="py-2">{new Date(b.trip.departure_time).toLocaleDateString()}</td>
                  <td className="py-2 capitalize">{b.status}</td>
                  <td className="py-2">{b.pickup_point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-lg mb-4">Suspend User</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter suspension reason…"
              rows={3}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowSuspendModal(false); setReason(''); }} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={handleSuspend} disabled={acting} className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                {acting ? 'Suspending…' : 'Confirm Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
