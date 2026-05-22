import { z } from 'zod';

export const createTournamentSchema =
  z.object({
    name: z
      .string()
      .min(
        3,
        'Tournament name required'
      ),

    description:
      z.string().min(
        10,
        'Description required'
      ),

    category:
      z.string().min(1),

    type: z.enum([
      'online',
      'offline',
    ]),

    format: z.enum([
      'single_elimination',
      'double_elimination',
      'round_robin',
    ]),

    status: z.enum([
      'draft',
      'active',
      'upcoming',
    ]),

    maxPlayers: z.coerce
      .number()
      .min(2),

    startDate:
      z.string(),

    endDate:
      z.string(),
  });

export type CreateTournamentForm =
  z.infer<
    typeof createTournamentSchema
  >;