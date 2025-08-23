import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4000'),
  MONGO_URI: z.string(),
  REDIS_URL: z.string(),
  CORS_ORIGIN: z.string().default('*'), // Allow all origins in development
  SOCKET_PUBLIC_URL: z.string().default('http://localhost:4000'),
  NODE_ENV: z.string().default('development'),
  JWT_SECRET: z.string().default('dev-secret-key-change-in-production'),
  API_RATE_LIMIT: z.string().default('100'),
  LOG_LEVEL: z.string().default('info')
});

export type Config = z.infer<typeof envSchema>;

export function getConfig(): Config {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment configuration:', error);
    throw new Error('Environment configuration validation failed');
  }
}