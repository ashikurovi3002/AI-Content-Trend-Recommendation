import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  sourceId: mongoose.Types.ObjectId;
  title: string;
  url: string;
  thumbnail?: string;
  author?: string;
  publishedAt?: Date;
  contentType: string;
  rawText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
  {
    sourceId: { type: Schema.Types.ObjectId, ref: 'Source', required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String },
    author: { type: String },
    publishedAt: { type: Date, index: true },
    contentType: { type: String, required: true, enum: ['blog', 'video'], index: true },
    rawText: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContent>('Content', ContentSchema);
