import Recommendation, { IRecommendation } from '../models/Recommendation';

export const saveRecommendations = async (recommendationsData: Partial<IRecommendation>[]) => {
  return await Recommendation.insertMany(recommendationsData);
};

export const getTopRecommendations = async (limit: number = 10) => {
  return Recommendation.find()
    .sort({ opportunityScore: -1, createdAt: -1 })
    .limit(limit)
    .populate({
      path: 'contentId',
      populate: { path: 'sourceId' }
    });
};
