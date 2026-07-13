import mongoose, { Document, Schema } from 'mongoose';

export interface ICalendarEvent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  platform: string; // e.g., 'youtube', 'facebook', 'blog'
  status: 'planned' | 'drafting' | 'published' | 'cancelled';
  recommendationId?: mongoose.Types.ObjectId; // Optional link back to a generated recommendation
  createdAt: Date;
  updatedAt: Date;
}

const CalendarEventSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true, index: true },
    platform: { type: String, required: true },
    status: { 
        type: String, 
        required: true, 
        enum: ['planned', 'drafting', 'published', 'cancelled'],
        default: 'planned'
    },
    recommendationId: { type: Schema.Types.ObjectId, ref: 'Recommendation' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
