import mongoose, { Schema, Document } from 'mongoose';
import { SessionAgendaItem, SessionStatus } from '../types/index.js';

export interface ISession extends Document {
  orgId: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  startTime: string;
  durationMin: number;
  location: string;
  status: SessionStatus;
  agenda: SessionAgendaItem[];
  joinCode: string;
  organizerId: mongoose.Types.ObjectId;
  seasonId?: mongoose.Types.ObjectId;
  propsChecklist: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AgendaItemSchema = new Schema<SessionAgendaItem>(
  {
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    version: { type: Number, default: 1 },
    order: { type: Number, required: true },
    start: { type: String },
    durationMin: { type: Number, required: true },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISession>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    durationMin: { type: Number, default: 90 },
    location: { type: String, default: 'Cafeteria' },
    status: {
      type: String,
      enum: ['draft', 'voting', 'planned', 'live', 'done'],
      default: 'draft',
      index: true,
    },
    agenda: { type: [AgendaItemSchema], default: [] },
    joinCode: { type: String, required: true, uppercase: true, trim: true },
    organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', default: null },
    propsChecklist: { type: [String], default: [] },
  },
  { timestamps: true }
);

SessionSchema.index({ orgId: 1, status: 1 });
SessionSchema.index({ joinCode: 1 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);

