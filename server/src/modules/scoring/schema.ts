import { z } from 'zod';

export const awardScoreSchema = z.object({
  gameId: z.string().optional(),
  round: z.number().int().min(1).default(1),
  teamId: z.string().optional(),
  userId: z.string().optional(),
  points: z.number().int(),
  reason: z.string().min(1, 'Reason is required'),
});

