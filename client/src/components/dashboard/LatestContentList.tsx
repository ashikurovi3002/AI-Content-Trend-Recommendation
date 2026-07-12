import React, { useState } from 'react';

interface ContentItem {
  id: string;
  title: string;
  source: string;
  type: string;
  timeAgo: string;
  tag: string;
  thumbnailColor: string;
}

const mockContent: ContentItem[] = [
  { id: '1', title: 'Building AI Agents with LangChain: A Complete Guide', source: 'Towards AI • Blog', type: 'blog', timeAgo: '2 hours ago', tag: 'AI Agents', thumbnailColor: '#0f172a' },
  { id: '2', title: 'Claude 3.5 Sonnet: 5 New Features You Should Know', source: 'Fireship • YouTube', type: 'video', timeAgo: '3 hours ago', tag: 'AI Tools', thumbnailColor: '#1e293b' },
  { id: '3', title: 'Next.js 14 Full Course for Beginners', source: 'JavaScript Mastery • YouTube', type: 'video', timeAgo: '5 hours ago', tag: 'Web Dev', thumbnailColor: '#000000' },
  { id: '4', title: '10 ChatGPT Hidden Tricks That 99% People Don\'t Know', source: 'Geeky Gadgets • Blog', type: 'blog', timeAgo: '6 hours ago', tag: 'AI Tools', thumbnailColor: '#334155' },
  { id: '5', title: '12 Tailwind CSS Tips to Build Better UI Faster', source: 'Web Dev Simplified • YouTube', type: 'video', timeAgo: '7 hours ago', tag: 'Web Dev', thumbnailColor: '#0f172a' },
];

const LatestContentList = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
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
        {mockContent.map((item, index) => (
          <div key={item.id} className={`flex items-start gap-4 pb-4 ${index !== mockContent.length - 1 ? 'border-b border-slate-100' : ''}`}>
            <div className="w-[100px] h-[60px] rounded-md overflow-hidden relative shrink-0" style={{ backgroundColor: item.thumbnailColor }}>
              {item.type === 'video' && <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-[0.6rem]">▶</div>}
              <div className="text-white p-1 text-[0.6rem] font-bold">
                {item.tag}
              </div>
            </div>
            
            <div className="grow flex flex-col gap-1">
              <div className="text-sm font-semibold text-slate-900 leading-tight">{item.title}</div>
              <div className="text-xs text-slate-500">{item.source}</div>
              <div className="text-xs text-slate-500">{item.timeAgo}</div>
            </div>
            
            <div className="text-[0.7rem] px-2 py-0.5 rounded-full bg-primary-transparent text-primary font-medium shrink-0">
              {item.tag}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
        View all content →
      </button>
    </div>
  );
};

export default LatestContentList;
