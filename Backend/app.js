const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import models
require('./models');

// Routes
app.use(bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use(categoryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;