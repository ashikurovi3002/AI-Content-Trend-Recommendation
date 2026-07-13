import React, { useState, useEffect, useRef } from 'react';
import { Bell, Plus, LayoutGrid, FileText, PlayCircle, Sparkles, Check, CheckCheck } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import LatestContentList from '../components/dashboard/LatestContentList';
import AIRecommendationsList from '../components/dashboard/AIRecommendationsList';
import TrendingTopics from '../components/dashboard/TrendingTopics';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const Dashboard = () => {
  const { token, user } = useAuth();
  
  const [stats, setStats] = useState({
    totalSources: 0,
    websiteSources: 0,
    youtubeSources: 0,
    newBlogsToday: 0,
    newVideosToday: 0,
    pendingRecommendations: 0
  });
  
  const [latestContent, setLatestContent] = useState([]);
  const [topRecommendations, setTopRecommendations] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only fetch if token is present
    if (!token) return;
    
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setLatestContent(data.latestContent || []);
          setTopRecommendations(data.topRecommendations || []);
          setActivityFeed(data.activityFeed || []);
          setTrendingTopics(data.trendingTopics || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        if (id === 'all') {
          setNotifications(notifications.map(n => ({ ...n, isRead: true })));
          setUnreadCount(0);
        } else {
          setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, {user?.name || 'User'}! Here's what's happening today.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center relative hover:bg-slate-50 transition-colors"
            >
              <Bell size={20} className="text-slate-500" />
              {unreadCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white w-4 h-4 rounded-full text-[0.6rem] font-bold flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </div>
              )}
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAsRead('all')}
                      className="text-xs text-primary hover:text-primary-light font-medium flex items-center gap-1"
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map(notif => (
                        <div 
                          key={notif._id} 
                          className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                          onClick={() => !notif.isRead && markAsRead(notif._id)}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                              {notif.title}
                            </h4>
                            {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>}
                          </div>
                          <p className="text-xs text-slate-500 mb-2">{notif.message}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md text-sm font-medium transition-all hover:-translate-y-[1px]">
            <Plus size={16} />
            Add Source
          </button>
        </div>
      </header>

      {loading ? (
        <div className="h-32 flex items-center justify-center text-slate-500">Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard 
            title="Total Sources" 
            value={stats.totalSources.toString()} 
            subtext={`${stats.websiteSources} Websites • ${stats.youtubeSources} YouTube`} 
            icon={<LayoutGrid size={18} />} 
            iconBgColor="#eff6ff"
            iconColor="#3b82f6"
          />
          <StatCard 
            title="New Blogs Today" 
            value={stats.newBlogsToday.toString()} 
            subtext="from yesterday" 
            trend="up"
            trendValue="0%"
            icon={<FileText size={18} />} 
            iconBgColor="rgba(16, 185, 129, 0.1)"
            iconColor="#10b981"
          />
          <StatCard 
            title="New Videos Today" 
            value={stats.newVideosToday.toString()} 
            subtext="from yesterday" 
            trend="up"
            trendValue="0%"
            icon={<PlayCircle size={18} />} 
            iconBgColor="#fee2e2"
            iconColor="#ef4444"
          />
          <StatCard 
            title="AI Recommendations" 
            value={stats.pendingRecommendations.toString()} 
            subtext="Top opportunities found" 
            icon={<Sparkles size={18} />} 
            iconBgColor="#fef3c7"
            iconColor="#f59e0b"
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LatestContentList content={latestContent} />
        <AIRecommendationsList recommendations={topRecommendations} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TrendingTopics topics={trendingTopics} />
        </div>
        <div>
          <ActivityFeed activities={activityFeed} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
