import { Redis } from 'ioredis';
import { config } from './env.js';

export async function connectRedis() {
  try {
    const redis = new Redis(config.REDIS_URL, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });
    
    await redis.connect();
    console.log('✅ Worker connected to Redis');
    
    return redis;
  } catch (error) {
    console.error('❌ Worker Redis connection failed:', error);
    throw error;
  }
}