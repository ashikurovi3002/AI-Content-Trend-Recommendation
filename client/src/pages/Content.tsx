import React from 'react';
import { FileText, Search, Filter } from 'lucide-react';

const Content = () => {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Content</h1>
          <p className="text-sm text-slate-500">View and analyze gathered content.</p>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-lg">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search content..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
        <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500">
            <FileText size={48} className="mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No Content Yet</h3>
            <p className="max-w-sm mb-4">Content will appear here once your sources start gathering data.</p>
        </div>
      </div>
    </div>
  );
};

export default Content;
