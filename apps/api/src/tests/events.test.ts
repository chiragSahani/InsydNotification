import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { OutboxEventModel } from '../models/OutboxEvent.js';

describe('Event Ingestion', () => {
  beforeEach(async () => {
    await OutboxEventModel.deleteMany({});
  });

  it('should create outbox event with unique dedupeKey', async () => {
    const eventData = {
      type: 'POST_CREATED',
      payload: {
        type: 'POST_CREATED',
        actorId: 'user1',
        entityId: 'post1',
        metadata: { content: 'Test post' }
      },
      dedupeKey: 'POST_CREATED:user1:post1:123456'
    };

    const event = await OutboxEventModel.create(eventData);
    expect(event._id).toBeDefined();
    expect(event.status).toBe('PENDING');
  });

  it('should reject duplicate dedupeKey', async () => {
    const eventData = {
      type: 'POST_CREATED',
      payload: { actorId: 'user1', entityId: 'post1' },
      dedupeKey: 'duplicate-key'
    };

    await OutboxEventModel.create(eventData);

    await expect(
      OutboxEventModel.create(eventData)
    ).rejects.toThrow();
  });
});