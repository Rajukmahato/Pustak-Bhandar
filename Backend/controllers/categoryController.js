const Category = require('../models/Category');
const { Op } = require('sequelize');

// Get total categories count
exports.getTotalCategoriesCount = async (req, res) => {
  try {
    const count = await Category.count();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total categories count", error });
  }
};

// Get all categories with search and pagination
exports.getCategories = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where.name = { [Op.iLike]: `%${search}%` };
  }

  try {
    const { count, rows } = await Category.findAndCountAll({
      where,
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({ categories: rows, totalPages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

// Add a new category
exports.addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newCategory = await Category.create({ name, description });
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      category.name = name;
      category.description = description;
      await category.save();
      res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
      res.status(500).json({ message: 'Error updating category', error });
    }
  };

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};