import { z } from 'zod';

export const submitVibeSchema = z.object({
  attending: z.enum(['yes', 'no', 'maybe']),
  energy: z.number().int().min(1).max(5),
  style: z.enum(['active', 'calm', 'brainy']),
  skipGameIds: z.array(z.string()).default([]),
});

