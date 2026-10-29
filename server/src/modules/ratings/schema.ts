import { z } from 'zod';

export const submitRatingSchema = z.object({
  gameId: z.string().min(1, 'gameId is required'),
  score: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

