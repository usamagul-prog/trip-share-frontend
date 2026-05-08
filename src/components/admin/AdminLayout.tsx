import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store/adminStore';
import { LayoutDashboard, Users, Car, CalendarDays, ShieldAlert, LogOut, MapPin } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export function AdminLayout({ children }: Props) {
  const logout = useAdminStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="px-4 py-5 border-b border-gray-700 flex items-center gap-3">
          <div className="bg-primary rounded-lg p-1.5 flex-shrink-0">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">TripShare</p>
            <p className="text-xs text-gray-500 leading-tight">Admin</p>
          </div>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <Users className="h-4 w-4" />
            Users
          </NavLink>
          <NavLink
            to="/admin/trips"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <Car className="h-4 w-4" />
            Trips
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <CalendarDays className="h-4 w-4" />
            Bookings
          </NavLink>
          <NavLink
            to="/admin/moderation"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <ShieldAlert className="h-4 w-4" />
            Moderation
          </NavLink>
        </nav>
        <div className="border-t border-gray-700">
          <p className="text-xs text-gray-500 px-3 pt-3 pb-1">Session</p>
          <div className="p-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 w-full"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-background overflow-auto">
        {children}
      </main>
    </div>
  );
}
