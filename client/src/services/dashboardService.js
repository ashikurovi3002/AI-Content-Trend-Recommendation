import api from "./api.js";

const dashboardService = {
  /**
   * Fetch core statistical dashboard metrics.
   */
  getStats: async () => {
    const response = await api.get("/api/dashboard/stats");
    return response.data.data;
  },

  /**
   * Fetch aggregate trend analytics (topics, keywords, categories).
   */
  getTrends: async () => {
    const response = await api.get("/api/dashboard/trends");
    return response.data.data;
  },

  /**
   * Fetch recently scraped content items.
   */
  getRecentContent: async () => {
    const response = await api.get("/api/dashboard/recent-content");
    return response.data.data;
  },

  /**
   * Fetch recently generated social growth recommendations.
   */
  getRecentRecommendations: async () => {
    const response = await api.get("/api/dashboard/recommendations");
    return response.data.data;
  },

  /**
   * Fetch consolidated crawl, AI, and recommendation audit logs.
   */
  getActivityLogs: async () => {
    const response = await api.get("/api/dashboard/activity");
    return response.data.data;
  }
};

export default dashboardService;
