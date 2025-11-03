import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Initialize Google OAuth2 Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama harus diisi')
    .isLength({ min: 2 }).withMessage('Nama minimal 2 karakter'),
  body('email')
    .isEmail().withMessage('Email tidak valid')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
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

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
          location: user.location
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat registrasi',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail().withMessage('Email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password harus diisi')
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

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
          location: user.location
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat login',
      error: error.message
    });
  }
});

// @route   POST /api/auth/google
// @desc    Login atau Register dengan Google
// @access  Public
router.post('/google', [
  body('tokenId')
    .notEmpty().withMessage('Token ID Google harus diisi')
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

    const { tokenId } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email tidak ditemukan dari akun Google'
      });
    }

    // Check if user exists by email or googleId
    let user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { googleId }
      ]
    });

    if (user) {
      // Update googleId if user exists but doesn't have it
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        if (!user.image && picture) {
          user.image = picture;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        image: picture || null,
        password: undefined // No password for Google users
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: user.googleId && user.createdAt > new Date(Date.now() - 5000) 
        ? 'Registrasi dengan Google berhasil' 
        : 'Login dengan Google berhasil',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
          location: user.location
        }
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    
    // Handle specific Google verification errors
    if (error.message.includes('Token used too early') || 
        error.message.includes('Token used too late')) {
      return res.status(400).json({
        success: false,
        message: 'Token Google tidak valid atau sudah kadaluarsa'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saat autentikasi dengan Google',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'name image')
      .populate('following', 'name image');

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
        }
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil data user',
      error: error.message
    });
  }
});

export default router;

