import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  employeeId: z.string().optional(),
  favoritePlayStyle: z.string().optional(),
  snackPreference: z.string().optional(),
  slackHandle: z.string().optional(),
  location: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      city: z.string().optional(),
      campus: z.string().optional(),
    })
    .optional(),
  preferences: z
    .object({
      active: z.boolean().optional(),
      calm: z.boolean().optional(),
      brainy: z.boolean().optional(),
      dislikes: z.array(z.string()).optional(),
      notificationSettings: z
        .object({
          email: z.boolean().optional(),
          inApp: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['orgAdmin', 'organizer', 'player']),
});

