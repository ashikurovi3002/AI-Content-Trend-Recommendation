import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Activity, Cpu, Sparkles } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, CartesianGrid } from "recharts";
import dashboardService from "../services/dashboardService.js";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl text-xs">
        <p className="font-semibold text-zinc-100">{payload[0].name}</p>
        <p className="text-indigo-400 mt-1">
          Value: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { data: trends, isLoading } = useQuery({
    queryKey: ["analytics-trends"],
    queryFn: dashboardService.getTrends
  });

  // Mock timeline data to show trend progress over time
  const mockTimelineData = [
    { name: "Week 1", "AI Agents": 40, "Web3 Scaling": 20, "Vector DBs": 15 },
    { name: "Week 2", "AI Agents": 55, "Web3 Scaling": 28, "Vector DBs": 22 },
    { name: "Week 3", "AI Agents": 72, "Web3 Scaling": 38, "Vector DBs": 48 },
    { name: "Week 4", "AI Agents": 96, "Web3 Scaling": 45, "Vector DBs": 65 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-heading flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-indigo-500" />
          Analytics Dashboard
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Deep-dive into aggregate crawl indicators, AI confidence score models, and growth opportunity spreads.
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 flex justify-center">
          <Cpu className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exploding Topic distribution */}
            <div className="p-6 border border-zinc-850 bg-zinc-900/10 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-indigo-400" />
                Trending Topics Distribution
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends?.topTopics || []}>
                    <XAxis dataKey="topic" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(39, 39, 42, 0.3)" }} />
                    <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Opportunity Score distribution */}
            <div className="p-6 border border-zinc-850 bg-zinc-900/10 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-amber-500" />
                Opportunity Score Distribution
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends?.opportunityScoreDistribution || []}>
                    <XAxis dataKey="range" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(39, 39, 42, 0.3)" }} />
                    <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Timeline trend line chart */}
          <div className="p-6 border border-zinc-850 bg-zinc-900/10 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
              Trend Velocity Timeline (Historical Spread)
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
                  <Tooltip cursor={{ stroke: "#4f46e5" }} />
                  <Line type="monotone" dataKey="AI Agents" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Web3 Scaling" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Vector DBs" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
