import express from "express";
import sourceController from "../controllers/sourceController.js";
import { validateCreateSource, validateUpdateSource } from "../middleware/sourceValidation.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all sources
router.get("/", protect, sourceController.getAll);

// Create a new source
router.post("/", protect, validateCreateSource, sourceController.create);

// Update a source
router.put("/:id", protect, validateUpdateSource, sourceController.update);

// Delete a source
router.delete("/:id", protect, sourceController.delete);

// Pause a source
router.patch("/:id/pause", protect, sourceController.pause);

// Resume a source
router.patch("/:id/resume", protect, sourceController.resume);

export default router;
