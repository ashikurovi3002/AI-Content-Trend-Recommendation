import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Globe,
  CheckCircle,
  FileText,
  Lightbulb,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertTriangle,
  Play,
  Loader2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import dashboardService from "../services/dashboardService.js";
import api from "../services/api.js";

// Customized Tooltip for Recharts
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl text-xs">
        <p className="font-semibold text-zinc-100">{payload[0].name}</p>
        <p className="text-indigo-400 mt-1">
          Occurrences: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats
  });

  const {
    data: trends,
    isLoading: trendsLoading,
    isError: trendsError
  } = useQuery({
    queryKey: ["dashboard-trends"],
    queryFn: dashboardService.getTrends
  });

  const {
    data: content = [],
    isLoading: contentLoading,
    isError: contentError
  } = useQuery({
    queryKey: ["dashboard-content"],
    queryFn: dashboardService.getRecentContent
  });

  const {
    data: recommendations = [],
    isLoading: recsLoading,
    isError: recsError
  } = useQuery({
    queryKey: ["dashboard-recs"],
    queryFn: dashboardService.getRecentRecommendations
  });

  const {
    data: activity,
    isLoading: activityLoading,
    isError: activityError
  } = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: dashboardService.getActivityLogs
  });

  // Manual Ingestion Scan Mutation
  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/scan");
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all dashboard metrics to pull fresh crawled nodes
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-trends"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-content"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-recs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-activity"] });
      queryClient.invalidateQueries({ queryKey: ["sources"] });
    }
  });

  const handleManualScan = () => {
    scanMutation.mutate();
  };

  const isGlobalLoading =
    statsLoading || trendsLoading || contentLoading || recsLoading || activityLoading;
  const isGlobalError =
    statsError || trendsError || contentError || recsError || activityError;

  // Render Skeleton Cards for Stats Loading
  const renderStatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-3 animate-pulse"
        >
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-zinc-800 rounded-md"></div>
            <div className="h-5 w-5 bg-zinc-800 rounded-md"></div>
          </div>
          <div className="h-8 w-12 bg-zinc-800 rounded-md"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-heading">
            Overview Dashboard
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Monitor crawls, view trending topics, and explore AI recommendations.
          </p>
        </div>
        <button
          onClick={handleManualScan}
          disabled={scanMutation.isPending}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-750 text-white rounded-xl shadow-lg shadow-indigo-500/15 font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {scanMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning Feeds...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Scan Feeds Now
            </>
          )}
        </button>
      </div>

      {/* Global Error Banner */}
      {isGlobalError && (
        <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 text-xs text-rose-400 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            Failed to sync metrics from some backend modules. Please configure environment variables
            properly and retry.
          </span>
        </div>
      )}

      {/* 1. Statistics Cards */}
      {statsLoading ? (
        renderStatsSkeleton()
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Total Sources */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-5 flex flex-col justify-between h-28 hover:border-zinc-700/80 transition-colors">
            <div className="flex justify-between items-start text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wide">Total Sources</span>
              <Globe className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats?.totalSources ?? 0}
            </div>
          </div>

          {/* Active Sources */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-5 flex flex-col justify-between h-28 hover:border-zinc-700/80 transition-colors">
            <div className="flex justify-between items-start text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wide">Active</span>
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats?.activeSources ?? 0}
            </div>
          </div>

          {/* Total Content Items */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-5 flex flex-col justify-between h-28 hover:border-zinc-700/80 transition-colors">
            <div className="flex justify-between items-start text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wide">Crawled Items</span>
              <FileText className="h-4.5 w-4.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats?.totalContent ?? 0}
            </div>
          </div>

          {/* Total Recommendations */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-5 flex flex-col justify-between h-28 hover:border-zinc-700/80 transition-colors">
            <div className="flex justify-between items-start text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wide">Ideas Generated</span>
              <Lightbulb className="h-4.5 w-4.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats?.totalRecommendations ?? 0}
            </div>
          </div>

          {/* Processed Today */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-5 flex flex-col justify-between h-28 hover:border-zinc-700/80 transition-colors">
            <div className="flex justify-between items-start text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wide">Processed Today</span>
              <Clock className="h-4.5 w-4.5 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats?.processedToday ?? 0}
            </div>
          </div>
        </div>
      )}

      {/* 2. Charts and Trends section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Trending Topics Chart */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Trending Topics
            </h2>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Aggregated Summary</span>
          </div>

          {trendsLoading ? (
            <div className="h-64 flex items-center justify-center animate-pulse bg-zinc-900/20 rounded-xl">
              <div className="h-6 w-32 bg-zinc-800 rounded-md"></div>
            </div>
          ) : !trends?.topTopics || trends.topTopics.length === 0 ? (
            <div className="h-64 flex items-center justify-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500">
              No trending topic data available. Ingest more articles first.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trends.topTopics}
                  margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                >
                  <XAxis
                    dataKey="topic"
                    tick={{ fill: "#71717a", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(39, 39, 42, 0.3)" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {trends.topTopics.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#4f46e5" : "#6366f1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Opportunity Score Distribution */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-400" />
              Score Distribution
            </h2>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Opportunity Score</span>
          </div>

          {trendsLoading ? (
            <div className="h-64 flex items-center justify-center animate-pulse bg-zinc-900/20 rounded-xl">
              <div className="h-6 w-32 bg-zinc-800 rounded-md"></div>
            </div>
          ) : !trends?.opportunityScoreDistribution ||
            trends.opportunityScoreDistribution.length === 0 ? (
            <div className="h-64 flex items-center justify-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500">
              No score metrics available. Generate recommendations first.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trends.opportunityScoreDistribution}
                  margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                >
                  <XAxis
                    dataKey="range"
                    tick={{ fill: "#71717a", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(39, 39, 42, 0.3)" }} />
                  <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* 3. Content and Recommendations grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Recommendations */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-indigo-400" />
              Latest Content Ideas
            </h2>
          </div>

          {recsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-zinc-900/30 border border-zinc-850 animate-pulse" />
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500">
              No recommendations generated yet. Scrapes some feeds to begin.
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40 hover:border-zinc-800 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 truncate">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{rec.suggestedTitle}</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {rec.platform.map((p) => (
                        <span key={p} className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 font-semibold border border-indigo-900/40 uppercase">
                          {p}
                        </span>
                      ))}
                      <span className="text-[10px] text-zinc-500">{rec.contentFormat}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-indigo-400">
                      Opp Score: <span className="text-white font-bold">{rec.opportunityScore}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Trend: <span className="font-semibold text-zinc-400">{rec.trendScore}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Crawled Content */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              Recent Scrapes
            </h2>
          </div>

          {contentLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-zinc-900/30 border border-zinc-850 animate-pulse" />
              ))}
            </div>
          ) : content.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500">
              No recent crawls recorded. Click "Scan Feeds Now" above.
            </div>
          ) : (
            <div className="space-y-3">
              {content.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40 hover:border-zinc-800 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="truncate space-y-1">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span className="text-zinc-400 font-semibold">{item.source?.name}</span>
                      <span>•</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        item.processedStatus === "completed"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : item.processedStatus === "processing"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                            : item.processedStatus === "failed"
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}
                    >
                      {item.processedStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Activity Timeline */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-6 space-y-6">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-400" />
          Recent Activity Timeline
        </h2>

        {activityLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-zinc-900/30 border border-zinc-850 animate-pulse" />
            ))}
          </div>
        ) : !activity ||
          (activity.recentCrawls.length === 0 &&
            activity.aiProcessingEvents.length === 0 &&
            activity.recommendationEvents.length === 0) ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500">
            No activity logged yet. Add sources and trigger crawls.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Crawl Audits */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-800">
                Crawls & Syncs
              </h3>
              {activity.recentCrawls.length === 0 ? (
                <p className="text-xs text-zinc-600">No crawl activity recorded</p>
              ) : (
                <div className="space-y-2">
                  {activity.recentCrawls.slice(0, 4).map((c) => (
                    <div key={c.id} className="p-3 rounded-lg bg-zinc-950/45 border border-zinc-850 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-zinc-300 truncate max-w-28">{c.sourceName}</span>
                        <span className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase ${c.status === "completed" ? "bg-emerald-950 text-emerald-400" : "bg-rose-955 text-rose-400"}`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1">{new Date(c.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: AI Summarizations */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-800">
                AI Summaries
              </h3>
              {activity.aiProcessingEvents.length === 0 ? (
                <p className="text-xs text-zinc-600">No summarization events recorded</p>
              ) : (
                <div className="space-y-2">
                  {activity.aiProcessingEvents.slice(0, 4).map((a) => (
                    <div key={a.id} className="p-3 rounded-lg bg-zinc-950/45 border border-zinc-850 text-xs">
                      <p className="font-semibold text-zinc-300 truncate">{a.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[8px] text-emerald-400 uppercase font-semibold">Analyzed</span>
                        <span className="text-[10px] text-zinc-500">{new Date(a.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Recommendations */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-800">
                Creative Ideas
              </h3>
              {activity.recommendationEvents.length === 0 ? (
                <p className="text-xs text-zinc-600">No recommendations recorded</p>
              ) : (
                <div className="space-y-2">
                  {activity.recommendationEvents.slice(0, 4).map((r) => (
                    <div key={r.id} className="p-3 rounded-lg bg-zinc-950/45 border border-zinc-850 text-xs">
                      <p className="font-semibold text-zinc-300 truncate">{r.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {r.platforms.map((p) => (
                          <span key={p} className="px-1 py-0.5 rounded text-[8px] bg-indigo-950 text-indigo-400 font-semibold border border-indigo-900/40 uppercase">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
