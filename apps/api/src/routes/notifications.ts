import { Router } from 'express';
import { z } from 'zod';
import { NotificationModel } from '../models/Notification.js';
import type { NotificationsResponse, GetNotificationsQuery } from '@insyd/types';

const getNotificationsSchema = z.object({
  userId: z.string(),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 20),
  cursor: z.string().optional()
});

const markReadSchema = z.object({
  id: z.string()
});

export const notificationsRouter = Router();

// Get notifications for user
notificationsRouter.get('/', async (req, res) => {
  try {
    const query = getNotificationsSchema.parse(req.query) as GetNotificationsQuery;
    const limit = Math.min(query.limit || 20, 50); // Cap at 50
    
    // Build query
    const filter: any = { userId: query.userId };
    if (query.cursor) {
      filter.createdAt = { $lt: new Date(query.cursor) };
    }
    
    // Fetch notifications
    const notifications = await NotificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1) // Fetch one extra to check if there are more
      .lean();
    
    const hasMore = notifications.length > limit;
    const results = hasMore ? notifications.slice(0, -1) : notifications;
    const nextCursor = hasMore && results.length > 0 
      ? results[results.length - 1].createdAt.toISOString() 
      : undefined;
    
    const response: NotificationsResponse = {
      notifications: results,
      nextCursor,
      hasMore
    };
    
    res.json({ success: true, data: response });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid query parameters',
        details: error.errors
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch notifications' 
      });
    }
  }
});

// Mark notification as read
notificationsRouter.patch('/:id/read', async (req, res) => {
  try {
    const { id } = markReadSchema.parse({ id: req.params.id });
    
    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      res.status(404).json({ 
        success: false, 
        error: 'Notification not found' 
      });
      return;
    }
    
    res.json({ 
      success: true, 
      data: notification 
    });
    
  } catch (error) {
    console.error('Mark read error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid notification ID',
        details: error.errors
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to mark notification as read' 
      });
    }
  }
});

// Get unread count
notificationsRouter.get('/:userId/unread-count', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await NotificationModel.countDocuments({
      userId,
      isRead: false
    });
    
    res.json({ 
      success: true, 
      data: { count } 
    });
    
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get unread count' 
    });
  }
});