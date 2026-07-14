import dashboardService from "../services/dashboardService.js";

/**
 * Controller to handle all dashboard metrics and activities retrieval.
 */
class DashboardController {
  /**
   * Fetch core statistical numbers for the overview page.
   */
  async getStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const stats = await dashboardService.getStats(userId);

      return res.status(200).json({
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch aggregate trend patterns (topics, keywords, categories, scores).
   */
  async getTrends(req, res, next) {
    try {
      const userId = req.user.userId;
      const trends = await dashboardService.getTrends(userId);

      return res.status(200).json({
        success: true,
        message: "Trend analysis data retrieved successfully",
        data: trends
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch recently crawled/ingested content.
   */
  async getRecentContent(req, res, next) {
    try {
      const userId = req.user.userId;
      const content = await dashboardService.getRecentContent(userId);

      const formattedContent = content.map((c) => ({
        id: c._id,
        title: c.title,
        url: c.url,
        publishedAt: c.publishedAt,
        processedStatus: c.processedStatus,
        source: {
          id: c.sourceId?._id,
          name: c.sourceId?.name || "Deleted Source",
          type: c.sourceId?.type || "website",
          category: c.sourceId?.category || "general"
        }
      }));

      return res.status(200).json({
        success: true,
        message: "Recent content items retrieved successfully",
        data: formattedContent
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch latest recommendations generated.
   */
  async getRecentRecommendations(req, res, next) {
    try {
      const userId = req.user.userId;
      const recommendations = await dashboardService.getRecentRecommendations(userId);

      const formattedRecommendations = recommendations.map((r) => ({
        id: r._id,
        suggestedTitle: r.suggestedTitle,
        platform: r.platform,
        contentFormat: r.contentFormat,
        opportunityScore: r.opportunityScore,
        trendScore: r.trendScore,
        content: {
          id: r.contentId?._id,
          title: r.contentId?.title || "Deleted Content",
          url: r.contentId?.url
        }
      }));

      return res.status(200).json({
        success: true,
        message: "Recent recommendations retrieved successfully",
        data: formattedRecommendations
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch consolidated audit trails and crawl/AI event triggers.
   */
  async getActivityLogs(req, res, next) {
    try {
      const userId = req.user.userId;
      const activity = await dashboardService.getActivityLogs(userId);

      return res.status(200).json({
        success: true,
        message: "Recent activities retrieved successfully",
        data: activity
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
