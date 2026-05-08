import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '@/lib/adminApi';
import type { AdminStats } from './types';

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      adminApi.get<AdminStats>('/admin/trips/stats'),
      adminApi.get<{ total: number }>('/admin/users?limit=1'),
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data);
      setTotalUsers(usersRes.data.total);
    });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        <StatCard label="Total Users" value={totalUsers ?? '—'} />
        <StatCard label="Trips Today" value={stats?.today ?? '—'} />
        <StatCard label="This Week" value={stats?.thisWeek ?? '—'} />
        <StatCard label="This Month" value={stats?.thisMonth ?? '—'} />
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-700"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate('/admin/trips')}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-700"
        >
          View Trips
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
    </div>
  );
}
