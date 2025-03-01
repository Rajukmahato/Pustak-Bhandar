const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pageCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

Book.associate = function(models) {
  Book.belongsTo(models.Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });

  Book.belongsToMany(models.User, {
    through: models.Favorite,
    foreignKey: 'bookId',
    as: 'favoritedBy'
  });
};

module.exports = Book;