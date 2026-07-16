import mongoose from "mongoose";
import { runDbMigration } from "../utils/dbMigration.js";

/**
 * Connects to MongoDB Atlas using the MONGO_URI environment variable.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    
    // Execute tenant data migration check asynchronously on startup
    runDbMigration().catch((err) => {
      console.error("❌ Startup DB Migration failed:", err.message);
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
