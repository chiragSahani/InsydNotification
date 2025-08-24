import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search,
  Loader,
  UserCheck,
  Activity,
  Calendar
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import type { User } from '@insyd/types';

interface UserManagementPanelProps {
  selectedUser: User;
}

interface UserStats {
  followers: number;
  following: number;
  posts: number;
}

interface UserWithStats extends User {
  stats?: UserStats;
}

export function UserManagementPanel({ selectedUser }: UserManagementPanelProps) {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const socket = useSocket(selectedUser);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
      const result = await response.json();
      
      if (result.success) {
        const usersData = result.data.items || result.data || [];
        
        // Fetch stats for each user
        const usersWithStats = await Promise.all(
          usersData.map(async (user: User) => {
            try {
              const statsResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/users/${user._id}/stats`
              );
              const statsResult = await statsResponse.json();
              
              return {
                ...user,
                stats: statsResult.success ? statsResult.data : {
                  followers: 0,
                  following: 0,
                  posts: 0
                }
              };
            } catch (error) {
              return {
                ...user,
                stats: {
                  followers: 0,
                  following: 0,
                  posts: 0
                }
              };
            }
          })
        );
        
        setUsers(usersWithStats);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch followers
  const fetchFollowers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/follow/${selectedUser._id}/followers`
      );
      const result = await response.json();
      
      if (result.success) {
        setFollowers(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    }
  };

  // Fetch following
  const fetchFollowing = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/follow/${selectedUser._id}/following`
      );
      const result = await response.json();
      
      if (result.success) {
        setFollowing(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch following:', error);
    }
  };

  // Follow a user
  const followUser = async (targetId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actorId: selectedUser._id,
          targetId
        })
      });

      if (response.ok) {
        // Refresh data
        await Promise.all([fetchFollowing(), fetchUsers()]);
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFollowers();
    fetchFollowing();
  }, [selectedUser]);

  // Real-time updates
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleUserUpdate = async () => {
      // Refresh user data when follows happen
      await Promise.all([
        fetchFollowers(),
        fetchFollowing(),
        fetchUsers()
      ]);
      setLastUpdated(new Date());
    };

    const handleNewUser = () => {
      // Refresh users list when new users join
      fetchUsers();
      setLastUpdated(new Date());
    };

    // Listen for follow events
    socket.on('follow:new', handleUserUpdate);
    socket.on('user:new', handleNewUser);
    
    // Refresh user stats periodically
    const interval = setInterval(() => {
      fetchUsers();
      setLastUpdated(new Date());
    }, 60000); // Every minute

    return () => {
      socket.off('follow:new', handleUserUpdate);
      socket.off('user:new', handleNewUser);
      clearInterval(interval);
    };
  }, [socket, selectedUser]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    user._id !== selectedUser._id
  );

  const isFollowing = (userId: string) => {
    return following.some(f => f.followeeId === userId);
  };

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
              className="p-3 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-xl"
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
              <div className="flex items-center gap-3">
                <p className="text-slate-600">Manage users, follows, and relationships</p>
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <span className="text-xs text-blue-600 font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Current User Stats */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-lg">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="p-3 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{followers.length}</p>
            <p className="text-blue-600 font-medium">Followers</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="p-3 bg-gradient-to-tr from-purple-500 to-purple-600 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{following.length}</p>
            <p className="text-purple-600 font-medium">Following</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="p-3 bg-gradient-to-tr from-green-500 to-green-600 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-green-600 font-medium">Posts</p>
          </div>
        </div>
      </motion.div>

      {/* User Directory */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">All Users</h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-slate-500">Loading users...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300 bg-white/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{user.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.stats && (
                      <div className="text-right text-xs text-slate-500 mr-3">
                        <div>{user.stats.followers} followers</div>
                        <div>{user.stats.following} following</div>
                      </div>
                    )}
                    
                    <motion.button
                      onClick={() => followUser(user._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${
                        isFollowing(user._id)
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {isFollowing(user._id) ? (
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          Following
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <UserPlus className="w-3 h-3" />
                          Follow
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No users found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search query</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}