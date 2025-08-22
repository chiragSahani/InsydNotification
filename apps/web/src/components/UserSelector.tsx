
import React, { useState, useEffect } from 'react';
import type { User } from '@insyd/types';

interface UserSelectorProps {
  selectedUser: User | null;
  onUserChange: (user: User | null) => void;
}

export function UserSelector({ selectedUser, onUserChange }: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const result = await response.json();
        setUsers(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    const user = users.find(u => u._id === userId) || null;
    onUserChange(user);
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedUser?._id || ''}
        onChange={handleUserChange}
        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        disabled={isLoading}
      >
        <option value="" disabled>
          {isLoading ? 'Loading...' : 'Select a user'}
        </option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
