import sourceService from "../services/sourceService.js";

/**
 * Controller to handle all content source related requests.
 */
class SourceController {
  /**
   * Create a new content source.
   */
  async create(req, res, next) {
    try {
      const userId = req.user.userId;
      const source = await sourceService.createSource(userId, req.body);

      return res.status(201).json({
        success: true,
        message: "Source created successfully",
        data: {
          id: source._id,
          name: source.name,
          type: source.type,
          url: source.url,
          category: source.category,
          status: source.status,
          lastCheckedAt: source.lastCheckedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all sources for the authenticated user.
   */
  async getAll(req, res, next) {
    try {
      const userId = req.user.userId;
      const sources = await sourceService.getSources(userId);

      const formattedSources = sources.map((source) => ({
        id: source._id,
        name: source.name,
        type: source.type,
        url: source.url,
        category: source.category,
        status: source.status,
        lastCheckedAt: source.lastCheckedAt
      }));

      return res.status(200).json({
        success: true,
        message: "Request successful",
        data: formattedSources
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing source.
   */
  async update(req, res, next) {
    try {
      const userId = req.user.userId;
      const sourceId = req.params.id;
      const source = await sourceService.updateSource(userId, sourceId, req.body);

      return res.status(200).json({
        success: true,
        message: "Source updated successfully",
        data: {
          id: source._id,
          name: source.name,
          type: source.type,
          url: source.url,
          category: source.category,
          status: source.status,
          lastCheckedAt: source.lastCheckedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a content source.
   */
  async delete(req, res, next) {
    try {
      const userId = req.user.userId;
      const sourceId = req.params.id;
      await sourceService.deleteSource(userId, sourceId);

      return res.status(200).json({
        success: true,
        message: "Source deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Pause a monitored source.
   */
  async pause(req, res, next) {
    try {
      const userId = req.user.userId;
      const sourceId = req.params.id;
      const source = await sourceService.pauseSource(userId, sourceId);

      return res.status(200).json({
        success: true,
        message: "Source paused successfully",
        data: {
          id: source._id,
          name: source.name,
          type: source.type,
          url: source.url,
          category: source.category,
          status: source.status,
          lastCheckedAt: source.lastCheckedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Resume a paused source.
   */
  async resume(req, res, next) {
    try {
      const userId = req.user.userId;
      const sourceId = req.params.id;
      const source = await sourceService.resumeSource(userId, sourceId);

      return res.status(200).json({
        success: true,
        message: "Source resumed successfully",
        data: {
          id: source._id,
          name: source.name,
          type: source.type,
          url: source.url,
          category: source.category,
          status: source.status,
          lastCheckedAt: source.lastCheckedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SourceController();
