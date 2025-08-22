import type { Job } from 'bullmq';
import type { FanoutJobData, OutboxEvent, DomainEvent } from '@insyd/types';
import { OutboxEventModel, FollowModel, NotificationModel, UserModel } from '../models/index.js';
import { createNotification } from '../services/notifications.js';
import { emitNotificationToUsers } from '../services/socket.js';

export async function processEvent(job: Job<FanoutJobData>): Promise<void> {
  const { outboxEventId } = job.data;
  
  try {
    // Load the outbox event
    const outboxEvent = await OutboxEventModel.findById(outboxEventId);
    if (!outboxEvent) {
      throw new Error(`OutboxEvent not found: ${outboxEventId}`);
    }
    
    if (outboxEvent.status === 'PROCESSED') {
      console.log(`Event ${outboxEventId} already processed, skipping`);
      return;
    }
    
    const event = outboxEvent.payload as DomainEvent;
    console.log(`Processing event: ${event.type} by ${event.actorId}`);
    
    // Resolve recipients based on event type
    const recipients = await resolveRecipients(event);
    console.log(`Found ${recipients.length} recipients`);
    
    // Create notifications for each recipient
    const notifications = [];
    for (const userId of recipients) {
      try {
        const notification = await createNotification(outboxEvent, userId, event);
        if (notification) {
          notifications.push({ userId, notification });
        }
      } catch (error: any) {
        if (error.code === 11000) {
          // Duplicate notification - already processed
          console.log(`Notification already exists for user ${userId}`);
        } else {
          throw error;
        }
      }
    }
    
    // Emit real-time notifications
    if (notifications.length > 0) {
      await emitNotificationToUsers(notifications);
      console.log(`Emitted ${notifications.length} real-time notifications`);
    }
    
    // Mark event as processed
    await OutboxEventModel.updateOne(
      { _id: outboxEventId },
      { 
        status: 'PROCESSED', 
        processedAt: new Date() 
      }
    );
    
    console.log(`✅ Event ${outboxEventId} processed successfully`);
    
  } catch (error) {
    console.error(`❌ Failed to process event ${outboxEventId}:`, error);
    throw error; // Will trigger retry
  }
}

async function resolveRecipients(event: DomainEvent): Promise<string[]> {
  switch (event.type) {
    case 'POST_CREATED':
      // All followers of the post author
      const followers = await FollowModel
        .find({ followeeId: event.actorId })
        .select('followerId')
        .lean();
      return followers.map(f => f.followerId);
      
    case 'FOLLOWED':
      // The user being followed
      return [event.entityId];
      
    case 'LIKED':
    case 'COMMENTED':
      // The post author (if not self-action)
      // Note: In a real system, you'd fetch the post to get authorId
      // For this POC, we'll assume entityId is the post author
      return event.actorId !== event.entityId ? [event.entityId] : [];
      
    default:
      console.warn(`Unknown event type: ${event.type}`);
      return [];
  }
}