import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { UserModel } from '../models/User.js';
import { ResponseHelper } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const usersRouter: Router = Router();

// Validation middleware
const validatePagination = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isString().trim().isLength({ min: 1, max: 50 })
];

const validateUserId = [
  param('id').isMongoId().withMessage('Invalid user ID format')
];

// Get all users with pagination and search
usersRouter.get('/', validatePagination, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.validationError(res, errors.array());
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query = {
        name: { $regex: search, $options: 'i' }
      };
    }

    const [users, total] = await Promise.all([
      UserModel
        .find(query)
        .select('_id name createdAt')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(query)
    ]);

    logger.info('Users fetched successfully', {
      count: users.length,
      total,
      page,
      limit,
      search: search || 'none'
    });

    return ResponseHelper.paginated(res, users, page, limit, total);
    
  } catch (error) {
    logger.error('Get users error:', error);
    return ResponseHelper.error(res, 'Failed to fetch users', 500, 'FETCH_USERS_ERROR');
  }
});

// Get user by ID
usersRouter.get('/:id', validateUserId, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.validationError(res, errors.array());
    }

    const user = await UserModel
      .findById(req.params.id)
      .lean();
    
    if (!user) {
      return ResponseHelper.notFound(res, 'User');
    }

    logger.info('User fetched successfully', { userId: req.params.id });
    return ResponseHelper.success(res, user);
    
  } catch (error) {
    logger.error('Get user error:', error);
    return ResponseHelper.error(res, 'Failed to fetch user', 500, 'FETCH_USER_ERROR');
  }
});

// Get user statistics
usersRouter.get('/:id/stats', validateUserId, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.validationError(res, errors.array());
    }

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return ResponseHelper.notFound(res, 'User');
    }

    // TODO: Implement actual statistics aggregation
    const stats = {
      userId: req.params.id,
      totalPosts: 0,
      totalFollowers: 0,
      totalFollowing: 0,
      totalNotifications: 0,
      joinedDate: user.createdAt
    };

    return ResponseHelper.success(res, stats);
    
  } catch (error) {
    logger.error('Get user stats error:', error);
    return ResponseHelper.error(res, 'Failed to fetch user statistics', 500, 'FETCH_USER_STATS_ERROR');
  }
});