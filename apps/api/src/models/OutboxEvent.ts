import mongoose from 'mongoose';
import type { OutboxEvent } from '@insyd/types';

const outboxEventSchema = new mongoose.Schema<OutboxEvent>({
  type: { 
    type: String, 
    required: true,
    enum: ['POST_CREATED', 'FOLLOWED', 'LIKED', 'COMMENTED']
  },
  payload: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['PENDING', 'PROCESSED'],
    default: 'PENDING'
  },
  dedupeKey: { 
    type: String, 
    required: true,
    unique: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  processedAt: Date
});

// Index for worker queries
outboxEventSchema.index({ status: 1, createdAt: 1 });

export const OutboxEventModel = mongoose.model<OutboxEvent>('OutboxEvent', outboxEventSchema);