import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  contentId: mongoose.Types.ObjectId;
  suggestedTitle: string;
  hook?: string;
  outline: string[];
  platform: string;
  contentType: string;
  opportunityScore: number;
  confidenceScore: number;
  status: string;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    suggestedTitle: { type: String, required: true },
    hook: { type: String },
    outline: { type: [String], default: [] },
    platform: { type: String, required: true },
    contentType: { type: String, required: true },
    opportunityScore: { type: Number, required: true, index: true },
    confidenceScore: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
