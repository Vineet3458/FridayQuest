import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  sessionId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  gameId: string;
  userId: mongoose.Types.ObjectId;
  score: number; // 1 to 5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    gameId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

RatingSchema.index({ sessionId: 1, userId: 1, gameId: 1 }, { unique: true });

export const Rating = mongoose.model<IRating>('Rating', RatingSchema);

