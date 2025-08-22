import mongoose from 'mongoose';
import type { User } from '@insyd/types';

const userSchema = new mongoose.Schema<User>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const UserModel = mongoose.model<User>('User', userSchema);