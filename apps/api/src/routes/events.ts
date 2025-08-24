import { Router } from 'express';
import { z } from 'zod';
import { OutboxEventModel } from '../models/OutboxEvent.js';
import { enqueueJob } from '../services/queue.js';
import type { DomainEvent } from '@insyd/types';

const eventSchema = z.object({
  type: z.enum(['POST_CREATED', 'FOLLOWED', 'LIKED', 'COMMENTED']),
  actorId: z.string(),
  entityId: z.string(),
  metadata: z.record(z.any()).optional()
});

export const eventsRouter: Router = Router();

// Event ingestion endpoint
eventsRouter.post('/', async (req, res) => {
  try {
    const event = eventSchema.parse(req.body) as DomainEvent;
    
    // Create dedupe key
    const timestamp = Date.now();
    const dedupeKey = `${event.type}:${event.actorId}:${event.entityId}:${timestamp}`;
    
    // Store in outbox (idempotent)
    try {
      const outboxEvent = await OutboxEventModel.create({
        type: event.type,
        payload: event,
        dedupeKey,
        status: 'PENDING'
      });
      
      // Enqueue for processing
      await enqueueJob({
        outboxEventId: outboxEvent._id.toString(),
        attempt: 1
      });
      
      res.status(202).json({ 
        success: true, 
        eventId: outboxEvent._id,
        message: 'Event queued for processing' 
      });
      
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key - idempotent response
        res.status(200).json({ 
          success: true, 
          message: 'Event already processed' 
        });
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('Event ingestion error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid event data',
        details: error.errors
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process event' 
      });
    }
  }
});