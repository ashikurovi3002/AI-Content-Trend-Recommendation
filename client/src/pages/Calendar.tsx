import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Content Calendar</h1>
          <p className="text-sm text-slate-500">Plan and schedule your upcoming content.</p>
        </div>
        <div className="flex gap-2">
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
      </header>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm min-h-[500px] flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center text-slate-500">
            <CalendarIcon size={48} className="mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">Calendar Empty</h3>
            <p className="max-w-sm">You have no scheduled content for this period.</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
