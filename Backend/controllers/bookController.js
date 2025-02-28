const { Op } = require("sequelize");
const Book = require("../models/Book");
const multer = require("multer");
const path = require('path');
const upload = require('../middleware/multerConfig');


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

    const { title, author, description, genre, publisher, publicationDate, pageCount, isbn } = req.body;
    const coverImage = req.file ? req.file.path : null;

    try {
      const newBook = await Book.create({
        title,
        author,
        description,
        genre,
        coverImage,
        publisher,
        publicationDate,
        pageCount,
        isbn
      });
      res.status(201).json({ message: "Book created successfully", book: newBook });
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ message: "Error creating book", error });
    }
  
};

// Get All Books with Pagination
exports.getBooks = async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
      { genre: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (category) {
    where.genre = category;
  }

  try {
    const { count, rows } = await Book.findAndCountAll({
      where,
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({ books: rows, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// Get Book Details by ID
exports.getBookById = async (req, res) => {
  try {
    console.log("Fetching book with ID:", req.params.id); // Debug log
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      console.log("Book not found"); // Debug log
      return res.status(404).json({ message: "Book not found" });
    }

    console.log("Book found:", book); // Debug log
    res.status(200).json({ book });
  } catch (error) {
    console.error("Error fetching book:", error); // Debug log
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
          { author: { [Op.iLike]: `%${query}%` } },
          { genre: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: "Error searching books", error });
  }
};

// Delete a Book by ID
exports.deleteBook = (req, res) => {
  const bookId = req.params.id;
  // Logic to delete the book from the database
  // For example, using a database model:
  Book.findByIdAndDelete(bookId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting book' });
    }
    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  });
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
      attributes: ['genre', [sequelize.fn('COUNT', sequelize.col('genre')), 'count']],
      group: ['genre']
    });
    const result = {};
    booksPerCategory.forEach(item => {
      result[item.genre] = item.dataValues.count;
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books per category", error });
  }
};

exports.updateBook = (req, res) => {
  // Your update book logic here
  res.send("Book updated successfully");
};