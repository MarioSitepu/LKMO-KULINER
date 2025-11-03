import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul resep harus diisi'],
    trim: true,
    maxlength: [200, 'Judul maksimal 200 karakter']
  },
  category: {
    type: String,
    required: [true, 'Kategori harus diisi'],
    enum: {
      values: ['breakfast', 'lunch', 'dinner', 'snack'],
      message: 'Kategori harus salah satu dari: breakfast, lunch, dinner, snack'
    }
  },
  prepTime: {
    type: Number,
    required: [true, 'Waktu persiapan harus diisi'],
    min: [1, 'Waktu persiapan minimal 1 menit']
  },
  image: {
    type: String,
    default: null
  },
  equipment: [{
    type: String,
    trim: true
  }],
  ingredients: [{
    type: String,
    required: true,
    trim: true
  }],
  steps: [{
    type: String,
    required: true,
    trim: true
  }],
  price: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index untuk search
recipeSchema.index({ title: 'text', ingredients: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ author: 1 });
recipeSchema.index({ createdAt: -1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;

