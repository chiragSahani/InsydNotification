
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import type { User } from '@insyd/types';
import { apiClient } from '../utils/api.js';
import { ErrorHandler } from '../utils/errorHandler.js';

interface UserSelectorProps {
  selectedUser: User | null;
  onUserChange: (user: User | null) => void;
}

export function UserSelector({ selectedUser, onUserChange }: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchUsers = async (isRetry = false) => {
    if (!isRetry) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const data = await apiClient.get<User[]>('/api/users');
      setUsers(data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      const errorInfo = ErrorHandler.categorizeError(err);
      ErrorHandler.logError(err, 'UserSelector.fetchUsers');
      setError(errorInfo.userMessage);
      
      // Auto-retry for retryable errors
      if (errorInfo.retryable && retryCount < 3) {
        const delay = ErrorHandler.getRetryDelay(retryCount);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchUsers(true);
        }, delay);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    const user = users.find(u => u._id === userId) || null;
    onUserChange(user);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <UserIcon className="w-5 h-5 text-indigo-500" />
        <span className="text-sm font-medium text-slate-700 hidden sm:inline">Demo User:</span>
        <span className="text-sm font-medium text-slate-700 sm:hidden">User:</span>
      </div>
      
      <div className="relative w-full sm:w-auto min-w-[200px]">
        <motion.select
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          value={selectedUser?._id || ''}
          onChange={handleUserChange}
          className="appearance-none w-full bg-white/90 backdrop-blur-sm border-2 border-indigo-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm hover:border-indigo-300 transition-all duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          <option value="" disabled>
            {isLoading ? 'Loading users...' : 'Select a user'}
          </option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </motion.select>
        
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
      </div>
      
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-full whitespace-nowrap"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-indigo-700">
            <span className="hidden sm:inline">Connected as </span>{selectedUser.name}
          </span>
        </motion.div>
      )}
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 text-red-500 text-sm font-medium text-center sm:text-left w-full sm:w-auto"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            {retryCount < 3 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fetchUsers()}
                className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                title="Retry"
              >
                <RefreshCw className="w-3 h-3" />
              </motion.button>
            )}
          </motion.div>
        )}
        
        {isLoading && retryCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-blue-500 text-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
            <span>Retrying... ({retryCount}/3)</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
