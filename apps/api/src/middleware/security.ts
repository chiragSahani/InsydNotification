import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Security middleware
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate limiting factory function
export const createRateLimitMiddleware = (apiRateLimit: string = '100') => rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(apiRateLimit), // Limit each IP to API_RATE_LIMIT requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/api/healthz';
  }
});

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Basic request sanitization
  if (req.body) {
    // Remove any potential XSS attempts
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
          obj[key] = sanitizeObject(obj[key]);
        });
      }
      return obj;
    };
    req.body = sanitizeObject(req.body);
  }
  next();
};

// Error handling middleware factory
export const createErrorHandler = (nodeEnv: string = 'development') => (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ API Error:', err);
  
  // Don't leak error details in production
  const isDevelopment = nodeEnv === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
      ...(isDevelopment && { stack: err.stack })
    }
  });
};

// CORS configuration factory
export const createCorsOptions = (corsOrigin: string = '*', nodeEnv: string = 'development') => ({
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (nodeEnv === 'development' || corsOrigin === '*') {
      // Allow all origins in development
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    const allowedOrigins = corsOrigin.split(',');
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});