import { Request, Response } from 'express';
import Content from '../models/Content';
import Source from '../models/Source';
import Recommendation from '../models/Recommendation';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // Assuming auth middleware sets req.user. For now using mock user ID.
    const userId = (req as any).user?.id || 'mock-user-id';
    
    // 1. Stats
    const totalSources = await Source.countDocuments({ createdBy: userId });
    const websiteSources = await Source.countDocuments({ createdBy: userId, type: 'website' });
    const youtubeSources = await Source.countDocuments({ createdBy: userId, type: 'youtube' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newBlogsToday = await Content.countDocuments({ 
      userId, 
      contentType: 'blog',
      createdAt: { $gte: today }
    });

    const newVideosToday = await Content.countDocuments({ 
      userId, 
      contentType: 'video',
      createdAt: { $gte: today }
    });

    const pendingRecommendations = await Recommendation.countDocuments({ 
      userId,
      status: 'pending' 
    });

    // 2. Latest Content (limit 5)
    const latestContent = await Content.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('sourceId', 'name type');

    // 3. Top AI Recommendations (limit 5)
    const topRecommendations = await Recommendation.find({ userId, status: 'pending' })
      .sort({ opportunityScore: -1 })
      .limit(5);

    // 4. Activity Feed (Mocking empty for now, would typically be from an Activity collection)
    const activityFeed: any[] = [];

    // 5. Trending Topics (Mocking empty for now, would typically aggregate from Summary.topics)
    const trendingTopics: any[] = [];

    res.status(200).json({
      stats: {
        totalSources,
        websiteSources,
        youtubeSources,
        newBlogsToday,
        newVideosToday,
        pendingRecommendations
      },
      latestContent,
      topRecommendations,
      activityFeed,
      trendingTopics
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
