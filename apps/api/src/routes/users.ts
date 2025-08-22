import { Router } from 'express';
import { UserModel } from '../models/User.js';

export const usersRouter = Router();

// Get all users (for demo dropdown)
usersRouter.get('/', async (req, res) => {
  try {
    const users = await UserModel
      .find({})
      .select('_id name createdAt')
      .sort({ name: 1 })
      .limit(100)
      .lean();
    
    res.json({ 
      success: true, 
      data: users 
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users' 
    });
  }
});

// Get user by ID
usersRouter.get('/:id', async (req, res) => {
  try {
    const user = await UserModel
      .findById(req.params.id)
      .lean();
    
    if (!user) {
      res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
      return;
    }
    
    res.json({ 
      success: true, 
      data: user 
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user' 
    });
  }
});