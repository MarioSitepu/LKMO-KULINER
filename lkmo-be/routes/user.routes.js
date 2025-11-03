import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.model.js';
import Recipe from '../models/Recipe.model.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile with recipes
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'name image')
      .populate('following', 'name image');

    // Get user recipes
    const recipes = await Recipe.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Get saved recipes
    const savedRecipes = await Recipe.find({ savedBy: req.user._id })
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
          location: user.location,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          createdAt: user.createdAt
        },
        stats: {
          recipesCount: recipes.length,
          followersCount: user.followersCount,
          followingCount: user.followingCount
        },
        recipes,
        savedRecipes
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil profil',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, uploadSingle, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('location').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.bio !== undefined) updateFields.bio = req.body.bio;
    if (req.body.location !== undefined) updateFields.location = req.body.location;
    if (req.file) {
      // Delete old image if exists
      if (req.user.image) {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), req.user.image);
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      updateFields.image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profil berhasil diupdate',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image,
          bio: updatedUser.bio,
          location: updatedUser.location
        }
      }
    });
  } catch (error) {
    if (req.file) {
      const fs = await import('fs');
      fs.unlinkSync(req.file.path);
    }
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengupdate profil',
      error: error.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('followers', 'name image')
      .populate('following', 'name image');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Get user recipes
    const recipes = await Recipe.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name image')
      .lean();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          image: user.image,
          bio: user.bio,
          location: user.location,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          createdAt: user.createdAt
        },
        stats: {
          recipesCount: recipes.length,
          followersCount: user.followersCount,
          followingCount: user.followingCount
        },
        recipes
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error mengambil user',
      error: error.message
    });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow/Unfollow user
// @access  Private
router.post('/:id/follow', authenticate, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Tidak bisa follow diri sendiri'
      });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    const isFollowing = currentUser.following.some(
      id => id.toString() === targetUserId
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== req.user._id.toString()
      );
      await currentUser.save();
      await targetUser.save();
      
      res.json({
        success: true,
        message: 'Berhasil unfollow',
        data: { isFollowing: false }
      });
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(req.user._id);
      await currentUser.save();
      await targetUser.save();
      
      res.json({
        success: true,
        message: 'Berhasil follow',
        data: { isFollowing: true }
      });
    }
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error follow/unfollow user',
      error: error.message
    });
  }
});

// @route   GET /api/users/:id/recipes
// @desc    Get user recipes
// @access  Public
router.get('/:id/recipes', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const recipes = await Recipe.find({ author: req.params.id })
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Recipe.countDocuments({ author: req.params.id });

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get user recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil resep user',
      error: error.message
    });
  }
});

export default router;

