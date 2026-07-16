import mongoose from "mongoose";
import dotenv from "dotenv";
import Source from "../models/Source.js";
import ContentItem from "../models/ContentItem.js";
import Recommendation from "../models/Recommendation.js";
import Summary from "../models/Summary.js";
import Job from "../models/Job.js";
import Competitor from "../models/Competitor.js";
import CompetitorPost from "../models/CompetitorPost.js";
import User from "../models/User.js";
import sourceService from "../services/sourceService.js";
import dashboardService from "../services/dashboardService.js";
import competitorController from "../controllers/competitorController.js";
import contentController from "../controllers/contentController.js";
import { runDbMigration } from "../utils/dbMigration.js";

// Load environment configurations
dotenv.config();

/**
 * Runs assertions on the multi-user isolation backend refactorings.
 */
async function runIsolationTest() {
  console.log("=========================================");
  console.log("🔒 Running Multi-User Isolation Asserts");
  console.log("=========================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // Establish connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📡 Connected to Database for isolation assertions");

    // Clean up test records
    await User.deleteMany({ email: { $in: ["usera@test.com", "userb@test.com"] } });

    // Create 2 distinct test users
    const userA = new User({ name: "User A", email: "usera@test.com", passwordHash: "dummyhash" });
    const userB = new User({ name: "User B", email: "userb@test.com", passwordHash: "dummyhash" });
    await userA.save();
    await userB.save();

    const userIdA = userA._id.toString();
    const userIdB = userB._id.toString();

    // Clean up old associated items
    await Source.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await Competitor.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await CompetitorPost.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await ContentItem.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await Summary.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await Recommendation.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await Job.deleteMany({ userId: { $in: [userIdA, userIdB] } });

    // 1. Create a Source for User B
    const sourceB = new Source({
      userId: userIdB,
      name: "User B Source",
      type: "website",
      url: "https://userb-source-site.com",
      category: "technology",
      status: "active"
    });
    await sourceB.save();

    // 2. Assert User A cannot update or delete User B's source (should return 403 Forbidden)
    try {
      await sourceService.updateSource(userIdA, sourceB._id.toString(), { name: "Hijacked Source" });
      assert(false, "User A was incorrectly allowed to update User B's source.");
    } catch (err) {
      assert(err.status === 403, "Source Update: Access violation returns 403 Forbidden");
    }

    try {
      await sourceService.deleteSource(userIdA, sourceB._id.toString());
      assert(false, "User A was incorrectly allowed to delete User B's source.");
    } catch (err) {
      assert(err.status === 403, "Source Delete: Access violation returns 403 Forbidden");
    }

    // 3. Create a Competitor for User B
    const competitorB = new Competitor({
      userId: userIdB,
      brandName: "User B Competitor",
      pageUrl: "https://facebook.com/userbcompetitor",
      category: "marketing"
    });
    await competitorB.save();

    // Mock Express response helper
    const makeMockRes = () => {
      const res = {
        statusCode: 200,
        jsonPayload: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.jsonPayload = data;
          return this;
        }
      };
      return res;
    };

    // 4. Assert delete/scan competitor permissions
    const deleteReq = { params: { id: competitorB._id.toString() }, user: { userId: userIdA } };
    try {
      await competitorController.deleteCompetitor(deleteReq, makeMockRes(), (err) => {
        if (err) throw err;
      });
      assert(false, "User A was incorrectly allowed to delete User B's competitor.");
    } catch (err) {
      assert(err.status === 403, "Competitor Delete: Access violation returns 403 Forbidden");
    }

    const scanReq = { params: { id: competitorB._id.toString() }, user: { userId: userIdA } };
    try {
      await competitorController.scanCompetitor(scanReq, makeMockRes(), (err) => {
        if (err) throw err;
      });
      assert(false, "User A was incorrectly allowed to scan User B's competitor.");
    } catch (err) {
      assert(err.status === 403, "Competitor Scan: Access violation returns 403 Forbidden");
    }

    // 5. Create ContentItems for both users
    const contentItemB = new ContentItem({
      sourceId: sourceB._id,
      userId: userIdB,
      externalId: "https://userb-source-site.com/post-99",
      title: "User B Post title",
      url: "https://userb-source-site.com/post-99",
      processedStatus: "completed"
    });
    await contentItemB.save();

    const contentItemA = new ContentItem({
      sourceId: new mongoose.Types.ObjectId(),
      userId: userIdA,
      externalId: "https://usera-source-site.com/post-1",
      title: "User A Post title",
      url: "https://usera-source-site.com/post-1",
      processedStatus: "completed"
    });
    await contentItemA.save();

    // 6. Assert Content listing filters by user
    const getAllReq = { query: { limit: 10 }, user: { userId: userIdA } };
    const mockResGetAll = makeMockRes();
    await contentController.getAll(getAllReq, mockResGetAll, (err) => {
      if (err) throw err;
    });
    const retrievedItems = mockResGetAll.jsonPayload?.data || [];
    assert(
      retrievedItems.length === 1 && retrievedItems[0]._id.toString() === contentItemA._id.toString(),
      "Content Library listing retrieves only the authenticated user's documents"
    );

    // 7. Assert User A cannot read User B's content details
    const getDetailsReq = { params: { id: contentItemB._id.toString() }, user: { userId: userIdA } };
    try {
      await contentController.getDetails(getDetailsReq, makeMockRes(), (err) => {
        if (err) throw err;
      });
      assert(false, "User A was incorrectly allowed to read User B's content details.");
    } catch (err) {
      assert(err.status === 403, "Content Details: Access violation returns 403 Forbidden");
    }

    // 8. Assert Dashboard counts isolation
    const statsA = await dashboardService.getStats(userIdA);
    const statsB = await dashboardService.getStats(userIdB);
    assert(statsA.totalContent === 1, "Dashboard counts isolate ContentItem for User A");
    assert(statsB.totalContent === 1, "Dashboard counts isolate ContentItem for User B");

    // 9. Verify Startup database migration populates missing userId fields
    const orphanContent = new ContentItem({
      sourceId: sourceB._id, // User B's source
      externalId: "https://orphan-site.com/article",
      title: "Orphan Article Title",
      url: "https://orphan-site.com/article"
    });
    orphanContent.userId = undefined;
    await orphanContent.save({ validateBeforeSave: false });

    // Run the migration runner
    await runDbMigration();

    const migratedItem = await ContentItem.findById(orphanContent._id);
    assert(
      migratedItem.userId && migratedItem.userId.toString() === userIdB,
      "Start-up migration successfully populates missing user IDs mapping from parent documents"
    );

    // Clean up test documents
    await User.deleteMany({ email: { $in: ["usera@test.com", "userb@test.com"] } });
    await Source.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await Competitor.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await CompetitorPost.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await ContentItem.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await Summary.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await Recommendation.deleteMany({ userId: { $in: [userIdA, userIdB] } });
    await Job.deleteMany({ userId: { $in: [userIdA, userIdB] } });

    console.log("=========================================");
    console.log(`🏁 Isolation Asserts Finished: ${passed} Passed, ${failed} Failed.`);
    console.log("=========================================");

    await mongoose.disconnect();

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("❌ Testing assertion failure:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runIsolationTest();
