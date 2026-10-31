/**
 * FridayQuest Platform Constants
 */

export const APP_CONFIG = {
  appName: 'FridayQuest',
  tagline: 'Play. Connect. Grow.',
  defaultTimezone: 'Asia/Kolkata',
  defaultOrgName: 'Kirxa Labs',
  supportEmail: 'support@fridayquest.io',
} as const;

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ACHIEVEMENTS: '/achievements',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  GAMES: '/games',
  SESSIONS: '/sessions',
  TEAMS: '/teams',
  ANALYTICS: '/analytics',
  APPROVALS: '/approvals',
  ROLES: '/roles',
} as const;

export const CAMPUSES = [
  { id: 'noida-hq', name: 'Noida HQ Campus', location: 'Sector 62, Noida, India' },
  { id: 'bengaluru-innovation', name: 'Bengaluru Innovation Center', location: 'Outer Ring Rd, Bengaluru, India' },
  { id: 'gurugram-tech', name: 'Gurugram Tech Park', location: 'Cyber Hub, Gurugram, India' },
  { id: 'mumbai-hub', name: 'Mumbai Financial Hub', location: 'BKC, Mumbai, India' },
  { id: 'pune-cybercity', name: 'Pune Cybercity', location: 'Magarpatta, Pune, India' },
  { id: 'remote', name: 'Remote / Hybrid Employee', location: 'Virtual' },
] as const;

export const DEPARTMENTS = [
  'Engineering',
  'Design & Creative',
  'Product Management',
  'Marketing & Growth',
  'Sales & Business Dev',
  'People & Culture (HR)',
  'Operations',
  'Finance & Accounts',
  'Quality Assurance',
  'Legal & Compliance',
] as const;

export const PLAY_STYLES = [
  { id: '⚡ Active', label: 'Active & Competitive', desc: 'Buzzer reflexes, speed rounds & high energy games' },
  { id: '🧘 Calm', label: 'Calm & Social', desc: 'Storytelling, music trivia, and relaxed connections' },
  { id: '🧠 Brainy', label: 'Brainy & Strategy', desc: 'Deep deduction, word puzzles & intellectual challenges' },
  { id: '🤝 Team First', label: 'Team First', desc: 'Cooperative tasks, moral support & cheerleading' },
] as const;

export const FRIDAY_SNACKS = [
  { id: '☕ Masala Chai & Samosa', label: 'Chai & Samosa', icon: '☕' },
  { id: '🥤 Cold Coffee & Brownie', label: 'Cold Coffee & Brownie', icon: '🥤' },
  { id: '🍕 Pizza & Drinks', label: 'Pizza & Drinks', icon: '🍕' },
  { id: '🥟 Dimsums & Green Tea', label: 'Dimsums & Green Tea', icon: '🥟' },
  { id: '🥗 Healthy Fruit Bowl', label: 'Healthy & Fresh', icon: '🥗' },
] as const;

