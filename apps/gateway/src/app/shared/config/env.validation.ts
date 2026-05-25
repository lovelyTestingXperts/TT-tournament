import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.coerce.number().default(4000),

  MONGO_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(1),

  JWT_REFRESH_SECRET: z.string().min(1),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(
  config: Record<string, unknown>,
): EnvConfig {
  const parsedConfig =
    envSchema.safeParse(config);

  if (!parsedConfig.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsedConfig.error.flatten().fieldErrors,
    );

    throw new Error(
      'Environment validation failed',
    );
  }

  return parsedConfig.data;
}