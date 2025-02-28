const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user');
const UserProfile = require('./userProfile');
const Category = require('./category');
const Book = require('./book');
const Contact = require('./contact');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.UserProfile = UserProfile;
db.Category = Category;
db.Book = Book;
db.Contact = Contact;

// Call associate method to define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;