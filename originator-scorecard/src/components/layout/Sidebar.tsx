import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Table2, PlusCircle, Newspaper, GitCompare, Shield } from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/comparison', label: 'Comparison', icon: GitCompare },
      { to: '/covenants', label: 'Covenants', icon: Shield },
    ],
  },
  {
    label: 'Data',
    items: [
      { to: '/metrics', label: 'Metrics', icon: Table2 },
      { to: '/data-entry', label: 'Data Entry', icon: PlusCircle },
      { to: '/headlines', label: 'Headlines', icon: Newspaper },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-sidebar text-white flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-teal-300 mb-1" style={{ fontFamily: 'var(--font-family-body)' }}>
          British Business Bank
        </div>
        <h1 className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-family-heading)' }}>
          Enable Funding
        </h1>
        <div className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: 'var(--font-family-body)' }}>
          Originator Dashboard
        </div>
      </div>
      <nav className="flex-1 py-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            <div className="px-4 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-500" style={{ fontFamily: 'var(--font-family-body)' }}>
              {group.label}
            </div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-sidebar-hover text-white font-medium border-l-2 border-accent'
                      : 'text-slate-300 hover:bg-sidebar-hover hover:text-white border-l-2 border-transparent'
                  }`
                }
                style={{ fontFamily: 'var(--font-family-body)' }}
              >
                <item.icon size={15} />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-white/10 text-[10px] text-slate-500" style={{ fontFamily: 'var(--font-family-body)' }}>
        Originator Scorecard v2.0
      </div>
    </aside>
  );
}
