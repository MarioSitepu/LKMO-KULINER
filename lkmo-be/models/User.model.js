import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email tidak valid']
  },
  password: {
    type: String,
    required: function() {
      // Password required jika tidak login via Google
      return !this.googleId;
    },
    minlength: [6, 'Password minimal 6 karakter'],
    select: false // Jangan return password secara default
  },
  googleId: {
    type: String,
    default: null,
    sparse: true // Allow multiple null values but enforce uniqueness for non-null
  },
  image: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: '',
    maxlength: [500, 'Bio maksimal 500 karakter']
  },
  location: {
    type: String,
    default: ''
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Skip jika tidak ada password atau password tidak diubah
  if (!this.password || !this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual untuk recipe count
userSchema.virtual('recipeCount', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'author',
  count: true
});

// Virtual untuk follower/following count
userSchema.virtual('followersCount').get(function() {
  return this.followers ? this.followers.length : 0;
});

userSchema.virtual('followingCount').get(function() {
  return this.following ? this.following.length : 0;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;

