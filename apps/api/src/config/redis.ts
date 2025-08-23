import { Redis } from 'ioredis';
import { getConfig } from './env.js';

export let redis: Redis;

export async function connectRedis() {
  try {
    const config = getConfig();
    redis = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });
    
    await redis.connect();
    console.log('✅ Connected to Redis');
    
    return redis;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (redis) {
    await redis.quit();
    console.log('📴 Redis connection closed');
  }
});