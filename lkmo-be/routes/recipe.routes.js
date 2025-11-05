import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Recipe from '../models/Recipe.model.js';
import Review from '../models/Review.model.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

// @route   GET /api/recipes
// @desc    Get all recipes with filters
// @access  Public
router.get('/', [
  query('category').optional().isIn(['breakfast', 'lunch', 'dinner', 'snack']),
  query('search').optional().trim(),
  query('equipment').optional().trim(),
  query('priceRange').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], optionalAuth, async (req, res) => {
  try {
    const {
      category,
      search,
      equipment,
      priceRange,
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

    // Equipment filter - we'll filter in memory for better accuracy
    // This allows recipes with multiple equipment to appear in multiple menus
    // We fetch all recipes first, then filter in-memory to ensure accuracy
    let equipmentFilter = null;
    if (equipment) {
      if (equipment === 'other') {
        // Filter recipes with equipment that is NOT in the main equipment list
        equipmentFilter = 'other';
      } else {
        // Filter recipes that contain the specified equipment
        equipmentFilter = equipment.trim();
      }
      // Don't add MongoDB query filter - we'll filter in memory for 100% accuracy
    }

    if (author) {
      query.author = author;
    }
    
    // Price range filter
    // priceRange format: "under-10000", "10000-25000", "over-25000"
    // Helper function to extract price number from string
    const extractPriceNumber = (priceStr) => {
      if (!priceStr || priceStr.trim() === '') return 0;
      // Remove "Rp", spaces, dots, commas, and extract all numbers
      const numbers = priceStr.replace(/Rp\s*/gi, '').replace(/[^\d]/g, '');
      const num = parseInt(numbers) || 0;
      
      // Handle "rb", "ribu", "k" suffix (multiply by 1000)
      if (priceStr.toLowerCase().match(/\d+\s*(rb|ribu|k)/i)) {
        const baseNum = parseInt(priceStr.match(/\d+/)?.[0] || '0') || 0;
        return baseNum * 1000;
      }
      
      return num;
    };
    
    // Note: Price filtering will be done after query for better accuracy
    // since price is stored as string with various formats
    let priceRangeFilter = null;
    if (priceRange) {
      if (priceRange === 'under-10000') {
        priceRangeFilter = (priceStr) => {
          const num = extractPriceNumber(priceStr);
          return num > 0 && num < 10000;
        };
      } else if (priceRange === '10000-25000') {
        priceRangeFilter = (priceStr) => {
          const num = extractPriceNumber(priceStr);
          return num >= 10000 && num <= 25000;
        };
      } else if (priceRange === 'over-25000') {
        priceRangeFilter = (priceStr) => {
          const num = extractPriceNumber(priceStr);
          return num > 25000;
        };
      }
    }

    // Build sort
    let sortObj = { createdAt: -1 };
    let sortByPopular = false;
    if (sort === 'rating') {
      sortObj = { rating: -1, ratingsCount: -1 };
    } else if (sort === 'prepTime') {
      sortObj = { prepTime: 1 };
    } else if (sort === 'popular') {
      // For popular sort, we'll sort in-memory by savedBy array length
      sortByPopular = true;
      sortObj = { createdAt: -1 }; // Default sort for initial fetch
    }

    // Execute query
    // If we have equipment filter, we'll filter in-memory, so fetch more recipes
    const queryLimit = equipmentFilter ? 1000 : undefined;
    let recipes = await Recipe.find(query)
      .populate('author', 'name image')
      .sort(sortObj)
      .limit(queryLimit || 1000) // Increase limit when filtering equipment in-memory
      .lean();

    // Apply equipment filter in-memory for accuracy
    // This ensures recipes with multiple equipment appear in all relevant menus
    if (equipmentFilter) {
      if (equipmentFilter === 'other') {
        // Filter recipes with equipment that is NOT in the main equipment list
        const mainEquipment = ['Rice Cooker', 'Microwave', 'Kompor', 'Wajan', 'Panci rebus'];
        recipes = recipes.filter(recipe => {
          // Recipe must have equipment array with at least one item
          if (!recipe.equipment || !Array.isArray(recipe.equipment) || recipe.equipment.length === 0) {
            return false;
          }
          // Recipe must have at least one equipment that is NOT in mainEquipment
          return recipe.equipment.some(eq => !mainEquipment.includes(eq));
        });
      } else {
        // Filter recipes that contain the specified equipment (exact match)
        // Normalize by trimming spaces for comparison
        const filterValue = equipmentFilter.trim();
        recipes = recipes.filter(recipe => {
          if (!recipe.equipment || !Array.isArray(recipe.equipment)) {
            return false;
          }
          // Check if equipment array contains the filter value (case-sensitive, exact match)
          return recipe.equipment.some(eq => eq && eq.trim() === filterValue);
        });
      }
    }

    // Apply price filter if specified (in-memory filtering for accuracy)
    if (priceRangeFilter) {
      recipes = recipes.filter(recipe => {
        return recipe.price && priceRangeFilter(recipe.price);
      });
    }

    // Apply popular sort if specified (in-memory sorting by savedBy count)
    if (sortByPopular) {
      recipes = recipes.sort((a, b) => {
        const aSavedCount = a.savedBy?.length || 0;
        const bSavedCount = b.savedBy?.length || 0;
        if (bSavedCount !== aSavedCount) {
          return bSavedCount - aSavedCount; // Descending order
        }
        // If same saved count, sort by rating
        return (b.rating || 0) - (a.rating || 0);
      });
    }

    // Get total count (after filters if applied)
    const total = (priceRangeFilter || equipmentFilter) ? recipes.length : await Recipe.countDocuments(query);

    // Apply pagination after filtering
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    recipes = recipes.slice(skip, skip + limitNum);

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

// @route   GET /api/recipes/stats/popular-categories
// @desc    Get popular categories based on recipe count
// @access  Public
router.get('/stats/popular-categories', async (req, res) => {
  try {
    const categories = await Recipe.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 4
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1
        }
      }
    ]);

    // Map category names to display names
    const categoryDisplayNames = {
      breakfast: 'Sarapan',
      lunch: 'Makan Siang',
      dinner: 'Makan Malam',
      snack: 'Camilan'
    };

    // Map category names to paths
    const categoryPaths = {
      breakfast: '/category/breakfast',
      lunch: '/category/lunch',
      dinner: '/category/dinner',
      snack: '/category/snack'
    };

    // Map category names to default images
    const categoryImages = {
      breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      lunch: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      dinner: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      snack: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    };

    // Get image for first recipe in each category as sample
    const categoriesWithImages = await Promise.all(
      categories.map(async (cat) => {
        const sampleRecipe = await Recipe.findOne({ category: cat.name })
          .select('image')
          .lean();
        
        return {
          name: categoryDisplayNames[cat.name] || cat.name,
          count: cat.count,
          path: categoryPaths[cat.name] || `/category/${cat.name}`,
          image: sampleRecipe?.image || categoryImages[cat.name]
        };
      })
    );

    res.json({
      success: true,
      data: { categories: categoriesWithImages }
    });
  } catch (error) {
    console.error('Get popular categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil kategori populer',
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

    // Get reviews with user info
    const reviews = await Review.find({ recipe: req.params.id })
      .populate('user', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    // Check if user saved the recipe
    if (req.user) {
      recipe.isSaved = recipe.savedBy?.some(id => id.toString() === req.user._id.toString()) || false;
      // Check if user has reviewed this recipe
      const userReview = reviews.find(r => r.user._id.toString() === req.user._id.toString());
      recipe.userReview = userReview || null;
    }

    res.json({
      success: true,
      data: { 
        recipe,
        reviews 
      }
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
router.post('/', authenticate, (req, res, next) => {
  // Handle multer errors
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Ukuran file terlalu besar. Maksimal 5MB'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Error saat upload file'
        });
      }
      // File filter error
      if (err.message) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      return next(err);
    }
    next();
  });
}, [
  body('title')
    .trim()
    .notEmpty().withMessage('Judul harus diisi')
    .isLength({ max: 200 }).withMessage('Judul maksimal 200 karakter'),
  body('category')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Kategori tidak valid'),
  body('prepTime')
    .isInt({ min: 1 }).withMessage('Waktu persiapan harus angka positif'),
  body('ingredients')
    .custom((value) => {
      if (!value) return false;
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }).withMessage('Minimal 1 bahan diperlukan'),
  body('steps')
    .custom((value) => {
      if (!value) return false;
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }).withMessage('Minimal 1 langkah diperlukan')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded file if validation fails
      if (req.file) {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      }
      // Log validation errors for debugging
      console.error('Validation errors:', errors.array());
      console.error('Request body:', {
        title: req.body.title,
        category: req.body.category,
        prepTime: req.body.prepTime,
        equipment: req.body.equipment,
        ingredients: req.body.ingredients ? 'present' : 'missing',
        steps: req.body.steps ? 'present' : 'missing',
      });
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

    // Log for debugging
    console.log('Creating recipe with:', {
      title,
      category,
      prepTime,
      equipmentType: typeof equipment,
      equipment,
      hasIngredients: !!ingredients,
      hasSteps: !!steps
    });

    // Parse equipment - handle both JSON string and array
    let equipmentArray = [];
    try {
      if (!equipment || equipment === '' || equipment === '[]') {
        // Empty equipment is allowed
        equipmentArray = [];
      } else if (Array.isArray(equipment)) {
        equipmentArray = equipment;
      } else if (typeof equipment === 'string') {
        // Try to parse as JSON first
        try {
          const parsed = JSON.parse(equipment);
          if (Array.isArray(parsed)) {
            equipmentArray = parsed;
          } else {
            // If not array after parsing, treat as comma-separated string
            equipmentArray = equipment.split(',').map(e => e.trim()).filter(e => e);
          }
        } catch {
          // If JSON parse fails, treat as comma-separated string
          equipmentArray = equipment.split(',').map(e => e.trim()).filter(e => e);
        }
      }
      // Normalize equipment array: trim each item and remove duplicates
      if (Array.isArray(equipmentArray)) {
        equipmentArray = equipmentArray.map(e => String(e).trim()).filter(e => e.length > 0);
        // Remove duplicates while preserving order
        equipmentArray = [...new Set(equipmentArray)];
      } else {
        equipmentArray = [];
      }
    } catch (err) {
      console.error('Error parsing equipment:', err);
      equipmentArray = [];
    }

    // Parse ingredients and steps if they're strings
    let ingredientsArray;
    let stepsArray;
    
    try {
      ingredientsArray = Array.isArray(ingredients) 
        ? ingredients 
        : JSON.parse(ingredients || '[]');
    } catch (err) {
      if (req.file) {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Format ingredients tidak valid. Harus berupa array JSON'
      });
    }
    
    try {
      stepsArray = Array.isArray(steps) 
        ? steps 
        : JSON.parse(steps || '[]');
    } catch (err) {
      if (req.file) {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Format steps tidak valid. Harus berupa array JSON'
      });
    }
    
    // Validate arrays are not empty
    if (!ingredientsArray || ingredientsArray.length === 0) {
      if (req.file) {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Minimal 1 bahan diperlukan'
      });
    }
    
    if (!stepsArray || stepsArray.length === 0) {
      if (req.file) {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Minimal 1 langkah diperlukan'
      });
    }

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
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Error deleting uploaded file:', unlinkErr);
      }
    }
    console.error('Create recipe error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error membuat resep',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Terjadi kesalahan pada server'
    });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (Owner only)
router.put('/:id', authenticate, (req, res, next) => {
  // Handle multer errors
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Ukuran file terlalu besar. Maksimal 5MB'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Error saat upload file'
        });
      }
      // File filter error
      if (err.message) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      return next(err);
    }
    next();
  });
}, [
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
      try {
        updateFields.ingredients = Array.isArray(req.body.ingredients)
          ? req.body.ingredients
          : JSON.parse(req.body.ingredients || '[]');
      } catch (err) {
        if (req.file) {
          const fs = await import('fs');
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: 'Format ingredients tidak valid. Harus berupa array JSON'
        });
      }
    }
    if (req.body.steps !== undefined) {
      try {
        updateFields.steps = Array.isArray(req.body.steps)
          ? req.body.steps
          : JSON.parse(req.body.steps || '[]');
      } catch (err) {
        if (req.file) {
          const fs = await import('fs');
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: 'Format steps tidak valid. Harus berupa array JSON'
        });
      }
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
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Error deleting uploaded file:', unlinkErr);
      }
    }
    console.error('Update recipe error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error mengupdate resep',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Terjadi kesalahan pada server'
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

// @route   POST /api/recipes/:id/reviews
// @desc    Add review (rating + comment) to recipe
// @access  Private
router.post('/:id/reviews', authenticate, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating harus antara 1-5'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Komentar harus diisi')
    .isLength({ min: 1, max: 500 })
    .withMessage('Komentar maksimal 500 karakter')
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

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan'
      });
    }

    // Check if user already reviewed this recipe
    const existingReview = await Review.findOne({
      recipe: req.params.id,
      user: req.user._id
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = parseInt(req.body.rating);
      existingReview.comment = req.body.comment;
      await existingReview.save();
    } else {
      // Create new review
      await Review.create({
        recipe: req.params.id,
        user: req.user._id,
        rating: parseInt(req.body.rating),
        comment: req.body.comment
      });
    }

    // Recalculate recipe rating
    const reviews = await Review.find({ recipe: req.params.id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    recipe.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
    recipe.ratingsCount = reviews.length;
    await recipe.save();

    // Get updated review with user info
    const review = await Review.findOne({
      recipe: req.params.id,
      user: req.user._id
    }).populate('user', 'name image');

    res.status(existingReview ? 200 : 201).json({
      success: true,
      message: existingReview ? 'Ulasan berhasil diupdate' : 'Ulasan berhasil ditambahkan',
      data: { review }
    });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah memberikan ulasan untuk resep ini'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error menambahkan ulasan',
      error: error.message
    });
  }
});

export default router;

