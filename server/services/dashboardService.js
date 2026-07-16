import mongoose from "mongoose";
import Source from "../models/Source.js";
import ContentItem from "../models/ContentItem.js";
import Summary from "../models/Summary.js";
import Recommendation from "../models/Recommendation.js";
import Job from "../models/Job.js";

/**
 * Service to aggregate dashboard metrics and analytics reports.
 */
class DashboardService {
  /**
   * Helper to retrieve all source IDs belonging to a user.
   */
  async getUserSourceIds(userId) {
    const sources = await Source.find({ userId }).distinct("_id");
    return sources;
  }

  /**
   * Helper to retrieve all content item IDs belonging to a user's sources.
   */
  async getUserContentIds(sourceIds) {
    return await ContentItem.find({ sourceId: { $in: sourceIds } }).distinct("_id");
  }

  /**
   * Get total counts, queues, and job metrics.
   * @param {string} userId - Authenticated user ID
   */
  async getStats(userId) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalSources,
      activeSources,
      pausedSources,
      totalContent,
      processedToday,
      totalRecommendations,
      failedJobs,
      aiQueue
    ] = await Promise.all([
      Source.countDocuments({ userId }),
      Source.countDocuments({ userId, status: "active" }),
      Source.countDocuments({ userId, status: "paused" }),
      ContentItem.countDocuments({ userId }),
      ContentItem.countDocuments({
        userId,
        processedStatus: { $in: ["completed", "failed"] },
        updatedAt: { $gte: startOfToday }
      }),
      Recommendation.countDocuments({ userId }),
      Job.countDocuments({ userId, status: "failed" }),
      ContentItem.countDocuments({
        userId,
        processedStatus: { $in: ["pending", "processing"] }
      })
    ]);

    return {
      totalSources,
      activeSources,
      pausedSources,
      totalContent,
      processedToday,
      totalRecommendations,
      failedJobs,
      aiQueue
    };
  }

  /**
   * Get top topics, keywords, categories, and score distributions via aggregation.
   * @param {string} userId - Authenticated user ID
   */
  async getTrends(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Top Topics
    const topTopics = await Summary.aggregate([
      { $match: { userId: userObjectId } },
      { $unwind: "$topics" },
      { $group: { _id: "$topics", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { topic: "$_id", count: 1, _id: 0 } }
    ]);

    // 2. Top Keywords
    const topKeywords = await Summary.aggregate([
      { $match: { userId: userObjectId } },
      { $unwind: "$keywords" },
      { $group: { _id: "$keywords", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { keyword: "$_id", count: 1, _id: 0 } }
    ]);

    // 3. Top Categories (from Source metadata mapping)
    const topCategories = await ContentItem.aggregate([
      { $match: { userId: userObjectId } },
      {
        $lookup: {
          from: "sources",
          localField: "sourceId",
          foreignField: "_id",
          as: "source"
        }
      },
      { $unwind: "$source" },
      { $group: { _id: "$source.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { category: "$_id", count: 1, _id: 0 } }
    ]);

    // 4. Opportunity Score Distribution (groups recommendations by range brackets)
    const scoreBuckets = await Recommendation.aggregate([
      { $match: { userId: userObjectId } },
      {
        $bucket: {
          groupBy: "$opportunityScore",
          boundaries: [0, 20, 40, 60, 80, 101],
          default: "unknown",
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const formattedDistribution = scoreBuckets.map((bucket) => {
      let range = "";
      if (bucket._id === 0) range = "0-20";
      else if (bucket._id === 20) range = "21-40";
      else if (bucket._id === 40) range = "41-60";
      else if (bucket._id === 60) range = "61-80";
      else if (bucket._id === 80) range = "81-100";
      else range = "Unknown";

      return {
        range,
        count: bucket.count
      };
    });

    return {
      topTopics,
      topKeywords,
      topCategories,
      opportunityScoreDistribution: formattedDistribution
    };
  }

  /**
   * Get latest ingested content items.
   * @param {string} userId - Authenticated user ID
   */
  async getRecentContent(userId) {
    return await ContentItem.find({ userId })
      .sort({ publishedAt: -1 })
      .limit(10)
      .populate("sourceId", "name type category");
  }

  /**
   * Get latest social recommendations.
   * @param {string} userId - Authenticated user ID
   */
  async getRecentRecommendations(userId) {
    return await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("contentId", "title url");
  }

  /**
   * Get activities (crawls, summaries, recommendation triggers).
   * @param {string} userId - Authenticated user ID
   */
  async getActivityLogs(userId) {
    const [recentCrawls, aiEvents, recEvents] = await Promise.all([
      // Jobs (crawls)
      Job.find({ userId })
        .sort({ startedAt: -1 })
        .limit(10)
        .populate("sourceId", "name type"),

      // AI summary creation/updates
      Summary.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("contentId", "title"),

      // Recommendation creations
      Recommendation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("contentId", "title")
    ]);

    return {
      recentCrawls: recentCrawls.map((c) => ({
        id: c._id,
        sourceName: c.sourceId?.name || "Deleted Source",
        sourceType: c.sourceId?.type || "website",
        timestamp: c.startedAt,
        status: c.status,
        error: c.error
      })),
      aiProcessingEvents: aiEvents.map((a) => ({
        id: a._id,
        title: a.contentId?.title || "Deleted Article",
        timestamp: a.createdAt,
        status: "completed"
      })),
      recommendationEvents: recEvents.map((r) => ({
        id: r._id,
        title: r.contentId?.title || "Deleted Article",
        platforms: r.platform,
        format: r.contentFormat,
        timestamp: r.createdAt,
        status: "generated"
      }))
    };
  }
}

export default new DashboardService();
