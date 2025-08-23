import { z } from 'zod';

const envSchema = z.object({
  MONGO_URI: z.string(),
  REDIS_URL: z.string(),
  SOCKET_PUBLIC_URL: z.string().default('http://localhost:4000'),
  NODE_ENV: z.string().default('development')
});

export function getConfig() {
  return envSchema.parse(process.env);
}