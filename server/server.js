import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initScheduler } from "./jobs/scheduler.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize scheduler conditionally
if (process.env.ENABLE_SCHEDULER === "true") {
  initScheduler();
} else {
  console.log("⏰ Background Ingestion Scheduler is disabled (ENABLE_SCHEDULER=false)");
}

// Port settings
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 TrendPilot AI Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
