/**
 * FridayQuest Server Core Constants
 */

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export const USER_ROLES = {
  SUPER_ADMIN: 'superAdmin',
  ORG_ADMIN: 'orgAdmin',
  ORGANIZER: 'organizer',
  PLAYER: 'player',
} as const;

export const SESSION_STATUSES = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const OFFICE_CAMPUSES = [
  'Noida HQ Campus',
  'Bengaluru Innovation Center',
  'Gurugram Tech Park',
  'Mumbai Financial Hub',
  'Pune Cybercity',
  'Remote / Hybrid',
] as const;

export const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'People & Culture',
  'Operations',
  'Finance',
  'QA',
] as const;

export const SYSTEM_DEFAULTS = {
  SESSION_DURATION_MIN: 90,
  START_TIME_IST: '16:00', // 4:00 PM IST
  MIN_PLAYERS: 4,
  MAX_PLAYERS: 120,
} as const;

