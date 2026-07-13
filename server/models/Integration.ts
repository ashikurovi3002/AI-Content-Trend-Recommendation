import mongoose, { Document, Schema } from 'mongoose';

export interface IIntegration extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'google' | 'meta' | 'linkedin';
  profileId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>; // Store extra info like channel name, page name, etc.
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: ['google', 'meta', 'linkedin'], required: true },
    profileId: { type: String, required: true }, // The ID returned by Google/Meta
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only link one profile per platform for now, or allow multiple depending on requirements.
// For MVP, let's keep it simple: one integration per platform per user.
IntegrationSchema.index({ userId: 1, platform: 1 }, { unique: true });

export default mongoose.model<IIntegration>('Integration', IntegrationSchema);
