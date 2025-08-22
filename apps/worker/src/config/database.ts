import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Worker connected to MongoDB');
  } catch (error) {
    console.error('❌ Worker MongoDB connection failed:', error);
    throw error;
  }
}