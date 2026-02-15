import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Table2, PlusCircle, Newspaper } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/metrics', label: 'Metrics', icon: Table2 },
  { to: '/data-entry', label: 'Data Entry', icon: PlusCircle },
  { to: '/headlines', label: 'Headlines', icon: Newspaper },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-sidebar text-white flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">Originator Dashboard</h1>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-sidebar-hover text-white font-medium'
                  : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10 text-xs text-slate-400">
        Originator Scorecard v1.0
      </div>
    </aside>
  );
}
