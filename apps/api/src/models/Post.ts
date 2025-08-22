import mongoose from 'mongoose';
import type { Post } from '@insyd/types';

const postSchema = new mongoose.Schema<Post>({
  authorId: { 
    type: String, 
    required: true,
    ref: 'User'
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for author's posts
postSchema.index({ authorId: 1, createdAt: -1 });

export const PostModel = mongoose.model<Post>('Post', postSchema);