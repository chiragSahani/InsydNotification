import { Response } from 'express';
import { logger } from './logger.js';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class ResponseHelper {
  static success<T>(res: Response, data: T, statusCode = 200, meta?: any): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };

    logger.info('API Success Response', {
      statusCode,
      path: res.req.path,
      method: res.req.method,
      ip: res.req.ip
    });

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response, 
    message: string, 
    statusCode = 500, 
    code = 'INTERNAL_ERROR',
    details?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      error: {
        message,
        code,
        ...(details && { details })
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };

    logger.error('API Error Response', {
      statusCode,
      message,
      code,
      path: res.req.path,
      method: res.req.method,
      ip: res.req.ip,
      details
    });

    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, resource = 'Resource'): Response {
    return this.error(res, `${resource} not found`, 404, 'NOT_FOUND');
  }

  static badRequest(res: Response, message = 'Bad request', details?: any): Response {
    return this.error(res, message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(res: Response, message = 'Unauthorized'): Response {
    return this.error(res, message, 401, 'UNAUTHORIZED');
  }

  static forbidden(res: Response, message = 'Forbidden'): Response {
    return this.error(res, message, 403, 'FORBIDDEN');
  }

  static conflict(res: Response, message = 'Conflict', details?: any): Response {
    return this.error(res, message, 409, 'CONFLICT', details);
  }

  static validationError(res: Response, errors: any): Response {
    return this.error(res, 'Validation failed', 422, 'VALIDATION_ERROR', errors);
  }

  static paginated<T>(
    res: Response, 
    data: T[], 
    page: number, 
    limit: number, 
    total: number,
    statusCode = 200
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    return this.success(res, data, statusCode, {
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  }
}