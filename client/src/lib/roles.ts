import { UserRole } from '@/types';

export interface RoleMeta {
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  textColor: string;
  borderColor: string;
  description: string;
  features: string[];
}

export const ROLE_INFO: Record<UserRole, RoleMeta> = {
  superAdmin: {
    title: 'Super Admin',
    subtitle: 'Platform Owner (Kirxa)',
    badge: 'Platform Control',
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500',
    description: 'Creates and manages company workspaces, oversees all organizations and system-wide settings.',
    features: [
      'Manage all organizations & workspaces',
      'Platform-wide metrics & telemetry',
      'Global game template overrides',
      'Full organizer & live host privileges',
    ],
  },
  orgAdmin: {
    title: 'Org Admin',
    subtitle: 'HR / Company Admin (e.g. Riya)',
    badge: 'Company Control',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500',
    description: 'Manages company staff, approves new joiners, configures invite codes, approves custom games, and creates seasons.',
    features: [
      'Approve & manage employees',
      'View & share company invite code',
      'Review & publish custom game builder drafts',
      'Auto-planner & Team Maker management',
    ],
  },
  organizer: {
    title: 'Organizer',
    subtitle: 'Fun Friday Host / Emcee (e.g. Kabir)',
    badge: 'Session Host',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500',
    description: 'Rotates each week. Creates the Friday session, runs Auto-Planner, generates teams, and controls the live game engine.',
    features: [
      'Create & publish Friday sessions',
      'Run pure Auto-Planner algorithm',
      'Generate fair mixed teams',
      'Live control panel (Next step, pause, skip, bonus award)',
    ],
  },
  player: {
    title: 'Player',
    subtitle: 'Employee / Participant (e.g. Ananya)',
    badge: 'Player View',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    description: 'Any team member. Submits 10-second Vibe Check, plays on mobile, uses phone-as-prop tools, and rates games.',
    features: [
      'Submit Vibe Check (energy, mood, skips)',
      'Phone-as-prop: Secret Role Card (press & hold)',
      'Phone-as-prop: Real-time Buzzer with lockout',
      'Post-game 1-5 ratings & recap review',
    ],
  },
};

