
import React from 'react';
import type { Notification } from '@insyd/types';

interface NotificationsPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMarkAsRead: (notificationId: string) => void;
}

export function NotificationsPanel({ 
  notifications, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  onMarkAsRead 
}: NotificationsPanelProps) {

  const getNotificationMessage = (notification: Notification) => {
    const actorName = notification.actor?.name || 'Someone';
    switch (notification.type) {
      case 'POST_CREATED':
        return `${actorName} created a new post`;
      case 'FOLLOWED':
        return `${actorName} started following you`;
      default:
        return 'New notification';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Notifications</h2>
      <div className="space-y-4">
        {notifications.map(notification => (
          <div 
            key={notification._id} 
            className={`p-4 rounded-lg flex items-center justify-between ${notification.isRead ? 'bg-slate-50' : 'bg-primary-50'}`}>
            <div>
              <p className={`text-sm ${notification.isRead ? 'text-slate-600' : 'text-primary-800'}`}>
                {getNotificationMessage(notification)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            {!notification.isRead && (
              <button 
                onClick={() => onMarkAsRead(notification._id)}
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}

        {isLoading && <p className="text-center text-slate-500">Loading...</p>}

        {!isLoading && notifications.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">You have no notifications yet.</p>
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="text-center mt-4">
            <button 
              onClick={onLoadMore}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
