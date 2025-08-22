// Re-export models from API package for worker use
import mongoose from 'mongoose';
import type { User, Follow, Post, OutboxEvent, Notification } from '@insyd/types';

// User Schema
const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Follow Schema  
const followSchema = new mongoose.Schema<Follow>({
  followerId: { type: String, required: true },
  followeeId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
followSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });

// Post Schema
const postSchema = new mongoose.Schema<Post>({
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// OutboxEvent Schema
const outboxEventSchema = new mongoose.Schema<OutboxEvent>({
  type: { 
    type: String, 
    required: true,
    enum: ['POST_CREATED', 'FOLLOWED', 'LIKED', 'COMMENTED']
  },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['PENDING', 'PROCESSED'],
    default: 'PENDING'
  },
  dedupeKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  processedAt: Date
});

// Notification Schema
const notificationSchema = new mongoose.Schema<Notification>({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['NEW_FOLLOWER', 'NEW_POST_FROM_FOLLOWING', 'NEW_LIKE_ON_YOUR_POST', 'NEW_COMMENT_ON_YOUR_POST']
  },
  actorId: { type: String, required: true },
  entityId: { type: String, required: true },
  entityType: { 
    type: String, 
    required: true,
    enum: ['POST', 'USER']
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  dedupeKey: { type: String, required: true, unique: true },
  deliveryStatus: { 
    type: String, 
    required: true,
    enum: ['PENDING', 'EMITTED', 'FAILED'],
    default: 'PENDING'
  },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export const UserModel = mongoose.model<User>('User', userSchema);
export const FollowModel = mongoose.model<Follow>('Follow', followSchema);
export const PostModel = mongoose.model<Post>('Post', postSchema);
export const OutboxEventModel = mongoose.model<OutboxEvent>('OutboxEvent', outboxEventSchema);
export const NotificationModel = mongoose.model<Notification>('Notification', notificationSchema);