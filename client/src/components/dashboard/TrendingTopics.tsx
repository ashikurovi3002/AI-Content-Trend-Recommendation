import React from 'react';

interface Topic {
  name: string;
  isLarge?: boolean;
}

interface TrendingTopicsProps {
  topics?: Topic[];
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Trending Topics Overview</h2>
        <a href="#" className="text-xs text-primary hover:underline">View all trends</a>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {topics.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 w-full text-center border border-dashed border-slate-200 rounded-lg">No trending topics found yet.</p>
        ) : (
          topics.map(topic => (
            <div 
              key={topic.name} 
              className={`cursor-pointer transition-all hover:-translate-y-[1px] ${
                topic.isLarge 
                  ? 'bg-primary hover:bg-primary-light text-white text-lg font-semibold px-6 py-3 rounded-xl shadow-sm' 
                  : 'bg-primary-transparent hover:bg-primary text-primary hover:text-white text-sm font-medium px-4 py-2 rounded-lg'
              }`}
            >
              {topic.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrendingTopics;
