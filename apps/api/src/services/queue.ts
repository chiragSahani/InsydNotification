import { Queue } from 'bullmq';
import { redis } from '../config/redis.js';
import type { FanoutJobData } from '@insyd/types';

export const fanoutQueue = new Queue<FanoutJobData>('outbox:fanout', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

export async function enqueueJob(data: FanoutJobData): Promise<void> {
  await fanoutQueue.add('process-event', data, {
    jobId: `${data.outboxEventId}-${data.attempt}`, // Prevent duplicate jobs
    delay: 0
  });
}