import { z } from 'zod';

export const registerOrgSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  adminName: z.string().min(2, 'Admin name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerEmployeeSchema = z.object({
  inviteCode: z.string().min(4, 'Valid invite code is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export const trialRoleSchema = z.object({
  role: z.enum(['superAdmin', 'orgAdmin', 'organizer', 'player']),
});


