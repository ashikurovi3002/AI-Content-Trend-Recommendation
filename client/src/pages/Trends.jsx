import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TrendingUp, Flame, ArrowUpRight, Search, Activity, Sparkles, FileText, ArrowRight } from "lucide-react";
import dashboardService from "../services/dashboardService.js";
import { useState } from "react";

export default function Trends() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTopic = searchParams.get("topic") || "";
  const [searchQuery, setSearchQuery] = useState("");

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ["trends-analytics"],
    queryFn: dashboardService.getTrends
  });

  const { data: recentContent = [], isLoading: contentLoading } = useQuery({
    queryKey: ["recent-scrapes"],
    queryFn: dashboardService.getRecentContent
  });

  // Mock trend details to support the requested workflow:
  // AI Agents, MCP, Claude Code, Cursor, etc.
  const mockTrendsList = [
    {
      topic: "AI Agents",
      trendScore: 96,
      change: "+48%",
      growthStatus: "explosive",
      relatedKeywords: ["AI Agent", "MCP", "Claude Code", "Cursor", "Multi-Agent"],
      description: "Autonomous software entities executing multi-step workflows. Spurred by Model Context Protocol (MCP) integrations."
    },
    {
      topic: "Web3 Scaling",
      trendScore: 82,
      change: "+22%",
      growthStatus: "steady",
      relatedKeywords: ["Layer-2", "Zero Knowledge", "ZK-Rollups", "Base Network"],
      description: "Infrastructure layer scaling frameworks lowering gas costs and improving transactions-per-second on decentralized nets."
    },
    {
      topic: "Vector Databases",
      trendScore: 89,
      change: "+31%",
      growthStatus: "high",
      relatedKeywords: ["RAG", "Pinecone", "pgvector", "Semantic Search"],
      description: "Specialized storage engines enabling fast semantic search and long-term memory retrieval for generative AI models."
    },
    {
      topic: "Edge Computing",
      trendScore: 78,
      change: "+15%",
      growthStatus: "steady",
      relatedKeywords: ["Vercel Edge", "Cloudflare Workers", "Serverless WASM"],
      description: "Deploying logical pipelines closer to consumers to minimize latency and optimize load times."
    }
  ];

  // Filter content items matching selected topic
  const filteredContent = recentContent.filter((item) => {
    if (!selectedTopic) return true;
    const matchTopic = selectedTopic.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(matchTopic);
    const descMatch = (item.description || "").toLowerCase().includes(matchTopic);
    return titleMatch || descMatch;
  });

  // Find info about the currently selected topic
  const activeTrendDetails = mockTrendsList.find(
    (t) => t.topic.toLowerCase() === selectedTopic.toLowerCase()
  ) || {
    topic: selectedTopic || "General Tech Trends",
    trendScore: 85,
    change: "+12%",
    growthStatus: "steady",
    relatedKeywords: [selectedTopic, "SaaS", "Software", "AI"],
    description: "Trending category containing active crawls and summarization analyses inside your Content Library."
  };

  const handleSelectTopic = (topic) => {
    setSearchParams({ topic });
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-heading flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-indigo-500" />
          Content Trends & Intelligence
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Discover exploding developer topics, viral triggers, and filter matching crawls.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left List: Exploding Topics */}
        <div className="lg:col-span-1 space-y-5">
          <div className="p-5 border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm rounded-2xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <Flame className="h-4 w-4 text-orange-500" />
              Exploding Topics
            </h2>

            <div className="space-y-3">
              {mockTrendsList.map((t) => (
                <div
                  key={t.topic}
                  onClick={() => handleSelectTopic(t.topic)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedTopic.toLowerCase() === t.topic.toLowerCase()
                      ? "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/5"
                      : "border-zinc-800 bg-zinc-950/20 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-200 text-sm">{t.topic}</span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="h-3 w-3" />
                      {t.change}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-zinc-500">Trend Score</span>
                    <span className="text-xs font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {t.trendScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Selected Trend Details & Content Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Card details */}
          <div className="p-6 border border-zinc-800 bg-zinc-900/15 backdrop-blur-sm rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  Exploding Topic Detail
                </span>
                <h2 className="text-2xl font-bold text-white mt-1.5">{activeTrendDetails.topic}</h2>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Trend Score</div>
                  <div className="text-lg font-extrabold text-indigo-400">{activeTrendDetails.trendScore}</div>
                </div>
                <div className="text-center bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Weekly Growth</div>
                  <div className="text-lg font-extrabold text-emerald-400">{activeTrendDetails.change}</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-4">
              {activeTrendDetails.description}
            </p>

            {/* Related keywords tags */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                Related Trend Phrases
              </span>
              <div className="flex flex-wrap gap-2">
                {activeTrendDetails.relatedKeywords.map((k) => (
                  <span
                    key={k}
                    onClick={() => handleSelectTopic(k)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors cursor-pointer"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Scrapes matching this topic */}
          <div className="p-6 border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-indigo-400" />
              Crawled Articles Matching Topic ({filteredContent.length})
            </h3>

            {trendsLoading || contentLoading ? (
              <div className="py-12 flex justify-center">
                <Activity className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">
                No crawler results matched this specific keyword. Ingest new sources to load items.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContent.map((item) => (
                  <div
                    key={item.id || item._id}
                    onClick={() => navigate(`/content/${item.id || item._id}`)}
                    className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40 hover:border-indigo-500/50 hover:bg-zinc-900/20 transition-all flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="text-left space-y-1 truncate">
                      <p className="text-sm font-semibold text-zinc-200 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <span className="text-zinc-400 font-semibold">{item.source?.name || item.author}</span>
                        <span>•</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                      <span>View Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
