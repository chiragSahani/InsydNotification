import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Settings } from '../models/Settings.js';
import { ResponseHelper } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const settingsRouter = Router();

// Get user settings
settingsRouter.get('/:userId', [
  param('userId').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.badRequest(res, 'Validation failed', errors.array());
    }

    const { userId } = req.params;
    
    // Find settings or create default if not exists
    let settings = await Settings.findOne({ userId });
    
    if (!settings) {
      settings = new Settings({
        userId,
        emailNotifications: true,
        pushNotifications: true,
        soundEnabled: true,
        darkMode: false,
        notificationTypes: {
          followers: true,
          posts: true,
          likes: true,
          comments: true
        },
        deliveryMethods: {
          email: true,
          push: true,
          sms: false
        },
        frequency: {
          realTime: true,
          daily: false,
          weekly: false
        }
      });
      await settings.save();
    }

    return ResponseHelper.success(res, settings);
  } catch (error) {
    logger.error('Failed to get user settings:', error);
    return ResponseHelper.error(res, 'Failed to retrieve settings');
  }
});

// Update user settings
settingsRouter.put('/:userId', [
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('emailNotifications').optional().isBoolean(),
  body('pushNotifications').optional().isBoolean(),
  body('soundEnabled').optional().isBoolean(),
  body('darkMode').optional().isBoolean(),
  body('notificationTypes').optional().isObject(),
  body('deliveryMethods').optional().isObject(),
  body('frequency').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.badRequest(res, 'Validation failed', errors.array());
    }

    const { userId } = req.params;
    const updates = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      { userId },
      { ...updates, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    logger.info(`Settings updated for user ${userId}`);
    
    return ResponseHelper.success(res, settings);
  } catch (error) {
    logger.error('Failed to update user settings:', error);
    return ResponseHelper.error(res, 'Failed to update settings');
  }
});

// Reset user settings to default
settingsRouter.post('/:userId/reset', [
  param('userId').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.badRequest(res, 'Validation failed', errors.array());
    }

    const { userId } = req.params;
    
    const defaultSettings = {
      userId,
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      darkMode: false,
      notificationTypes: {
        followers: true,
        posts: true,
        likes: true,
        comments: true
      },
      deliveryMethods: {
        email: true,
        push: true,
        sms: false
      },
      frequency: {
        realTime: true,
        daily: false,
        weekly: false
      },
      updatedAt: new Date()
    };
    
    const settings = await Settings.findOneAndUpdate(
      { userId },
      defaultSettings,
      { new: true, upsert: true }
    );

    logger.info(`Settings reset to defaults for user ${userId}`);
    
    return ResponseHelper.success(res, settings);
  } catch (error) {
    logger.error('Failed to reset user settings:', error);
    return ResponseHelper.error(res, 'Failed to reset settings');
  }
});

// Bulk update notification preferences
settingsRouter.patch('/:userId/notifications', [
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('enabled').isBoolean().withMessage('Enabled must be a boolean'),
  body('types').optional().isArray().withMessage('Types must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.badRequest(res, 'Validation failed', errors.array());
    }

    const { userId } = req.params;
    const { enabled, types } = req.body;
    
    let updateData: any = {};
    
    if (typeof enabled === 'boolean') {
      updateData.emailNotifications = enabled;
      updateData.pushNotifications = enabled;
    }
    
    if (types && Array.isArray(types)) {
      updateData['notificationTypes'] = {};
      for (const type of types) {
        updateData[`notificationTypes.${type}`] = enabled;
      }
    }
    
    updateData.updatedAt = new Date();
    
    const settings = await Settings.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    logger.info(`Notification preferences updated for user ${userId}`);
    
    return ResponseHelper.success(res, settings);
  } catch (error) {
    logger.error('Failed to update notification preferences:', error);
    return ResponseHelper.error(res, 'Failed to update notification preferences');
  }
});