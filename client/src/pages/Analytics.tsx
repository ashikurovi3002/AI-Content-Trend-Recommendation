import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Analytics</h1>
          <p className="text-sm text-slate-500">Track performance and engagement metrics.</p>
        </div>
        <div className="flex gap-2">
            <select className="px-4 py-2 border border-slate-200 rounded font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This Year</option>
            </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <TrendingUp size={24} />
              </div>
              <div>
                  <p className="text-sm text-slate-500 font-medium">Trend Accuracy</p>
                  <p className="text-2xl font-bold text-slate-900">87%</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Users size={24} />
              </div>
              <div>
                  <p className="text-sm text-slate-500 font-medium">Audience Reach</p>
                  <p className="text-2xl font-bold text-slate-900">12.4k</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <BarChart3 size={24} />
              </div>
              <div>
                  <p className="text-sm text-slate-500 font-medium">Engagement Rate</p>
                  <p className="text-2xl font-bold text-slate-900">4.2%</p>
              </div>
          </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
          <BarChart3 size={48} className="mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">Detailed Charts Coming Soon</h3>
          <p className="max-w-sm mb-4">We are gathering more data to build your comprehensive analytics dashboard.</p>
      </div>
    </div>
  );
};

export default Analytics;
