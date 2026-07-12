import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  sourceId: mongoose.Types.ObjectId;
  status: string;
  startedAt: Date;
  finishedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    sourceId: { type: Schema.Types.ObjectId, ref: 'Source', required: true, index: true },
    status: { type: String, required: true, enum: ['running', 'completed', 'failed'], index: true },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    error: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJob>('Job', JobSchema);
