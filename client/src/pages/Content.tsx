import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, Save } from 'lucide-react';

const Content = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Content</h1>
          <p className="text-sm text-slate-500">View, analyze, and manually add content.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md text-sm font-medium transition-all hover:-translate-y-[1px]"
          >
            {showForm ? 'Cancel' : <><Plus size={16} /> Add Content</>}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Manually Add Content</h2>
          <form className="flex flex-col gap-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content Title</label>
              <input type="text" placeholder="Enter title" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                  <option value="blog">Blog Post</option>
                  <option value="video">Video</option>
                  <option value="social">Social Media Post</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
                <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content URL / Link</label>
              <input type="url" placeholder="https://" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Summary / Notes</label>
              <textarea rows={3} placeholder="Add any notes..." className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
            </div>
            <div className="pt-2">
              <button type="button" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors">
                <Save size={16} /> Save Content
              </button>
            </div>
          </form>
        </div>
      )}

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
        {!showForm && (
          <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500">
              <FileText size={48} className="mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No Content Yet</h3>
              <p className="max-w-sm mb-4">Content will appear here once your sources start gathering data, or you can add it manually.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
