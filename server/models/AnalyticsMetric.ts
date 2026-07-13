import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsMetric extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'google' | 'meta' | 'linkedin' | 'system';
  metricName: string; // e.g., 'page_views', 'likes', 'shares', 'reach'
  value: number;
  date: Date;
  contentId?: mongoose.Types.ObjectId; // Optional: If the metric is tied to a specific post/video
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsMetricSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    platform: { type: String, required: true },
    metricName: { type: String, required: true, index: true },
    value: { type: Number, required: true },
    date: { type: Date, required: true, index: true },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content' },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying of time-series data for a user
AnalyticsMetricSchema.index({ userId: 1, platform: 1, metricName: 1, date: -1 });

export default mongoose.model<IAnalyticsMetric>('AnalyticsMetric', AnalyticsMetricSchema);
