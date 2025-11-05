import express from 'express';
import { body, validationResult, query } from 'express-validator';
import User from '../models/User.model.js';
import Recipe from '../models/Recipe.model.js';
import Review from '../models/Review.model.js';
import OTP from '../models/OTP.model.js';
import { isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(isAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin only
router.get('/dashboard', async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get recent recipes (last 7 days)
    const newRecipes = await Recipe.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get recipes by category
    const recipesByCategory = await Recipe.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top users by recipe count
    const topUsers = await Recipe.aggregate([
      {
        $group: {
          _id: '$author',
          recipeCount: { $sum: 1 }
        }
      },
      { $sort: { recipeCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          image: '$user.image',
          recipeCount: 1
        }
      }
    ]);

    // Get recent password resets (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentPasswordResets = await OTP.find({
      type: 'password_reset',
      used: true,
      lastAttemptAt: { $gte: oneDayAgo }
    })
      .sort({ lastAttemptAt: -1 })
      .limit(10)
      .lean();

    // Get user info for password resets
    const passwordResetNotifications = await Promise.all(
      recentPasswordResets.map(async (otp) => {
        const user = await User.findOne({ email: otp.email }).select('name email');
        return {
          email: otp.email,
          userName: user?.name || 'Unknown',
          resetAt: otp.lastAttemptAt
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRecipes,
        totalReviews,
        totalAdmins,
        newUsers,
        newRecipes,
        recipesByCategory,
        topUsers,
        passwordResetNotifications
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat mengambil data dashboard',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Admin only
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await User.countDocuments(query);

    // Get recipe count for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const recipeCount = await Recipe.countDocuments({ author: user._id });
        return {
          ...user.toObject(),
          recipeCount
        };
      })
    );

    res.json({
      success: true,
      data: {
        users: usersWithCounts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat mengambil data users',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Admin only
router.put('/users/:id/role', [
  body('role').isIn(['user', 'admin']).withMessage('Role harus user atau admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    // Prevent changing own role (optional security measure)
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat mengubah role sendiri'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Role user berhasil diupdate',
      data: { user }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat mengupdate role user',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin only
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting own account
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus akun sendiri'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Delete all recipes by this user
    await Recipe.deleteMany({ author: id });

    // Delete all reviews by this user
    await Review.deleteMany({ user: id });

    // Remove user from followers/following lists
    await User.updateMany(
      { $or: [{ followers: id }, { following: id }] },
      { $pull: { followers: id, following: id } }
    );

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User dan semua data terkait berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat menghapus user',
      error: error.message
    });
  }
});

// @route   GET /api/admin/recipes
// @desc    Get all recipes with pagination
// @access  Admin only
router.get('/recipes', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    // Build query
    const query = {};
    if (search) {
      query.$text = { $search: search };
    }

    // Get recipes with pagination
    const skip = (page - 1) * limit;
    const recipes = await Recipe.find(query)
      .populate('author', 'name email image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Recipe.countDocuments(query);

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat mengambil data recipes',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/recipes/:id
// @desc    Delete recipe
// @access  Admin only
router.delete('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe tidak ditemukan'
      });
    }

    // Delete all reviews for this recipe
    await Review.deleteMany({ recipe: id });

    // Remove recipe from savedBy lists
    await User.updateMany(
      { savedRecipes: id },
      { $pull: { savedRecipes: id } }
    );

    // Delete recipe
    await Recipe.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Recipe dan semua data terkait berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat menghapus recipe',
      error: error.message
    });
  }
});

// @route   GET /api/admin/reviews
// @desc    Get all reviews with pagination
// @access  Admin only
router.get('/reviews', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Get reviews with pagination
    const skip = (page - 1) * limit;
    const reviews = await Review.find()
      .populate('user', 'name email image')
      .populate('recipe', 'title image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Review.countDocuments();

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat mengambil data reviews',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete review
// @access  Admin only
router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id).populate('recipe');
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan'
      });
    }

    // Delete review
    await Review.findByIdAndDelete(id);

    // Recalculate recipe rating
    const reviews = await Review.find({ recipe: review.recipe._id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Recipe.findByIdAndUpdate(review.recipe._id, {
      rating: Math.round(avgRating * 10) / 10,
      ratingsCount: reviews.length
    });

    res.json({
      success: true,
      message: 'Review berhasil dihapus dan rating recipe telah diupdate'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat menghapus review',
      error: error.message
    });
  }
});

export default router;

