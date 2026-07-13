import React, { useState } from 'react';

interface ContentItem {
  _id: string;
  title: string;
  url: string;
  contentType: string;
  createdAt: string;
  sourceId: {
    name: string;
    type: string;
  };
}

interface LatestContentListProps {
  content?: ContentItem[];
}

const LatestContentList: React.FC<LatestContentListProps> = ({ content = [] }) => {
  const [activeTab, setActiveTab] = useState('All');
  
  // Basic display fallback if no real data yet
  const displayContent = content.length > 0 ? content : [];
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Latest Content</h2>
        <a href="#" className="text-xs text-primary hover:underline">View all</a>
      </div>
      
      <div className="flex gap-2 mb-4">
        {['All', 'Blogs', 'Videos'].map(tab => (
          <div 
            key={tab} 
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
              activeTab === tab 
                ? 'bg-primary text-white' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {displayContent.length === 0 ? (
           <p className="text-sm text-slate-500 py-4 text-center border border-dashed border-slate-200 rounded-lg">No content found.</p>
        ) : (
          displayContent.map((item, index) => (
            <div key={item._id} className={`flex items-start gap-4 pb-4 ${index !== displayContent.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="w-[100px] h-[60px] rounded-md overflow-hidden relative shrink-0 bg-slate-800 flex items-center justify-center">
                {item.contentType === 'video' && <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-[0.6rem]">▶</div>}
                <div className="text-white p-1 text-[0.6rem] font-bold uppercase">
                  {item.contentType}
                </div>
              </div>
              
              <div className="grow flex flex-col gap-1">
                <div className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2">{item.title}</div>
                <div className="text-xs text-slate-500">{item.sourceId?.name || 'Unknown Source'}</div>
                <div className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</div>
              </div>
              
              <div className="text-[0.7rem] px-2 py-0.5 rounded-full bg-primary-transparent text-primary font-medium shrink-0 uppercase">
                {item.contentType}
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="w-full mt-6 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
        View all content →
      </button>
    </div>
  );
};

export default LatestContentList;
