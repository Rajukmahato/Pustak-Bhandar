const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require('../middleware/multerConfig');

// Book routes
router.get("/api/books", bookController.getBooks);
router.get("/api/books/count", bookController.getTotalBooksCount);
router.get("/api/books/categories", bookController.getBooksPerCategory);
router.get("/api/books/:id", bookController.getBookById);
router.post("/api/admin/books", upload.single('coverImage'), bookController.createBook);
router.put("/api/admin/books/:id", upload.single('coverImage'), bookController.updateBook);
router.delete("/api/admin/books/:id", bookController.deleteBook);
router.get("/api/books/search", bookController.searchBooks);

module.exports = router;