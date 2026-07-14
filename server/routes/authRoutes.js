import express from "express";
import authController from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register route
router.post("/register", validateRegister, authController.register);

// Login route
router.post("/login", validateLogin, authController.login);

// Profile route (protected)
router.get("/profile", protect, authController.profile);

export default router;
