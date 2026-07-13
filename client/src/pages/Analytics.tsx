import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Plus, FileDown, Search } from 'lucide-react';

const Analytics = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Analytics</h1>
          <p className="text-sm text-slate-500">Track performance and engagement metrics.</p>
        </div>
        <div className="flex gap-4">
            <select className="px-4 py-2 border border-slate-200 rounded-md font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This Year</option>
            </select>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md text-sm font-medium transition-all hover:-translate-y-[1px]"
            >
              {showForm ? 'Cancel' : <><Plus size={16} /> Custom Report</>}
            </button>
        </div>
      </header>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <FileDown className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Generate Custom Report</h2>
          </div>
          <form className="flex flex-col gap-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Metrics to Include</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" defaultChecked />
                  <span className="text-sm text-slate-700">Engagement</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" defaultChecked />
                  <span className="text-sm text-slate-700">Reach / Views</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" defaultChecked />
                  <span className="text-sm text-slate-700">Trend Accuracy</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Export Format</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                  <option value="pdf">PDF Document</option>
                  <option value="csv">CSV Spreadsheet</option>
                  <option value="json">Raw JSON</option>
                </select>
              </div>
              <div className="flex items-end pb-0.5">
                <button type="button" className="w-full inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors">
                  <FileDown size={16} /> Download Report
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

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

      {!showForm && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
            <BarChart3 size={48} className="mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">Detailed Charts Coming Soon</h3>
            <p className="max-w-sm mb-4">We are gathering more data to build your comprehensive analytics dashboard.</p>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors">
                <Plus size={16} /> Request Custom Report
            </button>
        </div>
      )}
    </div>
  );
};

export default Analytics;
