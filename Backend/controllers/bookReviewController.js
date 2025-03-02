const { Review, User, Book } = require('../models');
const { Op } = require('sequelize');

// Get review summary for multiple books with enhanced logging
exports.getBookReviewsSummary = async (req, res) => {
  console.log('📊 Starting review summary calculation...');
  try {
    const { bookIds } = req.query;
    console.log('📚 Requested book IDs:', bookIds);

    if (!bookIds) {
      console.warn('⚠️ No book IDs provided in request');
      return res.status(400).json({
        success: false,
        message: 'Book IDs are required'
      });
    }

    const bookIdArray = bookIds.split(',').map(id => parseInt(id));
    console.log('🔢 Parsed book IDs:', bookIdArray);

    // Validate book IDs
    if (bookIdArray.some(id => isNaN(id))) {
      console.error('❌ Invalid book ID format detected');
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    console.log('🔍 Fetching reviews from database...');
    const reviews = await Review.findAll({
      where: {
        bookId: {
          [Op.in]: bookIdArray
        }
      },
      attributes: ['bookId', 'rating'],
      raw: true
    });
    console.log(`📝 Found ${reviews.length} total reviews`);

    // Calculate summary for each book
    const summary = {};
    bookIdArray.forEach(bookId => {
      const bookReviews = reviews.filter(review => review.bookId === bookId);
      const ratings = bookReviews.map(review => review.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b) / ratings.length 
        : 0;
      
      summary[bookId] = {
        averageRating: parseFloat(averageRating.toFixed(1)), // Round to 1 decimal
        totalReviews: ratings.length,
        ratingDistribution: {
          5: ratings.filter(r => r === 5).length,
          4: ratings.filter(r => r === 4).length,
          3: ratings.filter(r => r === 3).length,
          2: ratings.filter(r => r === 2).length,
          1: ratings.filter(r => r === 1).length
        }
      };
      console.log(`📊 Book ${bookId}: ${ratings.length} reviews, avg rating ${averageRating.toFixed(1)}`);
      console.log(`   Rating distribution:`, summary[bookId].ratingDistribution);
    });

    console.log('✅ Summary calculation completed successfully');
    res.status(200).json({
      success: true,
      reviews: summary,
      metadata: {
        totalBooks: bookIdArray.length,
        totalReviews: reviews.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Error in getBookReviewsSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating review summary',
      error: error.message
    });
  }
}; 