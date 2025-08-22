import { Worker } from 'bullmq';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { processEvent } from './processors/fanout.js';
import { config } from './config/env.js';
import type { FanoutJobData } from '@insyd/types';

async function startWorker() {
  try {
    await connectDatabase();
    const redis = await connectRedis();
    
    const worker = new Worker<FanoutJobData>(
      'outbox:fanout',
      processEvent,
      {
        connection: redis,
        concurrency: 5, // Process 5 jobs concurrently
        removeOnComplete: 100,
        removeOnFail: 50
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