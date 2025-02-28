const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get("/api/categories/count", categoryController.getTotalCategoriesCount);
router.get('/api/categories', categoryController.getCategories);
router.post('/api/categories', categoryController.addCategory);
router.put('/api/categories/:id', categoryController.updateCategory);
router.delete('/api/categories/:id', categoryController.deleteCategory);

module.exports = router;