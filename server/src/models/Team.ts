import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  sessionId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  memberIds: mongoose.Types.ObjectId[];
  scope: string; // 'session' or specific gameId
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: '#3B82F6' },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    scope: { type: String, default: 'session' },
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>('Team', TeamSchema);

