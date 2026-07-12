import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Database, 
  FileText, 
  Sparkles, 
  Calendar, 
  BarChart2, 
  Settings,
  Rocket
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Sources', path: '/sources', icon: Database },
    { name: 'Content', path: '/content', icon: FileText },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-full h-full bg-white border-r border-slate-200 flex flex-col p-6">
      <div className="flex items-center gap-3 pb-8 px-2">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white shrink-0">
          <Rocket size={18} />
        </div>
        <div>
          <div className="font-bold text-lg tracking-tight text-slate-900 leading-tight">TrendPilot AI</div>
          <div className="text-[0.65rem] text-slate-500 font-medium leading-none mt-1">Content Intelligence Platform</div>
        </div>
      </div>

      <nav className="flex-grow flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-transparent text-primary' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 mb-6 border border-indigo-100">
        <div className="flex items-center gap-2 text-xs font-bold text-primary mb-2">
          <Sparkles size={14} />
          AI is working for you 🚀
        </div>
        <div className="text-xs text-slate-500 leading-relaxed">
          We are monitoring your sources every 4-6 hours and finding the best content opportunities.
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3 px-2 border-t border-slate-200">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">U</div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900">User</span>
          <span className="text-xs text-slate-500">user@example.com</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
