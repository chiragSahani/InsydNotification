import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationsPanel } from '../components/NotificationsPanel';
import type { Notification } from '@insyd/types';

const mockNotifications: Notification[] = [
  {
    _id: '1',
    userId: 'user1',
    type: 'NEW_FOLLOWER',
    actorId: 'user2',
    entityId: 'user2',
    entityType: 'USER',
    message: 'Alice started following you',
    isRead: false,
    dedupeKey: 'key1',
    deliveryStatus: 'EMITTED',
    createdAt: new Date().toISOString()
  }
];

describe('NotificationsPanel', () => {
  it('renders notifications list', () => {
    render(
      <NotificationsPanel
        notifications={mockNotifications}
        isLoading={false}
        hasMore={false}
        onLoadMore={() => {}}
        onMarkAsRead={() => {}}
      />
    );

    expect(screen.getByText('Alice started following you')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Unread count
  });

  it('shows empty state when no notifications', () => {
    render(
      <NotificationsPanel
        notifications={[]}
        isLoading={false}
        hasMore={false}
        onLoadMore={() => {}}
        onMarkAsRead={() => {}}
      />
    );

    expect(screen.getByText('No notifications yet')).toBeInTheDocument();
  });
});