// Domain Models
export interface User {
  _id: string;
  name: string;
  createdAt: Date;
}

export interface Follow {
  _id: string;
  followerId: string;
  followeeId: string;
  createdAt: Date;
}

export interface Post {
  _id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

// Event System
export type EventType = 'POST_CREATED' | 'FOLLOWED' | 'LIKED' | 'COMMENTED';

export interface DomainEvent {
  type: EventType;
  actorId: string;
  entityId: string;
  metadata?: Record<string, any>;
}

export interface OutboxEvent {
  _id: string;
  type: EventType;
  payload: Record<string, any>;
  status: 'PENDING' | 'PROCESSED';
  dedupeKey: string;
  createdAt: Date;
  processedAt?: Date;
}

// Notifications
export type NotificationType = 
  | 'NEW_FOLLOWER'
  | 'NEW_POST_FROM_FOLLOWING'
  | 'NEW_LIKE_ON_YOUR_POST'
  | 'NEW_COMMENT_ON_YOUR_POST';

export type EntityType = 'POST' | 'USER';

export type DeliveryStatus = 'PENDING' | 'EMITTED' | 'FAILED';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  actorId: string;
  entityId: string;
  entityType: EntityType;
  message: string;
  isRead: boolean;
  dedupeKey: string;
  deliveryStatus: DeliveryStatus;
  createdAt: Date;
}

// API Request/Response Types
export interface CreatePostRequest {
  authorId: string;
  content: string;
}

export interface CreateFollowRequest {
  actorId: string;
  targetId: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface GetNotificationsQuery {
  userId: string;
  limit?: number;
  cursor?: string;
}

// Socket.IO Events
export interface SocketEvents {
  join: (data: { userId: string }) => void;
  'notification:new': (data: { notification: Notification }) => void;
}

// Worker Job Data
export interface FanoutJobData {
  outboxEventId: string;
  attempt: number;
}

// Utility Types
export interface PaginationOptions {
  limit?: number;
  cursor?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}