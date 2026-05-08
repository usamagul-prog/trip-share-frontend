import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User, Star, CalendarDays, Home } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import NotificationItem from '@/features/notifications/components/NotificationItem';
import { cn } from '@/lib/utils';

const AVATAR_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500',
  'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500',
  'bg-pink-500', 'bg-rose-500',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const color = getAvatarColor(name);
  return (
    <span className={`h-8 w-8 rounded-full text-white text-xs font-bold flex items-center justify-center select-none ${color}`}>
      {initials}
    </span>
  );
}

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const userBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        notifRef.current && !notifRef.current.contains(e.target as Node) &&
        notifBtnRef.current && !notifBtnRef.current.contains(e.target as Node)
      ) setNotifOpen(false);
      if (
        userRef.current && !userRef.current.contains(e.target as Node) &&
        userBtnRef.current && !userBtnRef.current.contains(e.target as Node)
      ) setUserOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const driverLinks = [
    { to: '/trips', label: 'My Trips', Icon: Home },
    { to: '/reviews', label: 'Reviews', Icon: Star },
  ];
  const riderLinks = [
    { to: '/trips', label: 'Find Trips', Icon: Home },
    { to: '/bookings', label: 'Bookings', Icon: CalendarDays },
    { to: '/reviews', label: 'Reviews', Icon: Star },
  ];
  const navLinks = user?.role === 'driver' ? driverLinks : riderLinks;

  return (
    <header role="banner" className="h-14 bg-background border-b px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to={user ? '/trips' : '/'} className="font-bold text-lg hover:opacity-80 transition-opacity">
          TripShare
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/trips'}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <div className="relative">
            <button
              ref={notifBtnRef}
              onClick={() => { setNotifOpen((p) => !p); setUserOpen(false); }}
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

            {notifOpen && (
              <div ref={notifRef} className="absolute right-0 mt-1 w-80 bg-background border rounded-md shadow-lg z-50">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <p className="text-sm font-semibold">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No notifications</p>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <NotificationItem key={n._id} notification={n} onRead={markRead} />
                    ))
                  )}
                </div>
                <div className="border-t px-3 py-2">
                  <Link to="/notifications" className="text-xs text-primary hover:underline" onClick={() => setNotifOpen(false)}>
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              ref={userBtnRef}
              onClick={() => { setUserOpen((p) => !p); setNotifOpen(false); }}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-md hover:bg-accent transition-colors"
              aria-label="User menu"
            >
              <UserAvatar name={user.name} />
              <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">{user.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {userOpen && (
              <div ref={userRef} className="absolute right-0 mt-1 w-44 bg-background border rounded-md shadow-lg z-50 py-1">
                <Link
                  to="/profile"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
