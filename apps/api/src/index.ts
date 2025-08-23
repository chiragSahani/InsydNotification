import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('Successfully loaded .env file');
  console.log('MONGO_URI present:', !!process.env.MONGO_URI);
  console.log('REDIS_URL present:', !!process.env.REDIS_URL);
}

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { setupSocketIO } from './sockets/notifications.js';
import { apiRoutes } from './routes/index.js';
import { getConfig } from './config/env.js';
import { 
  securityMiddleware, 
  createRateLimitMiddleware, 
  validateRequest, 
  createErrorHandler,
  createCorsOptions 
} from './middleware/security.js';
import { createLogger } from './utils/logger.js';
import { ResponseHelper } from './utils/response.js';

const config = getConfig();
const logger = createLogger(config.LOG_LEVEL, config.NODE_ENV);
const app = express();
const server = createServer(app);

// Security middleware - should be first
app.use(securityMiddleware);

// Compression middleware
app.use(compression());

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Create middleware instances with config
const corsOptions = createCorsOptions(config.CORS_ORIGIN, config.NODE_ENV);
const rateLimitMiddleware = createRateLimitMiddleware(config.API_RATE_LIMIT);
const errorHandler = createErrorHandler(config.NODE_ENV);

// Socket.IO setup with enhanced CORS
const io = new SocketIOServer(server, {
  cors: corsOptions
});

// CORS middleware
app.use(cors(corsOptions));

// Rate limiting
app.use(rateLimitMiddleware);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request validation and sanitization
app.use(validateRequest);

// Make io available to routes
app.locals.io = io;

// Routes
app.use('/api', apiRoutes);

// Enhanced health check endpoint
app.get('/api/healthz', async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: config.NODE_ENV,
      services: {
        database: 'connected', // TODO: Add actual health checks
        redis: 'connected',
        socketIO: 'enabled'
      }
    };
    
    ResponseHelper.success(res, healthData);
  } catch (error) {
    logger.error('Health check failed:', error);
    ResponseHelper.error(res, 'Service unhealthy', 503, 'SERVICE_UNAVAILABLE');
  }
});

// API info endpoint
app.get('/api/info', (req, res) => {
  ResponseHelper.success(res, {
    name: 'Insyd Notifications API',
    version: '1.0.0',
    description: 'Enterprise-grade real-time notification system',
    documentation: '/api/docs',
    status: 'operational'
  });
});

// Socket.IO setup
setupSocketIO(io);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  ResponseHelper.notFound(res, 'API endpoint');
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

// Start server
async function startServer() {
  try {
    logger.info('🚀 Starting Insyd Notifications API...');
    
    // Connect to services
    await connectDatabase();
    logger.info('✅ Database connected');
    
    await connectRedis();
    logger.info('✅ Redis connected');
    
    // Start server
    server.listen(config.PORT, () => {
      logger.info(`🚀 API Server running on port ${config.PORT}`);
      logger.info(`📡 Socket.IO enabled for real-time notifications`);
      logger.info(`🔒 Security middleware enabled`);
      logger.info(`⚡ Rate limiting: ${config.API_RATE_LIMIT} requests per 15 minutes`);
      logger.info(`🌍 Environment: ${config.NODE_ENV}`);
      logger.info(`📝 Log level: ${config.LOG_LEVEL}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();