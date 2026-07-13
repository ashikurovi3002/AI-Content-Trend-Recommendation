import express from 'express';
import * as contentController from '../controllers/contentController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/dashboard', authenticate, contentController.listDashboardContents);
router.get('/source/:sourceId', authenticate, contentController.getSourceContents);

export default router;
