import Content, { IContent } from '../models/Content';

export const saveContent = async (contentData: Partial<IContent>) => {
  // Check if content already exists to prevent duplicates
  const existingContent = await Content.findOne({ url: contentData.url });
  if (existingContent) return existingContent;

  const content = new Content(contentData);
  return await content.save();
};

export const getContentsBySource = async (sourceId: string) => {
  return Content.find({ sourceId }).sort({ publishedAt: -1 });
};

export const getRecentContents = async (limit: number = 10) => {
  return Content.find().sort({ publishedAt: -1, createdAt: -1 }).limit(limit).populate('sourceId');
};
