import { Router } from 'express';
import { z } from 'zod';
import { FollowModel } from '../models/Follow.js';
import { OutboxEventModel } from '../models/OutboxEvent.js';
import { enqueueJob } from '../services/queue.js';
import type { CreateFollowRequest } from '@insyd/types';

const createFollowSchema = z.object({
  actorId: z.string(),
  targetId: z.string()
}).refine(data => data.actorId !== data.targetId, {
  message: "Cannot follow yourself"
});

export const followsRouter = Router();

// Create follow relationship
followsRouter.post('/', async (req, res) => {
  try {
    const data = createFollowSchema.parse(req.body) as CreateFollowRequest;
    
    // Check if already following
    const existingFollow = await FollowModel.findOne({
      followerId: data.actorId,
      followeeId: data.targetId
    });
    
    if (existingFollow) {
      res.status(200).json({ 
        success: true, 
        message: 'Already following',
        data: existingFollow 
      });
      return;
    }
    
    // Create follow
    const follow = await FollowModel.create({
      followerId: data.actorId,
      followeeId: data.targetId
    });
    
    // Create outbox event
    const dedupeKey = `FOLLOWED:${data.actorId}:${data.targetId}:${Date.now()}`;
    const outboxEvent = await OutboxEventModel.create({
      type: 'FOLLOWED',
      payload: {
        type: 'FOLLOWED',
        actorId: data.actorId,
        entityId: data.targetId,
        metadata: {}
      },
      dedupeKey,
      status: 'PENDING'
    });
    
    // Enqueue for processing
    await enqueueJob({
      outboxEventId: outboxEvent._id.toString(),
      attempt: 1
    });
    
    res.status(201).json({ 
      success: true, 
      data: follow 
    });
    
  } catch (error) {
    console.error('Create follow error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid follow data',
        details: error.errors
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create follow' 
      });
    }
  }
});

// Get followers for a user
followsRouter.get('/:userId/followers', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const followers = await FollowModel
      .find({ followeeId: userId })
      .select('followerId createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ 
      success: true, 
      data: followers 
    });
    
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch followers' 
    });
  }
});

// Get following for a user
followsRouter.get('/:userId/following', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const following = await FollowModel
      .find({ followerId: userId })
      .select('followeeId createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ 
      success: true, 
      data: following 
    });
    
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch following' 
    });
  }
});