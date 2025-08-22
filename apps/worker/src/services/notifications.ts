import type { OutboxEvent, DomainEvent, Notification, NotificationType } from '@insyd/types';
import { NotificationModel, UserModel } from '../models/index.js';

export async function createNotification(
  outboxEvent: OutboxEvent,
  userId: string,
  event: DomainEvent
): Promise<Notification | null> {
  
  // Skip self-notifications
  if (event.actorId === userId) {
    return null;
  }
  
  // Get actor name for message
  const actor = await UserModel.findById(event.actorId).select('name').lean();
  if (!actor) {
    throw new Error(`Actor not found: ${event.actorId}`);
  }
  
  // Determine notification type and message
  const { type, entityType, message } = getNotificationDetails(event, actor.name);
  
  // Create dedupe key
  const dedupeKey = `${outboxEvent._id}:${userId}`;
  
  const notificationData = {
    userId,
    type,
    actorId: event.actorId,
    entityId: event.entityId,
    entityType,
    message,
    isRead: false,
    dedupeKey,
    deliveryStatus: 'PENDING' as const,
    createdAt: new Date()
  };
  
  const notification = await NotificationModel.create(notificationData);
  return notification.toObject();
}

function getNotificationDetails(event: DomainEvent, actorName: string): {
  type: NotificationType;
  entityType: 'POST' | 'USER';
  message: string;
} {
  switch (event.type) {
    case 'POST_CREATED':
      return {
        type: 'NEW_POST_FROM_FOLLOWING',
        entityType: 'POST',
        message: `${actorName} created a new post`
      };
      
    case 'FOLLOWED':
      return {
        type: 'NEW_FOLLOWER',
        entityType: 'USER',
        message: `${actorName} started following you`
      };
      
    case 'LIKED':
      return {
        type: 'NEW_LIKE_ON_YOUR_POST',
        entityType: 'POST',
        message: `${actorName} liked your post`
      };
      
    case 'COMMENTED':
      return {
        type: 'NEW_COMMENT_ON_YOUR_POST',
        entityType: 'POST',
        message: `${actorName} commented on your post`
      };
      
    default:
      throw new Error(`Unknown event type: ${event.type}`);
  }
}