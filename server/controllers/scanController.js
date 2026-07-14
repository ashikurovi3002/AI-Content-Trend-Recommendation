import Source from "../models/Source.js";
import crawlerService from "../services/crawlerService.js";
import youtubeService from "../services/youtubeService.js";
import aiService from "../services/aiService.js";

/**
 * Controller to handle manual crawls/scans of content sources.
 */
class ScanController {
  /**
   * Run manual scan across all active sources.
   */
  async scanAll(req, res, next) {
    try {
      const userId = req.user.userId;
      // Get all active sources belonging to user
      const activeSources = await Source.find({ userId, status: "active" });

      const results = [];
      for (const source of activeSources) {
        try {
          let items = [];
          if (source.type === "youtube") {
            items = await youtubeService.crawlChannel(source._id, source.url);
          } else {
            items = await crawlerService.crawlSource(source._id, source.url);
          }

          // Update source check timestamp on success
          source.lastCheckedAt = new Date();
          await source.save();

          // Process the items asynchronously using AI Service
          for (const item of items) {
            aiService.processContentItem(item._id).catch((err) => {
              console.error(
                `❌ Background AI processing failed for content ${item._id}: ${err.message}`
              );
            });
          }

          results.push({
            sourceId: source._id,
            name: source.name,
            status: "success",
            itemsCollected: items.length
          });
        } catch (err) {
          console.error(`❌ Failed crawling source [${source.name}]: ${err.message}`);

          // Mark source status as error
          source.status = "error";
          await source.save();

          results.push({
            sourceId: source._id,
            name: source.name,
            status: "failed",
            error: err.message
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Ingestion scan completed",
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Scan single source by ID.
   */
  async scanSingle(req, res, next) {
    try {
      const userId = req.user.userId;
      const sourceId = req.params.sourceId;

      const source = await Source.findOne({ _id: sourceId, userId });
      if (!source) {
        const error = new Error("Source not found or access denied");
        error.status = 404;
        throw error;
      }

      let items = [];
      if (source.type === "youtube") {
        items = await youtubeService.crawlChannel(source._id, source.url);
      } else {
        items = await crawlerService.crawlSource(source._id, source.url);
      }

      // Update check timestamp
      source.lastCheckedAt = new Date();
      source.status = "active"; // Restore status to active if it was in error state
      await source.save();

      // Process the items asynchronously using AI Service
      for (const item of items) {
        aiService.processContentItem(item._id).catch((err) => {
          console.error(
            `❌ Background AI processing failed for content ${item._id}: ${err.message}`
          );
        });
      }

      return res.status(200).json({
        success: true,
        message: `Scan successful. Ingested ${items.length} items.`,
        data: {
          sourceId: source._id,
          name: source.name,
          itemsCollected: items.length
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ScanController();
