import Recommendation from "../models/Recommendation.js";
import ContentItem from "../models/ContentItem.js";
import recommendationService from "../services/recommendationService.js";

/**
 * Controller to handle social growth recommendation requests.
 */
class RecommendationController {
  /**
   * Get all growth recommendations with pagination, search, filters, and score bounds.
   */
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const search = req.query.search || "";
      const platform = req.query.platform || "";
      const format = req.query.format || "";
      const minScore = parseInt(req.query.minScore) || 0;

      // Build search query filters
      const query = { userId: req.user.userId };

      if (search) {
        query.$or = [
          { suggestedTitle: { $regex: search, $options: "i" } },
          { hook: { $regex: search, $options: "i" } }
        ];
      }

      if (platform) {
        query.platform = platform;
      }

      if (format) {
        query.contentFormat = format;
      }

      if (minScore > 0) {
        // Filter by opportunityScore >= minScore
        query.opportunityScore = { $gte: minScore };
      }

      const totalItems = await Recommendation.countDocuments(query);
      const items = await Recommendation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "contentId",
          select: "title url author publishedAt"
        });

      return res.status(200).json({
        success: true,
        message: "Recommendations retrieved successfully",
        pagination: {
          totalItems,
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          limit
        },
        data: items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recommendation details by ID.
   */
  async getDetails(req, res, next) {
    try {
      const userId = req.user.userId;
      const recId = req.params.id;

      const recommendation = await Recommendation.findById(recId).populate({
        path: "contentId",
        populate: {
          path: "sourceId",
          select: "name type url"
        }
      });

      if (!recommendation) {
        const error = new Error("Recommendation not found");
        error.status = 404;
        throw error;
      }

      if (recommendation.userId && recommendation.userId.toString() !== userId.toString()) {
        const error = new Error("Forbidden: Access denied");
        error.status = 403;
        throw error;
      }

      return res.status(200).json({
        success: true,
        message: "Recommendation details retrieved successfully",
        data: recommendation
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Manually trigger recommendation generation for a specific content item.
   */
  async generate(req, res, next) {
    try {
      const userId = req.user.userId;
      const contentItemId = req.params.contentId;

      const contentItem = await ContentItem.findById(contentItemId);
      if (!contentItem) {
        const error = new Error("Content item not found");
        error.status = 404;
        throw error;
      }

      if (contentItem.userId && contentItem.userId.toString() !== userId.toString()) {
        const error = new Error("Forbidden: Access denied");
        error.status = 403;
        throw error;
      }

      const recommendation = await recommendationService.generateRecommendation(contentItemId);

      return res.status(201).json({
        success: true,
        message: "Recommendation generated successfully",
        data: recommendation
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RecommendationController();
