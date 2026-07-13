import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20); // fetch last 20 notifications

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({ notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    
    // Support marking all as read if id is 'all'
    if (id === 'all') {
      await Notification.updateMany({ userId, isRead: false }, { isRead: true });
      return res.status(200).json({ message: 'All notifications marked as read' });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
