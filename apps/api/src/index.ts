import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { setupSocketIO } from './sockets/notifications.js';
import { apiRoutes } from './routes/index.js';
import { config } from './config/env.js';

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());

// Make io available to routes
app.locals.io = io;

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/healthz', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Socket.IO setup
setupSocketIO(io);

// Start server
async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();
    
    server.listen(config.PORT, () => {
      console.log(`🚀 API Server running on port ${config.PORT}`);
      console.log(`📡 Socket.IO enabled for real-time notifications`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();