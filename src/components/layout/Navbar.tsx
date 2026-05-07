import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import NotificationItem from '@/features/notifications/components/NotificationItem';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="h-14 bg-white border-b px-4 flex items-center justify-between font-bold text-lg">
      <span>TripShare</span>

      {user && (
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setOpen((prev) => !prev)}
            className="relative p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div
              ref={panelRef}
              className="absolute right-0 mt-1 w-80 bg-background border rounded-md shadow-lg z-50"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <p className="text-sm font-semibold">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No notifications
                  </p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <NotificationItem
                      key={n._id}
                      notification={n}
                      onRead={markRead}
                    />
                  ))
                )}
              </div>
              <div className="border-t px-3 py-2">
                <Link
                  to="/notifications"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
