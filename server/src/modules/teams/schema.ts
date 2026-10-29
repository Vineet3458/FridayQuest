import { z } from 'zod';

export const generateTeamsSchema = z.object({
  numTeams: z.number().int().min(2).max(20).default(2),
  mode: z.enum(['mixed', 'random', 'by_department']).default('mixed'),
});

export const updateTeamsSchema = z.object({
  teams: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1),
      color: z.string(),
      memberIds: z.array(z.string()),
    })
  ),
});

