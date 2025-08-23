import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger factory function
export const createLogger = (logLevel: string = 'info', nodeEnv: string = 'development') => {
  const logger = winston.createLogger({
    level: logLevel,
    format: logFormat,
    defaultMeta: { service: 'insyd-notifications-api' },
    transports: [
      // Write all logs with importance level of 'error' or less to error.log
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      // Write all logs to combined.log
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  });

  // If we're not in production, log to console as well
  if (nodeEnv !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.level}]: ${info.message}`;
        })
      )
    }));
  }

  return logger;
};

// Default logger instance
export const logger = createLogger();

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (error) {
  // Directory might already exist
}

export default logger;