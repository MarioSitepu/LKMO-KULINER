import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating harus diisi'],
    min: [1, 'Rating minimal 1'],
    max: [5, 'Rating maksimal 5']
  },
  comment: {
    type: String,
    required: [true, 'Komentar harus diisi'],
    trim: true,
    maxlength: [500, 'Komentar maksimal 500 karakter']
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews (one user can only review once per recipe)
reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;

