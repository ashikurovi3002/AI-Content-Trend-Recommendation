import ContentItem from "../models/ContentItem.js";
import Summary from "../models/Summary.js";
import Recommendation from "../models/Recommendation.js";
import Job from "../models/Job.js";
import CompetitorPost from "../models/CompetitorPost.js";
import Source from "../models/Source.js";
import Competitor from "../models/Competitor.js";

/**
 * Migration runner to repair any legacy/existing records missing userId fields,
 * mapping them using parent sources/competitors.
 */
export const runDbMigration = async () => {
  console.log("🛠️ Starting database multi-tenant migration checks...");
  try {
    // 1. Fetch Source mappings
    const sources = await Source.find({});
    const sourceUserMap = new Map(sources.map((s) => [s._id.toString(), s.userId]));

    // Update ContentItems missing userId
    const contentItemsToUpdate = await ContentItem.find({ userId: { $exists: false } });
    let updatedContentCount = 0;
    for (const item of contentItemsToUpdate) {
      const uId = sourceUserMap.get(item.sourceId?.toString());
      if (uId) {
        item.userId = uId;
        await item.save();
        updatedContentCount++;
      }
    }
    if (updatedContentCount > 0) {
      console.log(`✅ Migrated ${updatedContentCount} ContentItem records with userId.`);
    }

    // Update Jobs missing userId
    const jobsToUpdate = await Job.find({ userId: { $exists: false } });
    let updatedJobCount = 0;
    for (const job of jobsToUpdate) {
      const uId = sourceUserMap.get(job.sourceId?.toString());
      if (uId) {
        job.userId = uId;
        await job.save();
        updatedJobCount++;
      }
    }
    if (updatedJobCount > 0) {
      console.log(`✅ Migrated ${updatedJobCount} Job records with userId.`);
    }

    // 2. Fetch Competitor mappings
    const competitors = await Competitor.find({});
    const competitorUserMap = new Map(competitors.map((c) => [c._id.toString(), c.userId]));

    // Update CompetitorPosts missing userId
    const postsToUpdate = await CompetitorPost.find({ userId: { $exists: false } });
    let updatedPostCount = 0;
    for (const post of postsToUpdate) {
      const uId = competitorUserMap.get(post.competitorId?.toString());
      if (uId) {
        post.userId = uId;
        await post.save();
        updatedPostCount++;
      }
    }
    if (updatedPostCount > 0) {
      console.log(`✅ Migrated ${updatedPostCount} CompetitorPost records with userId.`);
    }

    // 3. Map ContentItems for Summary/Recommendation dependencies
    const allContent = await ContentItem.find({});
    const contentUserMap = new Map(allContent.map((c) => [c._id.toString(), c.userId]));

    // Update Summaries missing userId
    const summariesToUpdate = await Summary.find({ userId: { $exists: false } });
    let updatedSummaryCount = 0;
    for (const summary of summariesToUpdate) {
      const uId = contentUserMap.get(summary.contentId?.toString());
      if (uId) {
        summary.userId = uId;
        await summary.save();
        updatedSummaryCount++;
      }
    }
    if (updatedSummaryCount > 0) {
      console.log(`✅ Migrated ${updatedSummaryCount} Summary records with userId.`);
    }

    // Update Recommendations missing userId
    const recommendationsToUpdate = await Recommendation.find({ userId: { $exists: false } });
    let updatedRecCount = 0;
    for (const rec of recommendationsToUpdate) {
      const uId = contentUserMap.get(rec.contentId?.toString());
      if (uId) {
        rec.userId = uId;
        await rec.save();
        updatedRecCount++;
      }
    }
    if (updatedRecCount > 0) {
      console.log(`✅ Migrated ${updatedRecCount} Recommendation records with userId.`);
    }

    console.log("🛠️ Database multi-tenant migration checks completed.");
  } catch (error) {
    console.error("❌ Database migration checks failed:", error.message);
  }
};
