import { NavLink, Outlet, useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Car, CalendarCheck, LogOut, ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/cars', label: 'Voitures', icon: Car },
  { to: '/admin/reservations', label: 'Réservations', icon: CalendarCheck },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-remons-border transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-remons-border flex items-center justify-between">
          {sidebarOpen && (
            <span className="font-poppins text-sm font-bold text-remons-dark truncate">
              INVOLOCATION
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-remons-light-gray transition-colors"
          >
            <ChevronLeft size={16} className={`text-remons-gray transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-inter font-medium transition-colors ${
                  isActive
                    ? 'bg-remons-primary/10 text-remons-primary'
                    : 'text-remons-gray hover:bg-remons-light-gray'
                }`
              }
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-remons-border space-y-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-inter font-medium text-remons-gray hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
