import React from 'react';

const TrendingTopics = () => {
  const topics = [
    { name: 'AI Agents', isLarge: true },
    { name: 'Claude 3.5' },
    { name: 'ChatGPT' },
    { name: 'Next.js 14' },
    { name: 'OpenAI' },
    { name: 'LangChain' },
    { name: 'Productivity' },
    { name: 'Web Development' },
    { name: 'JavaScript' },
    { name: 'Tailwind CSS' },
    { name: 'React 19' },
    { name: 'AI Tools' },
    { name: 'Prompt Engineering' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Trending Topics Overview</h2>
        <a href="#" className="text-xs text-primary hover:underline">View all trends</a>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {topics.map(topic => (
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
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
