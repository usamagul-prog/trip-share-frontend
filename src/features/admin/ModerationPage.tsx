import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import adminApi from '@/lib/adminApi';
import type { AdminReport } from './types';

const STATUS_OPTIONS = ['', 'pending', 'reviewed', 'dismissed'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-green-100 text-green-700',
  dismissed: 'bg-gray-100 text-gray-500',
};

export default function ModerationPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [actioning, setActioning] = useState<string | null>(null);
  const limit = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await adminApi.get<{ reports: AdminReport[]; total: number }>(
        `/admin/moderation?${params}`,
      );
      setReports(data.reports);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: 'reviewed' | 'dismissed') => {
    setActioning(id);
    try {
      await adminApi.put(`/admin/moderation/${id}`, { status });
      toast.success(`Report marked as ${status}`);
      fetch();
    } catch {
      toast.error('Failed to update report');
    } finally {
      setActioning(null);
    }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Content Moderation</h2>
        <span className="text-gray-500 text-sm">{total} reports</span>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || 'All'}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8 text-gray-400">Loading…</div>
        )}
        {!loading && reports.length === 0 && (
          <div className="text-center py-8 text-gray-400">No reports found</div>
        )}
        {!loading && reports.map((r) => (
          <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] ?? ''}`}>
                    {r.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString('en-PK')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Reporter:</span> {r.reporter?.name} ({r.reporter?.phone})
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Reason:</span> {r.reason}
                </p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="text-xs text-gray-500 mb-1">Flagged message by {r.message?.sender?.name}:</p>
                  <p className="text-gray-800 italic">"{r.message?.text}"</p>
                </div>
              </div>
              {r.status === 'pending' && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                    onClick={() => updateStatus(r._id, 'reviewed')}
                    disabled={actioning === r._id}
                  >
                    Mark Reviewed
                  </button>
                  <button
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => updateStatus(r._id, 'dismissed')}
                    disabled={actioning === r._id}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
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
    </div>
  );
}
