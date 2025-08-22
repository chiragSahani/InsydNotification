import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4000'),
  MONGO_URI: z.string(),
  REDIS_URL: z.string(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  SOCKET_PUBLIC_URL: z.string().default('http://localhost:4000'),
  NODE_ENV: z.string().default('development')
});

export const config = envSchema.parse(process.env);