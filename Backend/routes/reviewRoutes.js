const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const bookReviewController = require('../controllers/bookReviewController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Public routes (no authentication required)
router.get('/book/summary', bookReviewController.getBookReviewsSummary);
router.get('/book/:bookId', reviewController.getBookReviews);

// Protected routes (authentication required)
router.post('/book', authMiddleware, reviewController.addReview);
router.put('/book/:reviewId', authMiddleware, reviewController.updateReview);
router.delete('/book/:reviewId', authMiddleware, reviewController.deleteReview);

// Admin routes
router.get('/', adminMiddleware, reviewController.getAllReviews);
router.delete('/admin/:reviewId', adminMiddleware, reviewController.adminDeleteReview);

module.exports = router; 