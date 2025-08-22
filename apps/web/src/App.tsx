import React, { useState, useEffect } from 'react';
import { UserSelector } from './components/UserSelector';
import { ActionsPanel } from './components/ActionsPanel';
import { NotificationsPanel } from './components/NotificationsPanel';
import { useSocket } from './hooks/useSocket';
import { useNotifications } from './hooks/useNotifications';
import type { User } from '@insyd/types';

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const socket = useSocket(selectedUser);
  const {
    notifications,
    isLoading,
    hasMore,
    loadMore,
    markAsRead,
    addNewNotification
  } = useNotifications(selectedUser);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleNewNotification = (data: { notification: any }) => {
      addNewNotification(data.notification);
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, selectedUser, addNewNotification]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Insyd Notifications
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Real-time notification system POC
              </p>
            </div>
            <UserSelector
              selectedUser={selectedUser}
              onUserChange={setSelectedUser}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedUser ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Select a Demo User
              </h2>
              <p className="text-slate-600">
                Choose a user from the dropdown above to start receiving notifications and testing the system.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActionsPanel selectedUser={selectedUser} />
            <NotificationsPanel
              notifications={notifications}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onMarkAsRead={markAsRead}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;