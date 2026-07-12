import mongoose, { Document, Schema } from 'mongoose';

export interface ISource extends Document {
  name: string;
  type: string;
  url: string;
  category: string;
  description?: string;
  isActive: boolean;
  lastChecked?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SourceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['website', 'youtube'] },
    url: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    lastChecked: { type: Date, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

SourceSchema.index({ type: 1 });

export default mongoose.model<ISource>('Source', SourceSchema);
