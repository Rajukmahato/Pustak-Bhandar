const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Import models
const User = require('./user');
const UserProfile = require('./userProfile');
const Category = require('./category');
const Book = require('./book');
const Contact = require('./contact');
const Favorite = require('./favorite');
const Review = require('./review');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add models to db object
db.User = User;
db.UserProfile = UserProfile;
db.Category = Category;
db.Book = Book;
db.Contact = Contact;
db.Favorite = Favorite;
db.Review = Review;

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

// User-UserProfile Association
User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile'
});

UserProfile.belongsTo(User, {
  foreignKey: 'userId'
});

// User-Review Association
User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews'
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Book-Review Association
Book.hasMany(Review, {
  foreignKey: 'bookId',
  as: 'reviews'
});

Review.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

// User-Book Favorites Association (through Favorite model)
User.belongsToMany(Book, {
  through: Favorite,
  foreignKey: 'userId',
  otherKey: 'bookId',
  as: 'favoritedBooks'
});

Book.belongsToMany(User, {
  through: Favorite,
  foreignKey: 'bookId',
  otherKey: 'userId',
  as: 'favoritedByUsers'
});

module.exports = db;