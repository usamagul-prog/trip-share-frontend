import { useNavigate } from 'react-router-dom';
import { AppNotification } from '@/features/trips/types';
import { cn } from '@/lib/utils';
import { Bell, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';

const typeIcon: Record<string, React.ReactNode> = {
  booking_request: <Bell className="h-4 w-4 text-blue-500" />,
  booking_accepted: <CheckCircle className="h-4 w-4 text-green-500" />,
  booking_rejected: <XCircle className="h-4 w-4 text-red-500" />,
  booking_cancelled: <XCircle className="h-4 w-4 text-orange-500" />,
  trip_cancelled: <AlertCircle className="h-4 w-4 text-red-500" />,
  review_prompt: <Star className="h-4 w-4 text-amber-500" />,
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface NotificationItemProps {
  notification: AppNotification;
  onRead: (id: string) => void;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.is_read) onRead(notification._id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full text-left flex gap-3 px-3 py-3 rounded-md transition-colors hover:bg-accent',
        !notification.is_read && 'bg-accent/50'
      )}
    >
      <span className="mt-0.5 shrink-0">
        {typeIcon[notification.type] ?? <Bell className="h-4 w-4 text-muted-foreground" />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{notification.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{notification.body}</p>
      </div>
      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
        {relativeTime(notification.createdAt)}
      </span>
    </button>
  );
}
