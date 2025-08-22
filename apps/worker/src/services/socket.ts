import { io as ioClient, Socket } from 'socket.io-client';
import { config } from '../config/env.js';
import type { Notification } from '@insyd/types';

let socket: Socket | null = null;

async function getSocket(): Promise<Socket> {
  if (!socket || !socket.connected) {
    socket = ioClient(`${config.SOCKET_PUBLIC_URL}/notifications`, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    await new Promise<void>((resolve, reject) => {
      socket!.on('connect', () => {
        console.log('✅ Worker connected to Socket.IO server');
        resolve();
      });
      
      socket!.on('connect_error', (error) => {
        console.error('❌ Worker Socket.IO connection error:', error);
        reject(error);
      });
      
      // Set timeout for connection
      setTimeout(() => reject(new Error('Socket.IO connection timeout')), 5000);
    });
  }
  
  return socket;
}

export async function emitNotificationToUsers(
  notifications: Array<{ userId: string; notification: Notification }>
): Promise<void> {
  try {
    const socket = await getSocket();
    
    // Group notifications by user to emit efficiently
    const notificationsByUser = new Map<string, Notification[]>();
    
    for (const { userId, notification } of notifications) {
      if (!notificationsByUser.has(userId)) {
        notificationsByUser.set(userId, []);
      }
      notificationsByUser.get(userId)!.push(notification);
    }
    
    // Emit to each user room
    for (const [userId, userNotifications] of notificationsByUser) {
      for (const notification of userNotifications) {
        socket.emit('emit-to-user', {
          userId,
          event: 'notification:new',
          data: { notification }
        });
        
        // Update delivery status
        await updateNotificationDeliveryStatus(notification._id, 'EMITTED');
      }
    }
    
  } catch (error) {
    console.error('Failed to emit notifications via Socket.IO:', error);
    
    // Mark notifications as failed
    for (const { notification } of notifications) {
      await updateNotificationDeliveryStatus(notification._id, 'FAILED');
    }
    
    throw error;
  }
}

async function updateNotificationDeliveryStatus(
  notificationId: string, 
  status: 'EMITTED' | 'FAILED'
): Promise<void> {
  const { NotificationModel } = await import('../models/index.js');
  
  try {
    await NotificationModel.updateOne(
      { _id: notificationId },
      { deliveryStatus: status }
    );
  } catch (error) {
    console.error(`Failed to update notification ${notificationId} status:`, error);
  }
}