import { Router } from 'express';
import { z } from 'zod';
import { PostModel } from '../models/Post.js';
import { OutboxEventModel } from '../models/OutboxEvent.js';
import { enqueueJob } from '../services/queue.js';
import type { CreatePostRequest } from '@insyd/types';

const createPostSchema = z.object({
  authorId: z.string(),
  content: z.string().min(1).max(1000)
});

export const postsRouter = Router();

// Create post
postsRouter.post('/', async (req, res) => {
  try {
    const data = createPostSchema.parse(req.body) as CreatePostRequest;
    
    // Create post
    const post = await PostModel.create(data);
    
    // Create outbox event
    const dedupeKey = `POST_CREATED:${data.authorId}:${post._id}:${Date.now()}`;
    const outboxEvent = await OutboxEventModel.create({
      type: 'POST_CREATED',
      payload: {
        type: 'POST_CREATED',
        actorId: data.authorId,
        entityId: post._id.toString(),
        metadata: { content: data.content }
      },
      dedupeKey,
      status: 'PENDING'
    });
    
    // Enqueue for fan-out
    await enqueueJob({
      outboxEventId: outboxEvent._id.toString(),
      attempt: 1
    });
    
    res.status(201).json({ 
      success: true, 
      data: post 
    });
    
  } catch (error) {
    console.error('Create post error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid post data',
        details: error.errors
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create post' 
      });
    }
  }
});

// Get posts (for demo UI)
postsRouter.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    
    const posts = await PostModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('authorId')
      .lean();
    
    res.json({ 
      success: true, 
      data: posts 
    });
    
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch posts' 
    });
  }
});