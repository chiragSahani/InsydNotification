import { ApiError } from './api.js';
import { config } from '../config/env.js';

export interface ErrorInfo {
  message: string;
  code: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'api' | 'validation' | 'authentication' | 'unknown';
  userMessage: string;
  actionable: boolean;
  retryable: boolean;
}

export class ErrorHandler {
  static categorizeError(error: any): ErrorInfo {
    if (error instanceof ApiError) {
      return this.categorizeApiError(error);
    }

    // Network/fetch errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: error.message,
        code: 'NETWORK_ERROR',
        severity: 'high',
        category: 'network',
        userMessage: 'Unable to connect to the server. Please check your internet connection.',
        actionable: true,
        retryable: true
      };
    }

    // Generic error
    return {
      message: error.message || 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      severity: 'medium',
      category: 'unknown',
      userMessage: 'Something went wrong. Please try again.',
      actionable: true,
      retryable: true
    };
  }

  private static categorizeApiError(error: ApiError): ErrorInfo {
    const baseError = {
      message: error.message,
      code: error.code,
      category: 'api' as const,
    };

    // Handle specific error codes
    switch (error.code) {
      case 'NETWORK_ERROR':
        return {
          ...baseError,
          severity: 'high',
          category: 'network',
          userMessage: 'Unable to connect to the server. Please check your internet connection.',
          actionable: true,
          retryable: true
        };

      case 'TIMEOUT':
        return {
          ...baseError,
          severity: 'medium',
          category: 'network',
          userMessage: 'The request is taking too long. Please try again.',
          actionable: true,
          retryable: true
        };

      case 'NOT_FOUND':
        return {
          ...baseError,
          severity: 'low',
          userMessage: 'The requested information could not be found.',
          actionable: false,
          retryable: false
        };

      case 'VALIDATION_ERROR':
        return {
          ...baseError,
          severity: 'low',
          category: 'validation',
          userMessage: 'Please check your input and try again.',
          actionable: true,
          retryable: false
        };

      case 'UNAUTHORIZED':
        return {
          ...baseError,
          severity: 'medium',
          category: 'authentication',
          userMessage: 'You need to log in to access this feature.',
          actionable: true,
          retryable: false
        };

      case 'FORBIDDEN':
        return {
          ...baseError,
          severity: 'medium',
          category: 'authentication',
          userMessage: 'You don\'t have permission to perform this action.',
          actionable: false,
          retryable: false
        };

      case 'RATE_LIMIT_EXCEEDED':
        return {
          ...baseError,
          severity: 'low',
          userMessage: 'Too many requests. Please wait a moment and try again.',
          actionable: true,
          retryable: true
        };

      default:
        // Handle HTTP status codes
        if (error.status >= 500) {
          return {
            ...baseError,
            severity: 'high',
            userMessage: 'Server error. Our team has been notified.',
            actionable: true,
            retryable: true
          };
        }

        if (error.status >= 400 && error.status < 500) {
          return {
            ...baseError,
            severity: 'medium',
            userMessage: 'There was a problem with your request. Please try again.',
            actionable: true,
            retryable: false
          };
        }

        return {
          ...baseError,
          severity: 'medium',
          userMessage: 'Something went wrong. Please try again.',
          actionable: true,
          retryable: true
        };
    }
  }

  static logError(error: any, context?: string): void {
    const errorInfo = this.categorizeError(error);
    
    if (config.features.enableDebugMode) {
      console.error(`[${context || 'Application'}] Error:`, {
        ...errorInfo,
        originalError: error,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }

    // In production, you would send this to your error reporting service
    if (config.features.enableErrorReporting && errorInfo.severity === 'critical') {
      // Example: Sentry, Rollbar, or custom error reporting
      console.warn('Error reporting not implemented');
    }
  }

  static getRetryDelay(attemptNumber: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attemptNumber), maxDelay);
    const jitter = Math.random() * 0.1 * delay;
    return delay + jitter;
  }
}