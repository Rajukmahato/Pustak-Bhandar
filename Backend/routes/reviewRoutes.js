const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Get reviews for a book
router.get('/book/:bookId', reviewController.getBookReviews);

// Get review summary for multiple books
router.get('/summary', reviewController.getReviewsSummary);

// Add a review (requires authentication)
router.post('/', authMiddleware, reviewController.addReview);

// Update a review (requires authentication)
router.put('/:reviewId', authMiddleware, reviewController.updateReview);

// Delete a review (requires authentication)
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router; 