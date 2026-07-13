import React from 'react';
import { TrendingUp } from 'lucide-react';

interface Recommendation {
  _id: string;
  suggestedTitle: string;
  contentType: string;
  outline: string[];
  opportunityScore: number;
}

interface AIRecommendationsListProps {
  recommendations?: Recommendation[];
}

const AIRecommendationsList: React.FC<AIRecommendationsListProps> = ({ recommendations = [] }) => {
  const displayRecs = recommendations.length > 0 ? recommendations : [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Top AI Recommendations</h2>
        <a href="#" className="text-xs text-primary hover:underline">View all</a>
      </div>
      
      <div className="flex flex-col gap-4">
        {displayRecs.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center border border-dashed border-slate-200 rounded-lg">No recommendations yet.</p>
        ) : (
          displayRecs.map((item, index) => (
            <div key={item._id} className={`flex items-start gap-4 pb-3 ${index !== displayRecs.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="text-emerald-500 mt-1 shrink-0">
                <TrendingUp size={16} />
              </div>
              
              <div className="grow">
                <div className="text-sm font-semibold text-slate-900 mb-1">{item.suggestedTitle}</div>
                <div className="text-xs text-slate-500 mb-2 uppercase">{item.contentType}</div>
                <div className="flex gap-2 flex-wrap">
                  {item.outline?.slice(0,2).map((tag, i) => (
                    <span key={i} className="text-[0.65rem] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 line-clamp-1 max-w-[120px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-end shrink-0">
                <div className={`text-2xl font-bold ${item.opportunityScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {item.opportunityScore}
                </div>
                <div className="text-[0.65rem] text-slate-500">
                  {item.opportunityScore >= 80 ? 'High Score' : 'Medium Score'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AIRecommendationsList;
