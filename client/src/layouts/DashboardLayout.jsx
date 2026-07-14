import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Globe,
  Settings,
  User,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useAuthStore } from "../services/authStore.js";

/**
 * Clean dashboard layout wrapper for MERN sub-modules.
 */
export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-zinc-800 bg-zinc-900/40 backdrop-blur-md z-45">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center flex-shrink-0 px-6 gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20">
              TP
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-heading">
              TrendPilot AI
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 flex-1 px-4 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
                }`
              }
            >
              <LayoutDashboard className="mr-3 h-5 w-5 flex-shrink-0" />
              Overview
            </NavLink>
            <NavLink
              to="/sources"
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
                }`
              }
            >
              <Globe className="mr-3 h-5 w-5 flex-shrink-0" />
              Sources
            </NavLink>
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="flex-shrink-0 flex border-t border-zinc-800 p-4 bg-zinc-900/30">
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-zinc-200 truncate max-w-28">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-zinc-500 capitalize">{user?.role || "Member"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed inset-y-0 left-0 z-55 w-64 transform bg-zinc-900 border-r border-zinc-800 p-5 space-y-6 transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20">
              TP
            </div>
            <span className="text-lg font-bold tracking-tight font-heading">TrendPilot AI</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`
            }
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Overview
          </NavLink>
          <NavLink
            to="/sources"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`
            }
          >
            <Globe className="mr-3 h-5 w-5" />
            Sources
          </NavLink>
        </nav>

        <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-200">{user?.name || "User"}</p>
            <p className="text-[10px] text-zinc-500 capitalize">{user?.role || "Member"}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 md:hidden transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden sm:block w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-zinc-500" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                disabled
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 placeholder-zinc-500 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              disabled
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800/50 cursor-not-allowed relative"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>
            <div className="h-8.5 w-8.5 rounded-full bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 py-8 px-6 md:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
