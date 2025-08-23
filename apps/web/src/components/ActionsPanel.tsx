
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, UserPlus, MessageCircle, Users, AlertCircle } from 'lucide-react';
import type { User } from '@insyd/types';

interface ActionsPanelProps {
  selectedUser: User;
}

export function ActionsPanel({ selectedUser }: ActionsPanelProps) {
  const [postContent, setPostContent] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [targetUser, setTargetUser] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/users');
        const result = await response.json();
        setUsers(result.data.filter((u: User) => u._id !== selectedUser._id));
        if (users.length > 0) {
          setTargetUser(users[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch users for actions panel', err);
      }
    };

    fetchUsers();
  }, [selectedUser]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: selectedUser._id, content: postContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      setPostContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: selectedUser._id, targetId: targetUser }),
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="p-2 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-lg"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </motion.div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Actions Panel</h2>
      </div>
      
      <div className="space-y-6 sm:space-y-8">
        {/* Create Post Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">Create a Post</h3>
            </div>
            
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`What's on your mind, ${selectedUser.name}?`}
              className="block w-full px-4 py-3 bg-white/70 border-2 border-indigo-200 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={4}
            />
            
            <motion.button
              type="submit"
              disabled={isLoading || !postContent.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Create Post
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Follow User Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <form onSubmit={handleFollowUser} className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-5 h-5 text-purple-500" />
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">Follow a User</h3>
            </div>
            
            <motion.select
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="block w-full px-4 py-3 bg-white/70 border-2 border-purple-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </motion.select>
            
            <motion.button
              type="submit"
              disabled={isLoading || !targetUser}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Following...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Follow User
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-6 p-3 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
