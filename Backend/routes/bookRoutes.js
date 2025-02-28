const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require('../middleware/multerConfig');

router.get("/api/books", bookController.getBooks);
router.get("/books/:id", bookController.getBookById);
router.get("/search", bookController.searchBooks);
router.post("/api/admin/books", upload.single('coverImage'), bookController.createBook);
router.put("/api/books/:id", bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);
router.get("/api/books/count", bookController.getTotalBooksCount);
router.get("/api/books/categories", bookController.getBooksPerCategory);

module.exports = router;