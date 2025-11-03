import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Recipe from '../models/Recipe.model.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

// @route   GET /api/recipes
// @desc    Get all recipes with filters
// @access  Public
router.get('/', [
  query('category').optional().isIn(['breakfast', 'lunch', 'dinner', 'snack']),
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], optionalAuth, async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 12,
      author,
      sort = 'createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (author) {
      query.author = author;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort
    let sortObj = { createdAt: -1 };
    if (sort === 'rating') {
      sortObj = { rating: -1, ratingsCount: -1 };
    } else if (sort === 'prepTime') {
      sortObj = { prepTime: 1 };
    }

    // Execute query
    const recipes = await Recipe.find(query)
      .populate('author', 'name image')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count
    const total = await Recipe.countDocuments(query);

    // Check if user saved the recipe
    if (req.user) {
      recipes.forEach(recipe => {
        recipe.isSaved = recipe.savedBy?.some(id => id.toString() === req.user._id.toString()) || false;
      });
    }

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
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil resep',
      error: error.message
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name image bio location')
      .lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    // Check if user saved the recipe
    if (req.user) {
      recipe.isSaved = recipe.savedBy?.some(id => id.toString() === req.user._id.toString()) || false;
    }

    res.json({
      success: true,
      data: { recipe }
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error mengambil resep',
      error: error.message
    });
  }
});

// @route   POST /api/recipes
// @desc    Create new recipe
// @access  Private
router.post('/', authenticate, uploadSingle, [
  body('title')
    .trim()
    .notEmpty().withMessage('Judul harus diisi')
    .isLength({ max: 200 }).withMessage('Judul maksimal 200 karakter'),
  body('category')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Kategori tidak valid'),
  body('prepTime')
    .isInt({ min: 1 }).withMessage('Waktu persiapan harus angka positif'),
  body('ingredients')
    .isArray({ min: 1 }).withMessage('Minimal 1 bahan diperlukan'),
  body('steps')
    .isArray({ min: 1 }).withMessage('Minimal 1 langkah diperlukan')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded file if validation fails
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

    const {
      title,
      category,
      prepTime,
      equipment = [],
      ingredients,
      steps,
      price = ''
    } = req.body;

    // Parse equipment if it's a string
    let equipmentArray = equipment;
    if (typeof equipment === 'string') {
      equipmentArray = equipment.split(',').map(e => e.trim()).filter(e => e);
    } else if (!Array.isArray(equipment)) {
      equipmentArray = [];
    }

    // Parse ingredients and steps if they're strings
    const ingredientsArray = Array.isArray(ingredients) 
      ? ingredients 
      : JSON.parse(ingredients || '[]');
    const stepsArray = Array.isArray(steps) 
      ? steps 
      : JSON.parse(steps || '[]');

    // Create recipe
    const recipe = await Recipe.create({
      title,
      category,
      prepTime: parseInt(prepTime),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      equipment: equipmentArray,
      ingredients: ingredientsArray,
      steps: stepsArray,
      price,
      author: req.user._id
    });

    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('author', 'name image');

    res.status(201).json({
      success: true,
      message: 'Resep berhasil dibuat',
      data: { recipe: populatedRecipe }
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      const fs = await import('fs');
      fs.unlinkSync(req.file.path);
    }
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error membuat resep',
      error: error.message
    });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (Owner only)
router.put('/:id', authenticate, uploadSingle, [
  body('title').optional().trim().isLength({ max: 200 }),
  body('category').optional().isIn(['breakfast', 'lunch', 'dinner', 'snack']),
  body('prepTime').optional().isInt({ min: 1 })
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

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      if (req.file) {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    // Check ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      if (req.file) {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki izin untuk mengedit resep ini'
      });
    }

    // Update fields
    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.category) updateFields.category = req.body.category;
    if (req.body.prepTime) updateFields.prepTime = parseInt(req.body.prepTime);
    if (req.body.equipment !== undefined) {
      updateFields.equipment = Array.isArray(req.body.equipment) 
        ? req.body.equipment 
        : req.body.equipment.split(',').map(e => e.trim()).filter(e => e);
    }
    if (req.body.ingredients !== undefined) {
      updateFields.ingredients = Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : JSON.parse(req.body.ingredients || '[]');
    }
    if (req.body.steps !== undefined) {
      updateFields.steps = Array.isArray(req.body.steps)
        ? req.body.steps
        : JSON.parse(req.body.steps || '[]');
    }
    if (req.body.price !== undefined) updateFields.price = req.body.price;
    if (req.file) {
      // Delete old image if exists
      if (recipe.image) {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), recipe.image);
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      updateFields.image = `/uploads/${req.file.filename}`;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('author', 'name image');

    res.json({
      success: true,
      message: 'Resep berhasil diupdate',
      data: { recipe: updatedRecipe }
    });
  } catch (error) {
    if (req.file) {
      const fs = await import('fs');
      fs.unlinkSync(req.file.path);
    }
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengupdate resep',
      error: error.message
    });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private (Owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    // Check ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki izin untuk menghapus resep ini'
      });
    }

    // Delete image if exists
    if (recipe.image) {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), recipe.image);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resep berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error menghapus resep',
      error: error.message
    });
  }
});

// @route   POST /api/recipes/:id/save
// @desc    Save/unsave recipe
// @access  Private
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    const isSaved = recipe.savedBy.some(id => id.toString() === req.user._id.toString());

    if (isSaved) {
      // Unsave
      recipe.savedBy = recipe.savedBy.filter(id => id.toString() !== req.user._id.toString());
      await recipe.save();
      res.json({
        success: true,
        message: 'Resep berhasil dihapus dari tersimpan',
        data: { isSaved: false }
      });
    } else {
      // Save
      recipe.savedBy.push(req.user._id);
      await recipe.save();
      res.json({
        success: true,
        message: 'Resep berhasil disimpan',
        data: { isSaved: true }
      });
    }
  } catch (error) {
    console.error('Save recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error menyimpan resep',
      error: error.message
    });
  }
});

export default router;

