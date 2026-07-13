import React from 'react';
import { CheckCircle2, PlayCircle, Sparkles, RefreshCcw } from 'lucide-react';

interface Activity {
  _id: string;
  text: string;
  timeAgo: string;
  type: 'blog' | 'video' | 'ai' | 'source';
}

interface ActivityFeedProps {
  activities?: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities = [] }) => {
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
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center border border-dashed border-slate-200 rounded-lg">No recent activity.</p>
        ) : (
          activities.map(activity => (
            <div key={activity._id} className="flex items-start gap-3">
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
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
