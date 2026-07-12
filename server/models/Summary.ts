import mongoose, { Document, Schema } from 'mongoose';

export interface ISummary extends Document {
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
