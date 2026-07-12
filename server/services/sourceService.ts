import Source, { ISource } from '../models/Source';

export const createSource = async (sourceData: Partial<ISource>) => {
  const source = new Source(sourceData);
  return await source.save();
};

export const getSourcesByUser = async (userId: string) => {
  return Source.find({ createdBy: userId }).sort({ createdAt: -1 });
};

export const updateSourceStatus = async (id: string, isActive: boolean) => {
  return Source.findByIdAndUpdate(id, { isActive }, { new: true });
};
