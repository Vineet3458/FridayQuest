import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, UserStatus } from '../types/index.js';

export interface IUserPreferences {
  active?: boolean;
  calm?: boolean;
  brainy?: boolean;
  dislikes?: string[];
  notificationSettings?: {
    email?: boolean;
    inApp?: boolean;
  };
}

export interface IUser extends Document {
  orgId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  status: UserStatus;
  preferences: IUserPreferences;
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['superAdmin', 'orgAdmin', 'organizer', 'player'],
      default: 'player',
      required: true,
    },
    department: { type: String, default: 'General' },
    avatar: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'active'],
      default: 'active',
      required: true,
    },
    preferences: {
      active: { type: Boolean, default: true },
      calm: { type: Boolean, default: true },
      brainy: { type: Boolean, default: true },
      dislikes: { type: [String], default: [] },
      notificationSettings: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
      },
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

