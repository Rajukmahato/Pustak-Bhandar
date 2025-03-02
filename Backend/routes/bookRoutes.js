const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require('../middleware/multerConfig');

// Book routes
router.get("/", bookController.getBooks);
router.get("/count", bookController.getTotalBooksCount);
router.get("/categories", bookController.getBooksPerCategory);
router.get("/:id", bookController.getBookById);
router.post("/admin", upload.single('coverImage'), bookController.createBook);
router.put("/admin/:id", upload.single('coverImage'), bookController.updateBook);
router.delete("/:id", bookController.deleteBook);
router.get("/search", bookController.searchBooks);

module.exports = router;