import React from 'react';
import { CheckCircle2, PlayCircle, Sparkles, RefreshCcw } from 'lucide-react';

interface Activity {
  id: string;
  text: string;
  timeAgo: string;
  type: 'blog' | 'video' | 'ai' | 'source';
}

const activities: Activity[] = [
  { id: '1', text: 'New blog found: Building AI Agents with LangChain', timeAgo: '2h ago', type: 'blog' },
  { id: '2', text: 'New video found: Claude 3.5 Sonnet: 5 New Features', timeAgo: '3h ago', type: 'video' },
  { id: '3', text: 'AI recommendation generated for "AI Agents Explained in 5 Minutes"', timeAgo: '4h ago', type: 'ai' },
  { id: '4', text: 'Source checked: Towards AI', timeAgo: '4h ago', type: 'source' },
  { id: '5', text: 'Source checked: Fireship', timeAgo: '4h ago', type: 'source' },
];

const ActivityFeed = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'video': return <PlayCircle size={16} className="text-red-500" />;
      case 'ai': return <Sparkles size={16} className="text-primary" />;
      case 'source': return <RefreshCcw size={16} className="text-emerald-500" />;
      default: return <CheckCircle2 size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Activity Feed</h2>
      </div>
      
      <div className="flex flex-col gap-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex items-center justify-center shrink-0">
              {getIcon(activity.type)}
            </div>
            <div className="grow text-sm text-slate-700 leading-snug">
              {activity.text}
            </div>
            <div className="text-xs text-slate-400 whitespace-nowrap shrink-0">
              {activity.timeAgo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
