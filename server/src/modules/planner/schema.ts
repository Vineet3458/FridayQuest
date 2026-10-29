import { z } from 'zod';

export const generatePlanSchema = z.object({
  targetDurationMin: z.number().int().min(15).max(300).optional(),
});

