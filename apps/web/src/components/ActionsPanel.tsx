
import React, { useState, useEffect } from 'react';
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
        const response = await fetch('http://localhost:3000/api/users');
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
      const response = await fetch('http://localhost:3000/api/posts', {
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
      const response = await fetch('http://localhost:3000/api/follow', {
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Actions Panel</h2>
      <div className="space-y-6">
        {/* Create Post Form */}
        <form onSubmit={handleCreatePost}>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Create a Post</h3>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder={`What's on your mind, ${selectedUser.name}?`}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            rows={3}
          />
          <button
            type="submit"
            disabled={isLoading || !postContent.trim()}
            className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-300"
          >
            {isLoading ? 'Posting...' : 'Create Post'}
          </button>
        </form>

        {/* Follow User Form */}
        <form onSubmit={handleFollowUser}>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Follow a User</h3>
          <select
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isLoading || !targetUser}
            className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-300"
          >
            {isLoading ? 'Following...' : 'Follow User'}
          </button>
        </form>
      </div>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
}
