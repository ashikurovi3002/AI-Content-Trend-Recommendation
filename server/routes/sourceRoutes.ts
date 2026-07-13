import express from 'express';
import * as sourceController from '../controllers/sourceController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticate, sourceController.addSource);
router.get('/', authenticate, sourceController.listSources);
router.patch('/:id/status', authenticate, sourceController.toggleSourceStatus);

export default router;
