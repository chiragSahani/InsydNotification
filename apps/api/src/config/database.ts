import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create essential indexes for performance
    await createIndexes();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

async function createIndexes() {
  try {
    const db = mongoose.connection.db;
    
    // Follow collection indexes
    await db.collection('follows').createIndex(
      { followerId: 1, followeeId: 1 }, 
      { unique: true, name: 'unique_follow' }
    );
    
    // OutboxEvent collection indexes
    await db.collection('outboxevents').createIndex(
      { dedupeKey: 1 }, 
      { unique: true, name: 'unique_dedupe' }
    );
    await db.collection('outboxevents').createIndex(
      { status: 1, createdAt: 1 },
      { name: 'status_created_idx' }
    );
    
    // Notification collection indexes
    await db.collection('notifications').createIndex(
      { dedupeKey: 1 }, 
      { unique: true, name: 'unique_notification_dedupe' }
    );
    await db.collection('notifications').createIndex(
      { userId: 1, createdAt: -1 },
      { name: 'user_timeline_idx' }
    );
    await db.collection('notifications').createIndex(
      { userId: 1, isRead: 1 },
      { name: 'user_read_status_idx' }
    );
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.warn('⚠️ Index creation warning:', error.message);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📴 MongoDB connection closed');
  process.exit(0);
});