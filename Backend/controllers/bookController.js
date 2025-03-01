const { Op } = require("sequelize");
const Book = require("../models/book");
const fs = require('fs').promises;
const path = require('path');
const multer = require("multer");
const upload = require('../middleware/multerConfig');
const Category = require('../models/category');
const sequelize = require('../config/db');


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage }).single('coverImage');

// Create a new Book
exports.createBook = async (req, res) => {
  try {
    const { title, author, description, categoryId, publisher, publicationDate, pageCount, isbn } = req.body;
    
    // Validation
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: "Title and author are required fields"
      });
    }

    // ISBN validation (should be numeric and of appropriate length)
    if (isbn && !/^\d+$/.test(isbn)) {
      return res.status(400).json({
        success: false,
        message: "ISBN must contain only numbers"
      });
    }

    // Page count validation
    if (pageCount && (!Number.isInteger(Number(pageCount)) || Number(pageCount) <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Page count must be a positive integer"
      });
    }

    // Parse publication date
    let parsedPublicationDate = null;
    if (publicationDate) {
      parsedPublicationDate = new Date(publicationDate);
      if (isNaN(parsedPublicationDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid publication date format"
        });
      }
    }

    // Handle image upload
    let coverImage = null;
    if (req.file) {
      coverImage = req.file.path.replace(/\\/g, '/'); // Normalize path for all OS
    }

    // Verify category exists
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID"
        });
      }
    }

    const newBook = await Book.create({
      title,
      author,
      description,
      categoryId,
      coverImage,
      publisher,
      publicationDate: parsedPublicationDate,
      pageCount: Number(pageCount),
      isbn
    });

    // Fetch the book with its category
    const bookWithCategory = await Book.findByPk(newBook.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: bookWithCategory
    });
  } catch (error) {
    // If there was an error and an image was uploaded, delete it
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    console.error('Error creating book:', error);
    res.status(500).json({
      success: false,
      message: "Error creating book",
      error: error.message
    });
  }
};

// Get All Books with Pagination
exports.getBooks = async (req, res) => {
  try {
    const { search, categoryId, page = 1, limit = 10 } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const { count, rows } = await Book.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }],
      limit: parsedLimit,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      success: true,
      books: rows,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: count,
        itemsPerPage: parsedLimit
      }
    });
  } catch (error) {
    console.error('Error in getBooks:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: error.message
    });
  }
};

// Get Book Details by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};

// Search Books
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { author: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: "Error searching books", error });
  }
};

// Delete a Book
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Delete associated image if exists
    if (book.coverImage) {
      await fs.unlink(book.coverImage).catch(console.error);
    }

    await book.destroy();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting book",
      error: error.message
    });
  }
};

// Get total books count
exports.getTotalBooksCount = async (req, res) => {
  try {
    const count = await Book.count();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total books count", error });
  }
};

// Get books count per category
exports.getBooksPerCategory = async (req, res) => {
  try {
    const booksPerCategory = await Book.findAll({
      attributes: [
        [sequelize.col('category.id'), 'categoryId'],
        [sequelize.col('category.name'), 'categoryName'],
        [sequelize.fn('COUNT', sequelize.col('Book.id')), 'count']
      ],
      include: [{
        model: Category,
        as: 'category',
        attributes: []
      }],
      group: ['category.id', 'category.name']
    });
    
    res.status(200).json(booksPerCategory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books per category", error });
  }
};

// Update a Book
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updates = { ...req.body };
    
    // Handle image update if new image is uploaded
    if (req.file) {
      updates.coverImage = req.file.path.replace(/\\/g, '/');
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // If updating with new image, delete the old one
    if (req.file && book.coverImage) {
      await fs.unlink(book.coverImage).catch(console.error);
    }

    await book.update(updates);

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book
    });
  } catch (error) {
    // If there was an error and a new image was uploaded, delete it
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({
      success: false,
      message: "Error updating book",
      error: error.message
    });
  }
};