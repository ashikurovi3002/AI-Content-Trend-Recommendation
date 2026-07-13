import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
          <p className="text-sm text-slate-500">Manage your account and preferences.</p>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex overflow-hidden min-h-[500px]">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-200 p-4 bg-slate-50">
            <nav className="flex flex-col gap-1">
                <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-md font-medium text-sm">
                    <User size={18} /> Profile
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 text-slate-700 rounded-md font-medium text-sm transition-colors">
                    <Bell size={18} /> Notifications
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 text-slate-700 rounded-md font-medium text-sm transition-colors">
                    <Shield size={18} /> Security
                </a>
            </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile Settings</h2>
            
            <div className="flex flex-col gap-6 max-w-md">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50" defaultValue="john@example.com" disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50" defaultValue="Administrator" disabled />
                </div>
                <div className="pt-4 border-t border-slate-200">
                    <button className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md text-sm font-medium transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
