import Job, { IJob } from '../models/Job';
import mongoose from 'mongoose';

export const createJob = async (sourceId: string) => {
  const job = new Job({
    sourceId: new mongoose.Types.ObjectId(sourceId),
    status: 'running',
    startedAt: new Date(),
  });
  return await job.save();
};

export const updateJobStatus = async (jobId: string, status: 'completed' | 'failed', error?: string) => {
  return Job.findByIdAndUpdate(
    jobId,
    { status, finishedAt: new Date(), error },
    { new: true }
  );
};

export const getRecentJobs = async (limit: number = 10) => {
  return Job.find().sort({ startedAt: -1 }).limit(limit).populate('sourceId');
};
