import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.registerUser({ name, email, password });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // Assuming auth middleware sets this
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
