import mongoose, { Schema, Document } from 'mongoose';

export interface IScoreEvent extends Document {
  sessionId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  gameId?: string;
  round: number;
  teamId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  points: number;
  reason: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreEventSchema = new Schema<IScoreEvent>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    gameId: { type: String },
    round: { type: Number, default: 1 },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    points: { type: Number, required: true },
    reason: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const ScoreEvent = mongoose.model<IScoreEvent>('ScoreEvent', ScoreEventSchema);

