import { useState, useCallback, useEffect } from 'react';
import type { User, Notification, NotificationsResponse } from '@insyd/types';

export function useNotifications(selectedUser: User | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();

  // Reset notifications when user changes
  useEffect(() => {
    if (selectedUser) {
      setNotifications([]);
      setHasMore(true);
      setNextCursor(undefined);
      loadInitialNotifications();
    } else {
      setNotifications([]);
      setHasMore(false);
      setNextCursor(undefined);
    }
  }, [selectedUser]);

  const loadInitialNotifications = useCallback(async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/notifications`);
      url.searchParams.set('userId', selectedUser._id);
      url.searchParams.set('limit', '20');

      const response = await fetch(url.toString());
      const result = await response.json();

      if (result.success) {
        const data: NotificationsResponse = result.data;
        setNotifications(data.notifications);
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser]);

  const loadMore = useCallback(async () => {
    if (!selectedUser || !hasMore || isLoading || !nextCursor) return;

    setIsLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/notifications`);
      url.searchParams.set('userId', selectedUser._id);
      url.searchParams.set('limit', '20');
      url.searchParams.set('cursor', nextCursor);

      const response = await fetch(url.toString());
      const result = await response.json();

      if (result.success) {
        const data: NotificationsResponse = result.data;
        setNotifications(prev => [...prev, ...data.notifications]);
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
      }
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser, hasMore, isLoading, nextCursor]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`,
        { method: 'PATCH' }
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const addNewNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  return {
    notifications,
    isLoading,
    hasMore,
    loadMore,
    markAsRead,
    addNewNotification
  };
}