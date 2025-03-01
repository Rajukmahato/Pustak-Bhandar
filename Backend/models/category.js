const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Define the association here
Category.associate = function(models) {
  Category.hasMany(models.Book, {
    foreignKey: 'categoryId',
    as: 'books'
  });
};

module.exports = Category;