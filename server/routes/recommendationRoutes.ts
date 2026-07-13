import express from 'express';
import * as recommendationController from '../controllers/recommendationController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticate, recommendationController.listRecommendations);

export default router;
