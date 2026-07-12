import { Request, Response } from 'express';
import * as recommendationService from '../services/recommendationService';

export const listRecommendations = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const recommendations = await recommendationService.getTopRecommendations(limit);
    res.status(200).json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
