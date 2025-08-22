import type { Server } from 'socket.io';
import type { SocketEvents } from '@insyd/types';

const userRooms = new Map<string, string>(); // socketId -> userId

export function setupSocketIO(io: Server) {
  const notificationNamespace = io.of('/notifications');
  
  notificationNamespace.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    socket.on('join', (data: { userId: string }) => {
      const { userId } = data;
      
      // Leave previous room if any
      const prevUserId = userRooms.get(socket.id);
      if (prevUserId) {
        socket.leave(`user:${prevUserId}`);
      }
      
      // Join new room
      socket.join(`user:${userId}`);
      userRooms.set(socket.id, userId);
      
      console.log(`Socket ${socket.id} joined room user:${userId}`);
      
      socket.emit('joined', { userId });
    });
    
    socket.on('disconnect', () => {
      const userId = userRooms.get(socket.id);
      if (userId) {
        userRooms.delete(socket.id);
        console.log(`Socket ${socket.id} disconnected from user:${userId}`);
      }
    });
  });
  
  return notificationNamespace;
}

// Helper to emit notifications to users
export function emitNotificationToUser(io: Server, userId: string, notification: any) {
  io.of('/notifications')
    .to(`user:${userId}`)
    .emit('notification:new', { notification });
}