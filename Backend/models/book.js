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
  genre: {
    type: DataTypes.STRING,
    allowNull: true
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

module.exports = Book;