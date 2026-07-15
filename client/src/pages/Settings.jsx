import { useState } from "react";
import { Settings, Shield, User, Clock, Bell } from "lucide-react";
import { useAuthStore } from "../services/authStore.js";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [schedulerEnabled, setSchedulerEnabled] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-heading flex items-center gap-2">
          <Settings className="h-8 w-8 text-indigo-500" />
          Settings Panel
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Manage your TrendPilot user configurations, alert intervals, and background ingestion scheduler details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Side: General Profile Info */}
        <div className="md:col-span-2 space-y-6">
          {/* User profile card */}
          <div className="p-6 border border-zinc-850 bg-zinc-900/10 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-800">
              <User className="h-4.5 w-4.5 text-indigo-400" />
              Creator Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="space-y-1">
                <span className="text-zinc-500 text-xs">Full Name</span>
                <p className="text-zinc-200 font-semibold">{user?.name || "John Doe"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 text-xs">Email Address</span>
                <p className="text-zinc-200 font-semibold">{user?.email || "creator@trendpilot.ai"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 text-xs">System Role</span>
                <p className="text-zinc-200 font-semibold capitalize">{user?.role || "Creator"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 text-xs">Account Status</span>
                <p className="text-emerald-400 font-bold uppercase tracking-wide text-xs">Verified Active</p>
              </div>
            </div>
          </div>

          {/* Scheduler Settings */}
          <div className="p-6 border border-zinc-850 bg-zinc-900/10 rounded-2xl space-y-5">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Clock className="h-4.5 w-4.5 text-indigo-400" />
              Background Ingestion Scheduler
            </h2>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-sm">
                <span className="text-xs font-bold text-zinc-200">Enable Automated Sync (Every 4h)</span>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Toggle node-cron scan tasks across active channels. Keep disabled to save Gemini API credits during demo runs.
                </p>
              </div>
              <button
                onClick={() => setSchedulerEnabled(!schedulerEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex-shrink-0 ${
                  schedulerEnabled ? "bg-indigo-600" : "bg-zinc-800 border border-zinc-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    schedulerEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="p-6 border border-zinc-850 bg-zinc-900/10 rounded-2xl space-y-5">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Bell className="h-4.5 w-4.5 text-indigo-400" />
              Notification Settings
            </h2>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-sm">
                <span className="text-xs font-bold text-zinc-200">Weekly Email Summary Reports</span>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Receive curated trending phrases and high-performing opportunity score alerts directly in your inbox.
                </p>
              </div>
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex-shrink-0 ${
                  emailAlerts ? "bg-indigo-600" : "bg-zinc-800 border border-zinc-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    emailAlerts ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Security & System Settings */}
        <div className="space-y-6">
          <div className="p-5 border border-zinc-850 bg-zinc-900/10 rounded-2xl space-y-4 text-left">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              Aesthetics & Theme
            </h3>

            <div className="space-y-3">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Active Color Theme</span>
              <div className="grid grid-cols-3 gap-2">
                {["dark", "light", "system"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`py-2 px-3 text-[10px] font-bold rounded-lg uppercase tracking-wider border transition-all cursor-pointer ${
                      theme === t
                        ? "border-indigo-500 bg-indigo-500/10 text-white font-semibold"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
