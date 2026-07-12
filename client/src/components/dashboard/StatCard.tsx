import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  sparkline?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtext, 
  icon, 
  iconBgColor = '#f8fafc', 
  iconColor = '#5b45f4',
  trend,
  trendValue,
  sparkline
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" 
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          {icon}
        </div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1">
          {trend === 'up' && <span className="text-emerald-500 font-medium">↑ {trendValue}</span>}
          {trend === 'down' && <span className="text-amber-500 font-medium">↓ {trendValue}</span>}
          {subtext}
        </div>
        {sparkline && <div>{sparkline}</div>}
      </div>
    </div>
  );
};

export default StatCard;
