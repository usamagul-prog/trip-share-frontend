import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User, Star, CalendarDays, MapPin, MessageCircle } from 'lucide-react';
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
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const color = getAvatarColor(name);
  return (
    <span className={`h-8 w-8 rounded-full text-white text-xs font-bold flex items-center justify-center select-none shadow-sm ${color}`}>
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
      if (notifRef.current && !notifRef.current.contains(e.target as Node) &&
        notifBtnRef.current && !notifBtnRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node) &&
        userBtnRef.current && !userBtnRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { clearAuth(); navigate('/login'); };

  const driverLinks = [
    { to: '/trips', label: 'My Trips', Icon: MapPin },
    { to: '/chat', label: 'Messages', Icon: MessageCircle },
    { to: '/reviews', label: 'Reviews', Icon: Star },
  ];
  const riderLinks = [
    { to: '/trips', label: 'Find Trips', Icon: MapPin },
    { to: '/bookings', label: 'Bookings', Icon: CalendarDays },
    { to: '/chat', label: 'Messages', Icon: MessageCircle },
    { to: '/reviews', label: 'Reviews', Icon: Star },
  ];
  const navLinks = user?.role === 'driver' ? driverLinks : riderLinks;

  return (
    <header role="banner" className="h-14 bg-card border-b shadow-sm px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <Link to={user ? '/trips' : '/'} className="flex items-center gap-2 group">
          <span className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-primary/40 transition-shadow">
            <MapPin className="h-4 w-4 text-white" />
          </span>
          <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            TripShare
          </span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/trips'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                <Icon className="h-3.5 w-3.5" />
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
              className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-white text-[9px] flex items-center justify-center font-bold shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div ref={notifRef} className="absolute right-0 mt-2 w-80 bg-card border rounded-xl shadow-xl shadow-foreground/5 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                  <p className="text-sm font-semibold">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No notifications yet</p>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <NotificationItem key={n._id} notification={n} onRead={markRead} />
                    ))
                  )}
                </div>
                <div className="border-t px-4 py-2.5 bg-muted/20">
                  <Link to="/notifications" className="text-xs text-primary hover:underline font-medium" onClick={() => setNotifOpen(false)}>
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative ml-1">
            <button
              ref={userBtnRef}
              onClick={() => { setUserOpen((p) => !p); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg hover:bg-accent transition-colors"
              aria-label="User menu"
            >
              <UserAvatar name={user.name} />
              <span className="hidden md:block text-sm font-medium max-w-[110px] truncate">{user.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {userOpen && (
              <div ref={userRef} className="absolute right-0 mt-2 w-48 bg-card border rounded-xl shadow-xl shadow-foreground/5 z-50 py-1.5 overflow-hidden">
                <div className="px-3 py-2 border-b mb-1">
                  <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
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
