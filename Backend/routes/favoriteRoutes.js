const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get user's favorites
router.get('/', favoriteController.getFavorites);

// Add book to favorites
router.post('/', favoriteController.addToFavorites);

// Remove book from favorites
router.delete('/:bookId', favoriteController.removeFromFavorites);

// Check if a book is in user's favorites
router.get('/:bookId/check', favoriteController.checkFavorite);

module.exports = router; 