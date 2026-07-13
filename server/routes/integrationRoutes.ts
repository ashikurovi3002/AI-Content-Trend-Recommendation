import express from 'express';
import { 
  connectGoogle, 
  googleCallback, 
  connectMeta, 
  metaCallback, 
  connectLinkedin,
  linkedinCallback,
  getIntegrations 
} from '../controllers/integrationController';

const router = express.Router();

// Google Integrations (YouTube, Analytics)
router.get('/google', connectGoogle);
router.get('/google/callback', googleCallback);

// Meta Integrations (Facebook, Instagram)
router.get('/meta', connectMeta);
router.get('/meta/callback', metaCallback);

// LinkedIn Integrations
router.get('/linkedin', connectLinkedin);
router.get('/linkedin/callback', linkedinCallback);

// Fetch user's active integrations
router.get('/', getIntegrations);

export default router;
