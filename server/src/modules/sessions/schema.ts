import { z } from 'zod';

export const createSessionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  date: z.string().or(z.date()),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'),
  durationMin: z.number().int().min(15).max(300).default(90),
  location: z.string().default('Cafeteria'),
});

export const updateSessionSchema = z.object({
  title: z.string().min(2).optional(),
  date: z.string().or(z.date()).optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  durationMin: z.number().int().min(15).max(300).optional(),
  location: z.string().optional(),
  agenda: z
    .array(
      z.object({
        gameId: z.string(),
        gameName: z.string(),
        version: z.number().default(1),
        order: z.number(),
        start: z.string().optional(),
        durationMin: z.number(),
      })
    )
    .optional(),
  propsChecklist: z.array(z.string()).optional(),
});

