const { Review, User, Book } = require('../models');
const { Op } = require('sequelize');

// Get all reviews for a specific book
exports.getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.findAll({
      where: { bookId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating
    const ratings = reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b) / ratings.length 
      : 0;

    res.status(200).json({
      success: true,
      reviews,
      averageRating,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error fetching book reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get review summary for multiple books
exports.getReviewsSummary = async (req, res) => {
  try {
    const { bookIds } = req.query;
    const bookIdArray = bookIds.split(',').map(id => parseInt(id));

    const reviews = await Review.findAll({
      where: {
        bookId: {
          [Op.in]: bookIdArray
        }
      },
      attributes: ['bookId', 'rating']
    });

    // Calculate summary for each book
    const summary = {};
    bookIdArray.forEach(bookId => {
      const bookReviews = reviews.filter(review => review.bookId === bookId);
      const ratings = bookReviews.map(review => review.rating);
      summary[bookId] = {
        averageRating: ratings.length > 0 
          ? ratings.reduce((a, b) => a + b) / ratings.length 
          : 0,
        totalReviews: ratings.length
      };
    });

    res.status(200).json({
      success: true,
      reviews: summary
    });
  } catch (error) {
    console.error('Error fetching reviews summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews summary',
      error: error.message
    });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, text } = req.body;
    const userId = req.user.id;

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      where: { userId, bookId }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    // Create new review
    const review = await Review.create({
      userId,
      bookId,
      rating,
      text
    });

    // Fetch the created review with user details
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: reviewWithUser
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    await review.update({ rating, text });

    // Fetch updated review with user details
    const updatedReview = await Review.findByPk(reviewId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    await review.destroy();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
}; 