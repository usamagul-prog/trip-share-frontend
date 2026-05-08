import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '@/lib/adminApi';
import type { AdminMetrics } from './types';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.get<AdminMetrics>('/admin/metrics').then((res) => setMetrics(res.data));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of platform activity</p>
      </div>

      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Users</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-8">
        <StatCard label="Total Users" value={metrics?.users.total ?? '—'} />
        <StatCard label="Drivers" value={metrics?.users.drivers ?? '—'} />
        <StatCard label="Riders" value={metrics?.users.riders ?? '—'} />
      </div>

      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Trips</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        <StatCard label="Active Trips" value={metrics?.trips.active ?? '—'} highlight />
        <StatCard label="Trips Today" value={metrics?.trips.today ?? '—'} />
        <StatCard label="This Week" value={metrics?.trips.thisWeek ?? '—'} />
        <StatCard label="This Month" value={metrics?.trips.thisMonth ?? '—'} />
      </div>

      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Bookings</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        <StatCard label="Pending" value={metrics?.bookings.pending ?? '—'} highlight />
        <StatCard label="Bookings Today" value={metrics?.bookings.today ?? '—'} />
        <StatCard label="This Week" value={metrics?.bookings.thisWeek ?? '—'} />
        <StatCard label="This Month" value={metrics?.bookings.thisMonth ?? '—'} />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate('/admin/trips')}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          View Trips
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border transition-shadow hover:shadow-md ${highlight ? 'bg-primary text-white border-primary/50 shadow-primary/20 shadow-lg' : 'bg-card border-border'}`}>
      <p className={`text-xs font-medium uppercase tracking-wider ${highlight ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
      <p className={`text-3xl font-bold mt-2 ${highlight ? 'text-white' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
