import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Link2, Video, Share2, Activity } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleConnect = (provider: string) => {
    // In a real implementation, this would redirect to our backend route:
    // window.location.href = `http://localhost:5000/api/integrations/${provider}`;
    alert(`Initiating OAuth connection for ${provider}... (Backend route: /api/integrations/${provider})`);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
          <p className="text-sm text-slate-500">Manage your account and integrations.</p>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex overflow-hidden min-h-[500px]">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-200 p-4 bg-slate-50">
            <nav className="flex flex-col gap-1">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-3 py-2 w-full text-left rounded-md font-medium text-sm transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                    <User size={18} /> Profile
                </button>
                <button 
                  onClick={() => setActiveTab('integrations')}
                  className={`flex items-center gap-3 px-3 py-2 w-full text-left rounded-md font-medium text-sm transition-colors ${activeTab === 'integrations' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                    <Link2 size={18} /> Integrations
                </button>
                <button className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 text-slate-700 rounded-md font-medium text-sm transition-colors">
                    <Bell size={18} /> Notifications
                </button>
                <button className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 text-slate-700 rounded-md font-medium text-sm transition-colors">
                    <Shield size={18} /> Security
                </button>
            </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
            {activeTab === 'profile' && (
              <>
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
              </>
            )}

            {activeTab === 'integrations' && (
              <>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Connected Accounts</h2>
                <p className="text-sm text-slate-500 mb-6">Connect your external accounts to allow TrendPilot AI to fetch your historical performance data and cross-reference it with market trends.</p>
                
                <div className="flex flex-col gap-4 max-w-2xl">
                    {/* Google / YouTube Integration */}
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                          <Video size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">Google & YouTube</h3>
                          <p className="text-sm text-slate-500">Connect Google Analytics and YouTube Studio to sync traffic and video performance.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleConnect('google')}
                        className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors"
                      >
                        Connect Google
                      </button>
                    </div>

                    {/* Meta Integration */}
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                          <Share2 size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">Meta (Facebook & Instagram)</h3>
                          <p className="text-sm text-slate-500">Connect your Facebook Pages and Instagram Accounts to analyze social reach.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleConnect('meta')}
                        className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors"
                      >
                        Connect Meta
                      </button>
                    </div>
                    
                    {/* LinkedIn Integration */}
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                          <Activity size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">LinkedIn Pages</h3>
                          <p className="text-sm text-slate-500">Sync engagement data from your company's LinkedIn page.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleConnect('linkedin')}
                        className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors"
                      >
                        Connect LinkedIn
                      </button>
                    </div>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
