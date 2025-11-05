import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    lowercase: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    length: 6
  },
  type: {
    type: String,
    enum: ['password_reset'],
    default: 'password_reset'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto delete expired documents
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3 // Max 3 attempts
  },
  used: {
    type: Boolean,
    default: false
  },
  lastAttemptAt: {
    type: Date,
    default: null
  },
  cooldownUntil: {
    type: Date,
    default: null
  },
  cooldownLevel: {
    type: Number,
    default: 0, // 0 = no cooldown, 1 = 1min, 2 = 5min, 3 = 10min, 4 = 24h
    max: 4
  }
}, {
  timestamps: true
});

// Index untuk fast lookup
otpSchema.index({ email: 1, type: 1, used: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;

