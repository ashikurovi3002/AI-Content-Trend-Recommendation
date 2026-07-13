import express from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Fetch all dashboard overview data for the current user
router.get('/', authenticate, getDashboardData);

export default router;
