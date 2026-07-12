import React from 'react';
import { TrendingUp } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  type: string;
  tags: string[];
  score: number;
}

const mockRecommendations: Recommendation[] = [
  { id: '1', title: 'AI Agents Explained in 5 Minutes', type: 'Short video / Reel', tags: ['AI Agents', 'Automation', 'Future'], score: 92 },
  { id: '2', title: '5 Claude 3.5 Features That Will Blow Your Mind', type: 'Carousel / Post', tags: ['AI Tools', 'Claude', 'Productivity'], score: 87 },
  { id: '3', title: 'ChatGPT Tricks to 10x Your Productivity', type: 'Short video / Reel', tags: ['ChatGPT', 'Productivity', 'AI Tools'], score: 85 },
  { id: '4', title: 'Next.js 14 Features You Should Know', type: 'Carousel / Post', tags: ['Next.js', 'Web Dev', 'JavaScript'], score: 78 },
  { id: '5', title: 'Tailwind CSS Tips That Save Hours of Work', type: 'Short video / Reel', tags: ['Tailwind CSS', 'CSS', 'Web Design'], score: 75 },
];

const AIRecommendationsList = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Top AI Recommendations</h2>
        <a href="#" className="text-xs text-primary hover:underline">View all</a>
      </div>
      
      <div className="flex flex-col gap-4">
        {mockRecommendations.map((item, index) => (
          <div key={item.id} className={`flex items-start gap-4 pb-3 ${index !== mockRecommendations.length - 1 ? 'border-b border-slate-100' : ''}`}>
            <div className="text-emerald-500 mt-1 shrink-0">
              <TrendingUp size={16} />
            </div>
            
            <div className="grow">
              <div className="text-sm font-semibold text-slate-900 mb-1">{item.title}</div>
              <div className="text-xs text-slate-500 mb-2">{item.type}</div>
              <div className="flex gap-2 flex-wrap">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[0.65rem] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0">
              <div className={`text-2xl font-bold ${item.score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {item.score}
              </div>
              <div className="text-[0.65rem] text-slate-500">
                {item.score >= 80 ? 'High Score' : 'Medium Score'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsList;
