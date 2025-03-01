const { User, Book, Favorite, Category } = require('../models');

// Get user's favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{
        model: Book,
        as: 'favoritedBooks',
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }],
        attributes: ['id', 'title', 'author', 'description', 'coverImage', 'categoryId']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      favorites: user.favoritedBooks
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

// Add book to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      where: { userId, bookId }
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Book is already in favorites'
      });
    }

    // Add to favorites
    await Favorite.create({ userId, bookId });

    res.status(201).json({
      success: true,
      message: 'Book added to favorites successfully'
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding book to favorites',
      error: error.message
    });
  }
};

// Remove book from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const favorite = await Favorite.findOne({
      where: { userId, bookId }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in favorites'
      });
    }

    await favorite.destroy();

    res.status(200).json({
      success: true,
      message: 'Book removed from favorites successfully'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing book from favorites',
      error: error.message
    });
  }
};

// Check if a book is in user's favorites
exports.checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const favorite = await Favorite.findOne({
      where: { userId, bookId }
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking favorite status',
      error: error.message
    });
  }
}; 