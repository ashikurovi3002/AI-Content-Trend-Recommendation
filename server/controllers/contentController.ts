import { Request, Response } from 'express';
import * as contentService from '../services/contentService';

export const listDashboardContents = async (req: Request, res: Response) => {
  try {
    // In a real scenario, this might filter by user's sources
    const limit = parseInt(req.query.limit as string) || 20;
    const contents = await contentService.getRecentContents(limit);
    res.status(200).json(contents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSourceContents = async (req: Request, res: Response) => {
  try {
    const { sourceId } = req.params;
    const contents = await contentService.getContentsBySource(sourceId as string);
    res.status(200).json(contents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
