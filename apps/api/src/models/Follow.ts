import mongoose from 'mongoose';
import type { Follow } from '@insyd/types';

const followSchema = new mongoose.Schema<Follow>({
  followerId: { 
    type: String, 
    required: true,
    ref: 'User'
  },
  followeeId: { 
    type: String, 
    required: true,
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Prevent duplicate follows
followSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });

export const FollowModel = mongoose.model<Follow>('Follow', followSchema);