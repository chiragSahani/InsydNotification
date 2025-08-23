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

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          totalNotifications: 1247,
          deliveryRate: 98.5,
          averageResponseTime: 0.23,
          activeUsers: 156,
          weeklyStats: [
            { day: 'Mon', count: 45 },
            { day: 'Tue', count: 67 },
            { day: 'Wed', count: 89 },
            { day: 'Thu', count: 34 },
            { day: 'Fri', count: 78 },
            { day: 'Sat', count: 23 },
            { day: 'Sun', count: 56 }
          ],
          notificationTypes: [
            { type: 'New Followers', count: 456, percentage: 36.5 },
            { type: 'New Posts', count: 334, percentage: 26.8 },
            { type: 'Likes', count: 289, percentage: 23.2 },
            { type: 'Comments', count: 168, percentage: 13.5 }
          ]
        });
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-xl"
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
              <p className="text-slate-600">Notification performance insights</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className={`bg-gradient-to-br ${metric.bgColor} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-tr ${metric.color} rounded-xl shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
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

        <div className="flex items-end gap-3 h-64">
          {stats.weeklyStats.map((stat, index) => (
            <div key={stat.day} className="flex-1 flex flex-col items-center">
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
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded"
                >
                  {stat.count}
                </motion.div>
              </motion.div>
              <p className="text-slate-600 text-sm mt-2 font-medium">{stat.day}</p>
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