import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional(),
  avatar: z.string().optional(),
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

