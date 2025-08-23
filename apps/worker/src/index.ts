import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '../.env');
console.log('Worker - Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Worker - Error loading .env:', result.error);
} else {
  console.log('Worker - Successfully loaded .env file');
  console.log('Worker - MONGO_URI present:', !!process.env.MONGO_URI);
  console.log('Worker - REDIS_URL present:', !!process.env.REDIS_URL);
}

import { Worker } from 'bullmq';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { processEvent } from './processors/fanout.js';
import { getConfig } from './config/env.js';
import type { FanoutJobData } from '@insyd/types';

async function startWorker() {
  try {
    const config = getConfig();
    await connectDatabase();
    const redis = await connectRedis();
    
    const worker = new Worker<FanoutJobData>(
      'outbox:fanout',
      processEvent,
      {
        connection: redis,
        concurrency: 5, // Process 5 jobs concurrently
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 }
      }
    );
    
    worker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed`);
    });
    
    worker.on('failed', (job, error) => {
      console.error(`❌ Job ${job?.id} failed:`, error);
    });
    
    worker.on('stalled', (jobId) => {
      console.warn(`⚠️ Job ${jobId} stalled`);
    });
    
    console.log('🔄 Worker started, waiting for jobs...');
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('Shutting down worker gracefully...');
      await worker.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
}

startWorker();