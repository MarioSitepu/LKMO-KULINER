import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import { sendOTPEmail, sendPasswordResetNotification } from '../utils/emailService.js';
import crypto from 'crypto';

const router = express.Router();

// Helper: Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper: Calculate cooldown time
const getCooldownTime = (cooldownLevel) => {
  const cooldowns = {
    0: 0,           // No cooldown
    1: 60 * 1000,   // 1 minute
    2: 5 * 60 * 1000,   // 5 minutes
    3: 10 * 60 * 1000,  // 10 minutes
    4: 24 * 60 * 60 * 1000 // 24 hours
  };
  return cooldowns[cooldownLevel] || 0;
};

// @route   POST /api/password-reset/request
// @desc    Request password reset OTP
// @access  Public
router.post('/request', [
  body('email')
    .isEmail().withMessage('Email tidak valid')
    .normalizeEmail()
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

    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.json({
        success: true,
        message: 'Jika email terdaftar, kode OTP telah dikirim ke email Anda'
      });
    }

    // Check if user registered via Google (no password)
    if (user.googleId && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'Email ini terdaftar menggunakan akun Google. Silakan login dengan Google.',
        isGoogleAccount: true,
        email: normalizedEmail
      });
    }

    // Check for existing OTP and cooldown
    const existingOTP = await OTP.findOne({
      email: normalizedEmail,
      type: 'password_reset',
      used: false
    }).sort({ createdAt: -1 });

    if (existingOTP) {
      // Check if in cooldown
      if (existingOTP.cooldownUntil && new Date() < existingOTP.cooldownUntil) {
        const remainingTime = Math.ceil((existingOTP.cooldownUntil - new Date()) / 1000);
        return res.status(429).json({
          success: false,
          message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
          cooldownUntil: existingOTP.cooldownUntil,
          remainingSeconds: remainingTime
        });
      }

      // Check if OTP is still valid (not expired)
      if (new Date() < existingOTP.expiresAt && existingOTP.attempts < 3) {
        return res.status(400).json({
          success: false,
          message: 'Kode OTP masih aktif. Silakan cek email Anda.'
        });
      }
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create or update OTP
    await OTP.findOneAndUpdate(
      { email: normalizedEmail, type: 'password_reset', used: false },
      {
        email: normalizedEmail,
        code: otpCode,
        type: 'password_reset',
        expiresAt,
        attempts: 0,
        used: false,
        cooldownUntil: null,
        cooldownLevel: 0
      },
      { upsert: true, new: true }
    );

    // Send OTP email
    try {
      await sendOTPEmail(normalizedEmail, otpCode);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // In development, still return success
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV MODE] OTP for ${normalizedEmail}: ${otpCode}`);
      } else {
        return res.status(500).json({
          success: false,
          message: 'Gagal mengirim email. Silakan coba lagi nanti.'
        });
      }
    }

    res.json({
      success: true,
      message: 'Kode OTP telah dikirim ke email Anda'
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat memproses permintaan',
      error: error.message
    });
  }
});

// @route   POST /api/password-reset/verify
// @desc    Verify OTP code
// @access  Public
router.post('/verify', [
  body('email')
    .isEmail().withMessage('Email tidak valid')
    .normalizeEmail(),
  body('code')
    .isLength({ min: 6, max: 6 }).withMessage('Kode OTP harus 6 digit')
    .matches(/^\d+$/).withMessage('Kode OTP harus berupa angka')
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

    const { email, code } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP
    const otp = await OTP.findOne({
      email: normalizedEmail,
      type: 'password_reset',
      used: false
    }).sort({ createdAt: -1 });

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Kode OTP tidak ditemukan atau sudah digunakan'
      });
    }

    // Check if expired
    if (new Date() > otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Kode OTP telah kadaluarsa'
      });
    }

    // Check if max attempts reached
    if (otp.attempts >= 3) {
      // Update cooldown
      const newCooldownLevel = Math.min(otp.cooldownLevel + 1, 4);
      const cooldownTime = getCooldownTime(newCooldownLevel);
      const cooldownUntil = new Date(Date.now() + cooldownTime);

      await OTP.findByIdAndUpdate(otp._id, {
        cooldownLevel: newCooldownLevel,
        cooldownUntil
      });

      return res.status(429).json({
        success: false,
        message: 'Terlalu banyak percobaan. Silakan request OTP baru.',
        cooldownUntil,
        cooldownLevel: newCooldownLevel
      });
    }

    // Verify code
    if (otp.code !== code) {
      // Increment attempts
      const newAttempts = otp.attempts + 1;
      const updateData = { attempts: newAttempts };

      // If max attempts reached, set cooldown
      if (newAttempts >= 3) {
        const newCooldownLevel = Math.min(otp.cooldownLevel + 1, 4);
        const cooldownTime = getCooldownTime(newCooldownLevel);
        updateData.cooldownUntil = new Date(Date.now() + cooldownTime);
        updateData.cooldownLevel = newCooldownLevel;
      }

      await OTP.findByIdAndUpdate(otp._id, updateData);

      const remainingAttempts = 3 - newAttempts;
      return res.status(400).json({
        success: false,
        message: `Kode OTP salah. Sisa percobaan: ${remainingAttempts}`,
        remainingAttempts
      });
    }

    // OTP is valid - mark as used but keep it for password reset
    await OTP.findByIdAndUpdate(otp._id, {
      used: true,
      lastAttemptAt: new Date()
    });

    res.json({
      success: true,
      message: 'Kode OTP valid',
      otpId: otp._id.toString()
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat memverifikasi OTP',
      error: error.message
    });
  }
});

// @route   POST /api/password-reset/reset
// @desc    Reset password with OTP
// @access  Public
router.post('/reset', [
  body('email')
    .isEmail().withMessage('Email tidak valid')
    .normalizeEmail(),
  body('otpId')
    .notEmpty().withMessage('OTP ID harus diisi'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password dan konfirmasi password tidak sama');
      }
      return true;
    })
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

    const { email, otpId, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP was used (from verify step)
    const otp = await OTP.findOne({
      _id: otpId,
      email: normalizedEmail,
      type: 'password_reset',
      used: true
    });

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Kode OTP tidak valid atau sudah digunakan'
      });
    }

    // Check if OTP is still valid (within 5 minutes of verification)
    const timeSinceVerification = Date.now() - otp.lastAttemptAt.getTime();
    if (timeSinceVerification > 5 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: 'Kode OTP telah kadaluarsa. Silakan request OTP baru.'
      });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Update password (mongoose pre-save hook will hash it)
    user.password = password;
    await user.save();

    // Send notification to admin
    try {
      const adminUsers = await User.find({ role: 'admin' }).select('email');
      for (const admin of adminUsers) {
        await sendPasswordResetNotification(admin.email, user.email, user.name);
      }
    } catch (notifError) {
      console.error('Failed to send admin notification:', notifError);
      // Don't fail the request if notification fails
    }

    res.json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saat mereset password',
      error: error.message
    });
  }
});

export default router;

