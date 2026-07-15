import express from "express";
import aiStudioController from "../controllers/aiStudioController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate platform-specific drafts
router.post("/generate", protect, aiStudioController.generatePost);

// Interactively refine drafts
router.post("/refine", protect, aiStudioController.refinePost);

export default router;
