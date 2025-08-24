import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Calendar,
  Activity,
  Zap
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import type { User } from '@insyd/types';

interface StatisticsPanelProps {
  selectedUser: User;
}

interface StatisticsData {
  totalNotifications: number;
  deliveryRate: number;
  averageResponseTime: number;
  activeUsers: number;
  weeklyStats: Array<{ day: string; count: number }>;
  notificationTypes: Array<{ type: string; count: number; percentage: number }>;
}

export function StatisticsPanel({ selectedUser }: StatisticsPanelProps) {
  const [stats, setStats] = useState<StatisticsData>({
    totalNotifications: 0,
    deliveryRate: 0,
    averageResponseTime: 0,
    activeUsers: 0,
    weeklyStats: [],
    notificationTypes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const socket = useSocket(selectedUser);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate dynamic mock data based on time
        const baseCount = 1247;
        const variance = Math.floor(Math.random() * 100) - 50;
        const newTotal = baseCount + variance;
        
        setStats({
          totalNotifications: newTotal,
          deliveryRate: 98.5 + (Math.random() * 2 - 1),
          averageResponseTime: 0.23 + (Math.random() * 0.1 - 0.05),
          activeUsers: 156 + Math.floor(Math.random() * 20 - 10),
          weeklyStats: [
            { day: 'Mon', count: 45 + Math.floor(Math.random() * 20) },
            { day: 'Tue', count: 67 + Math.floor(Math.random() * 20) },
            { day: 'Wed', count: 89 + Math.floor(Math.random() * 20) },
            { day: 'Thu', count: 34 + Math.floor(Math.random() * 20) },
            { day: 'Fri', count: 78 + Math.floor(Math.random() * 20) },
            { day: 'Sat', count: 23 + Math.floor(Math.random() * 20) },
            { day: 'Sun', count: 56 + Math.floor(Math.random() * 20) }
          ],
          notificationTypes: [
            { type: 'New Followers', count: Math.floor(newTotal * 0.365), percentage: 36.5 + (Math.random() * 4 - 2) },
            { type: 'New Posts', count: Math.floor(newTotal * 0.268), percentage: 26.8 + (Math.random() * 4 - 2) },
            { type: 'Likes', count: Math.floor(newTotal * 0.232), percentage: 23.2 + (Math.random() * 4 - 2) },
            { type: 'Comments', count: Math.floor(newTotal * 0.135), percentage: 13.5 + (Math.random() * 4 - 2) }
          ]
        });
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedUser) {
      fetchStatistics();
    }
  }, [selectedUser, timeRange]);

  // Real-time updates
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleStatsUpdate = () => {
      // Update stats in real-time when events happen
      setStats(prevStats => {
        const variance = Math.floor(Math.random() * 10) - 5;
        return {
          ...prevStats,
          totalNotifications: prevStats.totalNotifications + Math.abs(variance),
          deliveryRate: Math.min(99.9, Math.max(95, prevStats.deliveryRate + (Math.random() * 0.2 - 0.1))),
          averageResponseTime: Math.max(0.1, prevStats.averageResponseTime + (Math.random() * 0.02 - 0.01)),
          activeUsers: Math.max(100, prevStats.activeUsers + Math.floor(Math.random() * 4 - 2))
        };
      });
      setLastUpdated(new Date());
    };

    // Listen for real-time events
    socket.on('notification:new', handleStatsUpdate);
    socket.on('post:new', handleStatsUpdate);
    socket.on('follow:new', handleStatsUpdate);
    
    // Auto-refresh every 45 seconds
    const interval = setInterval(() => {
      handleStatsUpdate();
    }, 45000);

    return () => {
      socket.off('notification:new', handleStatsUpdate);
      socket.off('post:new', handleStatsUpdate);
      socket.off('follow:new', handleStatsUpdate);
      clearInterval(interval);
    };
  }, [socket, selectedUser]);

  const maxCount = Math.max(...stats.weeklyStats.map(stat => stat.count));

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
          <span className="ml-3 text-slate-500">Loading statistics...</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-2 sm:p-3 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-xl flex-shrink-0"
            >
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Analytics</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <p className="text-slate-600 text-sm sm:text-base">Notification performance insights</p>
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                  <span className="text-xs text-purple-600 font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex flex-wrap gap-2">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            title: 'Total Notifications',
            value: stats.totalNotifications.toLocaleString(),
            icon: Zap,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'from-blue-50 to-blue-100'
          },
          {
            title: 'Delivery Rate',
            value: `${stats.deliveryRate}%`,
            icon: Target,
            color: 'from-green-500 to-green-600',
            bgColor: 'from-green-50 to-green-100'
          },
          {
            title: 'Avg Response Time',
            value: `${stats.averageResponseTime}s`,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'from-orange-50 to-orange-100'
          },
          {
            title: 'Active Users',
            value: stats.activeUsers.toString(),
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'from-purple-50 to-purple-100'
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, translateY: -2 }}
              className={`bg-gradient-to-br ${metric.bgColor} rounded-2xl p-4 sm:p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 sm:p-3 bg-gradient-to-tr ${metric.color} rounded-xl shadow-lg`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">{metric.title}</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Weekly Activity</h3>
        </div>

        <div className="flex items-end gap-2 sm:gap-3 h-48 sm:h-64 overflow-x-auto">
          {stats.weeklyStats.map((stat, index) => (
            <div key={stat.day} className="flex-1 min-w-[40px] flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(stat.count / maxCount) * 200}px` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg relative"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-1 sm:px-2 py-1 rounded whitespace-nowrap"
                >
                  {stat.count}
                </motion.div>
              </motion.div>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 font-medium">{stat.day}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Types */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Notification Types</h3>
        </div>

        <div className="space-y-4">
          {stats.notificationTypes.map((type, index) => (
            <motion.div
              key={type.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-700 font-medium">{type.type}</span>
                  <span className="text-slate-500 text-sm">{type.count} ({type.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${type.percentage}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}