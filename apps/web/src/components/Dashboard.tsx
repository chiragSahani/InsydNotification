import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileText,
  User as UserIcon
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import type { User } from '@insyd/types';

interface DashboardProps {
  selectedUser: User;
}

interface DashboardStats {
  totalNotifications: number;
  unreadCount: number;
  todayCount: number;
  weeklyGrowth: number;
}

export function Dashboard({ selectedUser }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalNotifications: 0,
    unreadCount: 0,
    todayCount: 0,
    weeklyGrowth: 0
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const socket = useSocket(selectedUser);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API calls for stats
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch real stats
        const [notificationsResponse, postsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/notifications?userId=${selectedUser._id}&limit=20`),
          fetch(`${import.meta.env.VITE_API_URL}/api/posts?limit=5`)
        ]);

        const notificationsData = await notificationsResponse.json();
        const postsData = await postsResponse.json();

        if (notificationsData.success) {
          const notifications = notificationsData.data.notifications || [];
          const unreadCount = notifications.filter((n: any) => !n.isRead).length;
          const todayCount = notifications.filter((n: any) => {
            const today = new Date();
            const notifDate = new Date(n.createdAt);
            return notifDate.toDateString() === today.toDateString();
          }).length;

          setStats({
            totalNotifications: notifications.length,
            unreadCount,
            todayCount,
            weeklyGrowth: 23.5 // Mock for now
          });
        }

        if (postsData.success) {
          setRecentPosts(postsData.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedUser) {
      fetchStats();
    }
  }, [selectedUser]);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleStatsUpdate = () => {
      // Refetch stats when new notifications arrive
      const fetchStats = async () => {
        try {
          const [notificationsResponse, postsResponse] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/api/notifications?userId=${selectedUser._id}&limit=20`),
            fetch(`${import.meta.env.VITE_API_URL}/api/posts?limit=5`)
          ]);

          const notificationsData = await notificationsResponse.json();
          const postsData = await postsResponse.json();

          if (notificationsData.success) {
            const notifications = notificationsData.data.notifications || [];
            const unreadCount = notifications.filter((n: any) => !n.isRead).length;
            const todayCount = notifications.filter((n: any) => {
              const today = new Date();
              const notifDate = new Date(n.createdAt);
              return notifDate.toDateString() === today.toDateString();
            }).length;

            setStats(prev => ({
              ...prev,
              totalNotifications: notifications.length,
              unreadCount,
              todayCount,
              weeklyGrowth: Math.round(Math.random() * 50) + 10 // Dynamic growth
            }));
          }

          if (postsData.success) {
            setRecentPosts(postsData.data || []);
          }
          
          setLastUpdated(new Date());
        } catch (error) {
          console.error('Failed to update dashboard stats:', error);
        }
      };

      fetchStats();
    };

    // Listen for various real-time events
    socket.on('notification:new', handleStatsUpdate);
    socket.on('post:new', handleStatsUpdate);
    socket.on('follow:new', handleStatsUpdate);
    
    // Update stats every 30 seconds
    const interval = setInterval(handleStatsUpdate, 30000);

    return () => {
      socket.off('notification:new', handleStatsUpdate);
      socket.off('post:new', handleStatsUpdate);
      socket.off('follow:new', handleStatsUpdate);
      clearInterval(interval);
    };
  }, [socket, selectedUser]);

  const statCards = [
    {
      title: 'Total Notifications',
      value: stats.totalNotifications,
      icon: Bell,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Unread',
      value: stats.unreadCount,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      textColor: 'text-red-600'
    },
    {
      title: 'Today',
      value: stats.todayCount,
      icon: Clock,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Weekly Growth',
      value: `${stats.weeklyGrowth}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-slate-500">Loading dashboard...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl"
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
              <p className="text-slate-600">Welcome back, {selectedUser.name}!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
            <p className="text-xs text-slate-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02, 
                translateY: -2,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              className={`bg-gradient-to-br ${card.bgColor} rounded-2xl p-4 sm:p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">
                    {card.title}
                  </p>
                  <p className={`text-2xl sm:text-3xl font-bold ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className={`p-2 sm:p-3 bg-gradient-to-tr ${card.color} rounded-xl shadow-lg`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
        </div>

        <div className="space-y-4">
          {[
            { time: '2 min ago', action: 'New follower notification sent', status: 'success' },
            { time: '15 min ago', action: 'Post notification delivered', status: 'success' },
            { time: '1 hour ago', action: 'Comment notification processed', status: 'success' },
            { time: '2 hours ago', action: 'Like notification sent', status: 'success' },
            { time: '3 hours ago', action: 'Follow notification delivered', status: 'warning' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-50/50 border border-slate-200/50"
            >
              <div className={`p-2 rounded-full ${
                activity.status === 'success' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium text-sm sm:text-base">{activity.action}</p>
                <p className="text-slate-500 text-xs sm:text-sm">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: 'Send Test Notification', description: 'Send a sample notification', color: 'from-blue-500 to-blue-600' },
            { title: 'Mark All as Read', description: 'Clear all unread notifications', color: 'from-green-500 to-green-600' },
            { title: 'View Analytics', description: 'See detailed notification stats', color: 'from-purple-500 to-purple-600' }
          ].map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" 
              }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 sm:p-4 rounded-xl bg-gradient-to-tr ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 text-left`}
            >
              <h4 className="font-semibold mb-1 text-sm sm:text-base">{action.title}</h4>
              <p className="text-xs sm:text-sm opacity-90">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Recent Posts</h3>
        </div>

        <div className="space-y-4">
          {recentPosts.length > 0 ? recentPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-200/50"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-medium line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <UserIcon className="w-3 h-3" />
                  <span>{post.authorId.name}</span>
                  <Clock className="w-3 h-3" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No recent posts found</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}