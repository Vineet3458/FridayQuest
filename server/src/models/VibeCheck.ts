import mongoose, { Schema, Document } from 'mongoose';

export interface IVibeCheck extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  attending: 'yes' | 'no' | 'maybe';
  energy: number; // 1 to 5
  style: 'active' | 'calm' | 'brainy';
  skipGameIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VibeCheckSchema = new Schema<IVibeCheck>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    attending: {
      type: String,
      enum: ['yes', 'no', 'maybe'],
      required: true,
      default: 'yes',
    },
    energy: { type: Number, min: 1, max: 5, default: 3 },
    style: {
      type: String,
      enum: ['active', 'calm', 'brainy'],
      default: 'active',
    },
    skipGameIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

VibeCheckSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

export const VibeCheck = mongoose.model<IVibeCheck>('VibeCheck', VibeCheckSchema);

