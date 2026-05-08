import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, User, Bell, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  Icon: React.ElementType;
  showBadge?: boolean;
}

const RIDER_LINKS: NavItem[] = [
  { to: '/trips',         label: 'Trips',         Icon: Home },
  { to: '/bookings',      label: 'Bookings',       Icon: CalendarDays },
  { to: '/chat',          label: 'Messages',       Icon: MessageCircle },
  { to: '/notifications', label: 'Alerts',         Icon: Bell, showBadge: true },
  { to: '/profile',       label: 'Profile',        Icon: User },
];

const DRIVER_LINKS: NavItem[] = [
  { to: '/trips',         label: 'My Trips',       Icon: Home },
  { to: '/chat',          label: 'Messages',       Icon: MessageCircle },
  { to: '/notifications', label: 'Alerts',         Icon: Bell, showBadge: true },
  { to: '/profile',       label: 'Profile',        Icon: User },
];

export default function BottomNav() {
  const user = useAuthStore((s) => s.user);
  const { unreadCount } = useNotifications();

  if (!user) return null;

  const links = user.role === 'driver' ? DRIVER_LINKS : RIDER_LINKS;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-around z-40 safe-area-pb md:hidden"
    >
      {links.map(({ to, label, Icon, showBadge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/trips'}
          aria-label={label}
          className={({ isActive }) =>
            cn(
              'relative flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-3 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <div className="relative">
            <Icon className="h-5 w-5" />
            {showBadge && unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
