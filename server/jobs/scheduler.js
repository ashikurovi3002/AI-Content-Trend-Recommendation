import cron from "node-cron";
import Source from "../models/Source.js";
import crawlerService from "../services/crawlerService.js";
import youtubeService from "../services/youtubeService.js";
import aiService from "../services/aiService.js";

/**
 * Initialize background schedules for monitored sources.
 * Scheduled to run every 4 hours.
 */
export const initScheduler = () => {
  console.log("⏰ Ingestion scheduler initialized");

  // Cron schedule: Run every 4 hours (0 */4 * * *)
  cron.schedule("0 */4 * * *", async () => {
    console.log("⏰ Background cron check started: Scanning active sources...");

    try {
      // Find all active sources
      const activeSources = await Source.find({
        status: "active"
      });

      console.log(`⏰ Found ${activeSources.length} active sources to scan.`);

      for (const source of activeSources) {
        try {
          let items = [];
          if (source.type === "youtube") {
            items = await youtubeService.crawlChannel(source._id, source.url);
          } else {
            items = await crawlerService.crawlSource(source._id, source.url);
          }

          // Update last check timestamp
          source.lastCheckedAt = new Date();
          await source.save();

          // Process the items asynchronously using AI Service
          for (const item of items) {
            aiService.processContentItem(item._id).catch((err) => {
              console.error(
                `⏰ Ingestion background AI processing failed for content ${item._id}: ${err.message}`
              );
            });
          }

          console.log(`⏰ Ingestion crawl completed for source: ${source.name}`);
        } catch (err) {
          console.error(`⏰ Ingestion scan failed for source [${source.name}]: ${err.message}`);

          // Mark status as error in MongoDB
          source.status = "error";
          await source.save();
        }
      }
    } catch (err) {
      console.error(`⏰ Global scheduler check error: ${err.message}`);
    }
  });
};
