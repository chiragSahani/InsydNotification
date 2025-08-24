import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import type { Notification } from '@insyd/types';

interface NotificationsPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onRefresh?: () => void;
}

export function NotificationsPanel({ 
  notifications, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  onMarkAsRead,
  onRefresh
}: NotificationsPanelProps) {

  const getNotificationMessage = (notification: Notification) => {
    return notification.message;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
    >
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg"
          >
            <Bell className="w-5 h-5 text-white" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Notifications</h2>
          {notifications.filter(n => !n.isRead).length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
            >
              {notifications.filter(n => !n.isRead).length}
            </motion.span>
          )}
        </div>
        
        {onRefresh && (
          <motion.button
            onClick={onRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Refresh notifications"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        )}
      </div>
      
      <div className="space-y-3 max-h-[70vh] sm:max-h-96 overflow-y-auto overscroll-contain">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                translateY: -2
              }}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                notification.isRead 
                  ? 'bg-slate-50/50 border-slate-200' 
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="mt-0.5 flex-shrink-0">
                      {!notification.isRead ? (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-indigo-500 rounded-full"
                        />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className={`text-sm font-medium leading-relaxed ${
                      notification.isRead ? 'text-slate-600' : 'text-indigo-900'
                    }`}>
                      {getNotificationMessage(notification)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 ml-4">
                    <Clock className="w-3 h-3" />
                    <span className="break-all">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {!notification.isRead && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onMarkAsRead(notification._id)}
                    className="self-start sm:self-center px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-white/50 hover:bg-white/80 rounded-lg border border-indigo-200 transition-all duration-200 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Mark as read</span>
                    <span className="sm:hidden">Read</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"
            />
            <span className="ml-3 text-slate-500">Loading more notifications...</span>
          </motion.div>
        )}

        {!isLoading && notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <Bell className="w-8 h-8 text-slate-400" />
            </motion.div>
            <p className="text-slate-500 font-medium">No notifications yet</p>
            <p className="text-slate-400 text-sm mt-1">We'll notify you when something happens!</p>
          </motion.div>
        )}

        {hasMore && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoadMore}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300"
            >
              Load More Notifications
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
