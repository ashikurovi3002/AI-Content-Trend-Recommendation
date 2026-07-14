import express from "express";
import recommendationController from "../controllers/recommendationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get list of all recommendations
router.get("/", protect, recommendationController.getAll);

// Get specific recommendation details
router.get("/:id", protect, recommendationController.getDetails);

// Manually trigger recommendation generation for a content item
router.post("/:contentId/generate", protect, recommendationController.generate);

export default router;
