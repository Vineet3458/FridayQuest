import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  inviteCode: string;
  settings: {
    autoApprove: boolean;
    timezone: string;
  };
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    inviteCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    settings: {
      autoApprove: { type: Boolean, default: true },
      timezone: { type: String, default: 'UTC' },
    },
    plan: { type: String, default: 'free' },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);

