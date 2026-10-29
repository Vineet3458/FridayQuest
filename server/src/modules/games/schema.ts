import { z } from 'zod';

export const gameDefinitionSchema = z.object({
  name: z.string().min(2, 'Game name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  players: z.object({
    min: z.number().int().min(1, 'Minimum players must be at least 1'),
    max: z.number().int().min(1, 'Maximum players must be at least 1'),
  }).refine((data) => data.max >= data.min, {
    message: 'Maximum players must be greater than or equal to minimum players',
  }),
  durationMin: z.number().int().min(1, 'Duration must be at least 1 minute'),
  energy: z.enum(['low', 'medium', 'high']),
  noise: z.enum(['low', 'medium', 'high']).optional(),
  props: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  teamMode: z.enum(['teams', 'individual', 'pairs', 'rounds-of-n']).default('individual'),
  tools: z.array(z.string()).default([]),
  roles: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        count: z.number().int().min(1),
        visible: z.boolean().optional(),
      })
    )
    .optional(),
  rounds: z.number().int().min(1).default(1),
  flow: z
    .array(
      z.object({
        step: z.string(),
        text: z.string().optional(),
        tool: z.string().optional(),
        actor: z.string().optional(),
        type: z.string().optional(),
        timerSec: z.number().optional(),
        options: z.array(z.string()).optional(),
      }).passthrough()
    )
    .optional(),
  scoring: z
    .array(
      z.object({
        when: z.any(),
        award: z.array(
          z.object({
            role: z.string().optional(),
            team: z.string().optional(),
            points: z.number(),
          })
        ),
      })
    )
    .optional(),
  rulesShort: z.string().default(''),
  rulesFull: z.string().default(''),
});

export const createGameSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  definition: gameDefinitionSchema,
  packs: z.array(z.string()).optional(),
});

export const updateGameSchema = createGameSchema.partial();

