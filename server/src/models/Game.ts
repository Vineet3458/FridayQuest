import mongoose, { Schema, Document } from 'mongoose';
import { GameDefinition, GameLevel, GameStatus } from '../types/index.js';

export interface IGame extends Document {
  orgId?: mongoose.Types.ObjectId | null;
  name: string;
  slug: string;
  level: GameLevel;
  status: GameStatus;
  version: number;
  definition: GameDefinition;
  packs: string[];
  createdBy?: mongoose.Types.ObjectId | null;
  avgRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    level: { type: Number, enum: [1, 2, 3], default: 1 },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'approved', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    version: { type: Number, default: 1 },
    definition: { type: Schema.Types.Mixed, required: true },
    packs: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    avgRating: { type: Number, default: 4.0 },
  },
  { timestamps: true }
);

GameSchema.index({ orgId: 1, slug: 1 }, { unique: true });

export const Game = mongoose.model<IGame>('Game', GameSchema);

