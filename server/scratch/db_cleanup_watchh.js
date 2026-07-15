import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import ContentItem from "../models/ContentItem.js";
import Source from "../models/Source.js";

// Load environment variables
dotenv.config();

const runCleanup = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI environment variable is not defined");
    process.exit(1);
  }

  try {
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully.");

    // 1. Clean ContentItems
    const contentItems = await ContentItem.find({
      $or: [
        { url: { $regex: /watchh\?v=/ } },
        { externalId: { $regex: /watchh\?v=/ } }
      ]
    });

    console.log(`🔍 Found ${contentItems.length} ContentItems with 'watchh?v='`);

    for (const item of contentItems) {
      const oldUrl = item.url;
      const oldExternalId = item.externalId;
      
      item.url = item.url.replace("watchh?v=", "watch?v=");
      item.externalId = item.externalId.replace("watchh?v=", "watch?v=");
      
      await item.save();
      console.log(`   ✏️ Updated ContentItem URL:\n     Old: ${oldUrl}\n     New: ${item.url}`);
    }

    // 2. Clean Sources
    const sources = await Source.find({
      url: { $regex: /watchh\?v=/ }
    });

    console.log(`🔍 Found ${sources.length} Sources with 'watchh?v='`);

    for (const source of sources) {
      const oldUrl = source.url;
      source.url = source.url.replace("watchh?v=", "watch?v=");
      await source.save();
      console.log(`   ✏️ Updated Source URL:\n     Old: ${oldUrl}\n     New: ${source.url}`);
    }

    console.log("🎉 Database cleanup complete.");
  } catch (error) {
    console.error("❌ Database cleanup failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
};

runCleanup();
