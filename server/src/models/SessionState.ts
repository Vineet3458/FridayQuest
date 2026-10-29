import mongoose, { Schema, Document } from 'mongoose';

export interface IRoleAssignment {
  userId: string;
  roleKey: string;
  roleLabel: string;
  secretValue?: string;
}

export interface ISessionState extends Document {
  sessionId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  currentGameIdx: number;
  stepIdx: number;
  round: number;
  timers: {
    endsAt?: Date;
    durationSec?: number;
    running: boolean;
  };
  roleAssignments: IRoleAssignment[];
  scores: Record<string, number>;
  buzzerState: {
    locked: boolean;
    lockedByUserId?: string;
    lockedByUserName?: string;
    lockedAt?: Date;
  };
  votes: Array<{
    userId: string;
    targetId: string;
  }>;
  paused: boolean;
  status: 'waiting' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const SessionStateSchema = new Schema<ISessionState>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, unique: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    currentGameIdx: { type: Number, default: 0 },
    stepIdx: { type: Number, default: 0 },
    round: { type: Number, default: 1 },
    timers: {
      endsAt: { type: Date },
      durationSec: { type: Number, default: 0 },
      running: { type: Boolean, default: false },
    },
    roleAssignments: [
      {
        userId: { type: String, required: true },
        roleKey: { type: String, required: true },
        roleLabel: { type: String, required: true },
        secretValue: { type: String },
      },
    ],
    scores: { type: Schema.Types.Mixed, default: {} },
    buzzerState: {
      locked: { type: Boolean, default: false },
      lockedByUserId: { type: String },
      lockedByUserName: { type: String },
      lockedAt: { type: Date },
    },
    votes: [
      {
        userId: { type: String, required: true },
        targetId: { type: String, required: true },
      },
    ],
    paused: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'completed'],
      default: 'waiting',
    },
  },
  { timestamps: true }
);

export const SessionState = mongoose.model<ISessionState>('SessionState', SessionStateSchema);

