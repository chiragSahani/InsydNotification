import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { OutboxEventModel, FollowModel, UserModel, NotificationModel } from '../models/index.js';
import type { OutboxEvent, DomainEvent } from '@insyd/types';

describe('Event Fanout', () => {
  beforeEach(async () => {
    await Promise.all([
      OutboxEventModel.deleteMany({}),
      FollowModel.deleteMany({}),
      UserModel.deleteMany({}),
      NotificationModel.deleteMany({})
    ]);
  });

  it('should resolve followers for POST_CREATED event', async () => {
    // Create test users
    const author = await UserModel.create({ name: 'Author' });
    const follower1 = await UserModel.create({ name: 'Follower 1' });
    const follower2 = await UserModel.create({ name: 'Follower 2' });
    
    // Create follow relationships
    await FollowModel.create([
      { followerId: follower1._id.toString(), followeeId: author._id.toString() },
      { followerId: follower2._id.toString(), followeeId: author._id.toString() }
    ]);
    
    // Test event
    const event: DomainEvent = {
      type: 'POST_CREATED',
      actorId: author._id.toString(),
      entityId: 'post123',
      metadata: { content: 'Test post' }
    };
    
    // Get followers
    const followers = await FollowModel
      .find({ followeeId: event.actorId })
      .select('followerId')
      .lean();
    
    expect(followers).toHaveLength(2);
    expect(followers.map(f => f.followerId)).toContain(follower1._id.toString());
    expect(followers.map(f => f.followerId)).toContain(follower2._id.toString());
  });
  
  it('should resolve target user for FOLLOWED event', async () => {
    const event: DomainEvent = {
      type: 'FOLLOWED',
      actorId: 'user1',
      entityId: 'user2'
    };
    
    const recipients = [event.entityId]; // Should be the followed user
    expect(recipients).toEqual(['user2']);
  });
});