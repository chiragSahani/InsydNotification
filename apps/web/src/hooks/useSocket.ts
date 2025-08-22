import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { User } from '@insyd/types';

export function useSocket(selectedUser: User | null): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!selectedUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(`${import.meta.env.VITE_SOCKET_URL}/notifications`, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO');
      newSocket.emit('join', { userId: selectedUser._id });
    });

    newSocket.on('joined', (data: { userId: string }) => {
      console.log(`Joined room for user: ${data.userId}`);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [selectedUser]);

  return socket;
}