import React from 'react';
import { Bell, Plus, LayoutGrid, FileText, PlayCircle, Sparkles } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import LatestContentList from '../components/dashboard/LatestContentList';
import AIRecommendationsList from '../components/dashboard/AIRecommendationsList';
import TrendingTopics from '../components/dashboard/TrendingTopics';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center relative hover:bg-slate-50 transition-colors">
            <Bell size={20} className="text-slate-500" />
            <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white w-4 h-4 rounded-full text-[0.6rem] font-bold flex items-center justify-center border-2 border-white">
              3
            </div>
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md text-sm font-medium transition-all hover:-translate-y-[1px]">
            <Plus size={16} />
            Add Source
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sources" 
          value="12" 
          subtext="8 Websites • 4 YouTube" 
          icon={<LayoutGrid size={18} />} 
          iconBgColor="#eff6ff"
          iconColor="#3b82f6"
        />
        <StatCard 
          title="New Blogs Today" 
          value="18" 
          subtext="from yesterday" 
          trend="up"
          trendValue="20%"
          icon={<FileText size={18} />} 
          iconBgColor="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />
        <StatCard 
          title="New Videos Today" 
          value="9" 
          subtext="from yesterday" 
          trend="up"
          trendValue="12%"
          icon={<PlayCircle size={18} />} 
          iconBgColor="#fee2e2"
          iconColor="#ef4444"
        />
        <StatCard 
          title="AI Recommendations" 
          value="15" 
          subtext="Top opportunities found" 
          icon={<Sparkles size={18} />} 
          iconBgColor="#fef3c7"
          iconColor="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LatestContentList />
        <AIRecommendationsList />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TrendingTopics />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
