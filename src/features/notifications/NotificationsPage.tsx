import { Bell } from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';
import NotificationItem from './components/NotificationItem';
import { Button } from '@/components/ui/button';
import { NotificationSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, loadingMore, hasMore, markRead, markAllRead, loadMore } =
    useNotifications();

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {loading && (
        <div className="border rounded-md divide-y">
          {Array.from({ length: 4 }).map((_, i) => <NotificationSkeleton key={i} />)}
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You'll be notified about booking requests, confirmations, and trip updates."
        />
      )}

      {!loading && notifications.length > 0 && (
        <>
          <div className="border rounded-md divide-y">
            {notifications.map((n) => (
              <NotificationItem key={n._id} notification={n} onRead={markRead} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMore}
                disabled={loadingMore}
                className="min-w-32"
              >
                {loadingMore ? <Spinner className="h-4 w-4" /> : 'Load more'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
