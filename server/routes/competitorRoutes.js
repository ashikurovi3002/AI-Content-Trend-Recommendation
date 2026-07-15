import express from "express";
import competitorController from "../controllers/competitorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Brand Profile management
router.get("/profile", protect, competitorController.getBrandProfile);
router.put("/profile", protect, competitorController.updateBrandProfile);

// Tracked Competitors list & mutations
router.get("/", protect, competitorController.getCompetitors);
router.post("/", protect, competitorController.addCompetitor);
router.delete("/:id", protect, competitorController.deleteCompetitor);
router.post("/:id/scan", protect, competitorController.scanCompetitor);

// Competitor Posts
router.get("/posts", protect, competitorController.getCompetitorPosts);
router.post("/posts/:id/beat", protect, competitorController.beatPost);

// Strategic Reporting
router.post("/compare", protect, competitorController.compareCompetitors);
router.post("/weekly-strategy", protect, competitorController.weeklyStrategy);
router.get("/reports", protect, competitorController.getReports);

export default router;
