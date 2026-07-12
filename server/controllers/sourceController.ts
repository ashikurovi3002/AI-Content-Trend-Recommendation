import { Request, Response } from 'express';
import * as sourceService from '../services/sourceService';

export const addSource = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const sourceData = { ...req.body, createdBy: userId };
    const source = await sourceService.createSource(sourceData);
    res.status(201).json(source);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listSources = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const sources = await sourceService.getSourcesByUser(userId);
    res.status(200).json(sources);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleSourceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const updatedSource = await sourceService.updateSourceStatus(id as string, isActive);
    res.status(200).json(updatedSource);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
