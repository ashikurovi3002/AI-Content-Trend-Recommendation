import express from "express";
import scanController from "../controllers/scanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Trigger scan across all active website sources
router.post("/", protect, scanController.scanAll);

// Trigger scan on a single website source
router.post("/:sourceId", protect, scanController.scanSingle);

export default router;
