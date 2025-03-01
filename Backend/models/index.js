const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Import models
const User = require('./user');
const UserProfile = require('./userProfile');
const Category = require('./category');
const Book = require('./book');
const Contact = require('./contact');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add models to db object
db.User = User;
db.UserProfile = UserProfile;
db.Category = Category;
db.Book = Book;
db.Contact = Contact;

// Initialize associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sync all models with the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

module.exports = db;