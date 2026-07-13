import mongoose, { Document, Schema } from 'mongoose';

export interface ISummary extends Document {
  userId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;
  summary: string;
  keywords: string[];
  topics: string[];
  audience?: string;
  sentiment?: string;
  difficulty?: string;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SummarySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    summary: { type: String, required: true },
    keywords: { type: [String], default: [] },
    topics: { type: [String], default: [] },
    audience: { type: String },
    sentiment: { type: String },
    difficulty: { type: String },
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISummary>('Summary', SummarySchema);
