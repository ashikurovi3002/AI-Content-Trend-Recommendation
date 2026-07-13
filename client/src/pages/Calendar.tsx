import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Save } from 'lucide-react';

const Calendar = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Content Calendar</h1>
          <p className="text-sm text-slate-500">Plan and schedule your upcoming content.</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="flex gap-2 mr-4">
                <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <button className="px-4 py-2 border border-slate-200 rounded font-medium hover:bg-slate-50 text-slate-700 transition-colors">
                    Today
                </button>
                <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md text-sm font-medium transition-all hover:-translate-y-[1px]"
            >
              {showForm ? 'Cancel' : <><Plus size={16} /> Schedule Content</>}
            </button>
        </div>
      </header>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-4 border-l-4 border-l-primary">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Schedule New Content</h2>
          <form className="flex flex-col gap-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Working Title</label>
              <input type="text" placeholder="e.g. 5 Tips for Better SEO in 2026" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Time</label>
                <input type="time" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                  <option value="blog">Company Blog</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                  <option value="idea">Idea / Brainstorming</option>
                  <option value="drafting">Drafting</option>
                  <option value="review">In Review</option>
                  <option value="scheduled">Scheduled / Ready</option>
                </select>
              </div>
            </div>
            <div className="pt-2">
              <button type="button" className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors">
                <Save size={16} /> Add to Calendar
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm min-h-[500px] flex items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center text-slate-500">
              <CalendarIcon size={48} className="mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">Calendar Empty</h3>
              <p className="max-w-sm mb-4">You have no scheduled content for this period.</p>
              <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors">
                  <Plus size={16} /> Schedule Now
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
