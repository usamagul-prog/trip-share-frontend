import { useNotifications } from './hooks/useNotifications';
import NotificationItem from './components/NotificationItem';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No notifications yet</p>
      )}

      {!loading && notifications.length > 0 && (
        <div className="border rounded-md divide-y">
          {notifications.map((n) => (
            <NotificationItem key={n._id} notification={n} onRead={markRead} />
          ))}
        </div>
      )}
    </div>
  );
}
