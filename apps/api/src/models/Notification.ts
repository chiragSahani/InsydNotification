import mongoose from 'mongoose';
import type { Notification } from '@insyd/types';

const notificationSchema = new mongoose.Schema<Notification>({
  userId: { 
    type: String, 
    required: true,
    ref: 'User'
  },
  type: { 
    type: String, 
    required: true,
    enum: ['NEW_FOLLOWER', 'NEW_POST_FROM_FOLLOWING', 'NEW_LIKE_ON_YOUR_POST', 'NEW_COMMENT_ON_YOUR_POST']
  },
  actorId: { 
    type: String, 
    required: true,
    ref: 'User'
  },
  entityId: { 
    type: String, 
    required: true 
  },
  entityType: { 
    type: String, 
    required: true,
    enum: ['POST', 'USER']
  },
  message: { 
    type: String, 
    required: true,
    trim: true
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  dedupeKey: { 
    type: String, 
    required: true,
    unique: true
  },
  deliveryStatus: { 
    type: String, 
    required: true,
    enum: ['PENDING', 'EMITTED', 'FAILED'],
    default: 'PENDING'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Critical indexes for performance
notificationSchema.index({ userId: 1, createdAt: -1 }); // Feed queries
notificationSchema.index({ userId: 1, isRead: 1 }); // Unread counts

export const NotificationModel = mongoose.model<Notification>('Notification', notificationSchema);