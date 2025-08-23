import mongoose from 'mongoose';
import { getConfig } from './env.js';

export async function connectDatabase() {
  try {
    const config = getConfig();
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Worker connected to MongoDB');
  } catch (error) {
    console.error('❌ Worker MongoDB connection failed:', error);
    throw error;
  }
}