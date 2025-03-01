const jwt = require('jsonwebtoken');
const { User, UserProfile, Book } = require('../models');
const bcrypt = require("bcryptjs");
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// User Sign Up
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Signup request body:", req.body); // Log request body
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    await UserProfile.create({ userId: user.id }); // Create UserProfile
    console.log("User created successfully:", user); // Log created user
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({
      where: { id: userId },
      include: [{
        model: UserProfile,
        as: 'userProfile',
        attributes: ['bio', 'location', 'website']
      }],
      attributes: ['id', 'name', 'email', 'isAdmin']
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      user: {
        ...user.toJSON(),
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user profile',
      error: error.message 
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  const { userId, bio, location, website } = req.body;
  try {
    const profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.bio = bio;
    profile.location = location;
    profile.website = website;
    await profile.save();

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};

// Delete User Profile
exports.deleteProfile = async (req, res) => {
  const { userId } = req.body;
  try {
    const profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await profile.destroy();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Error deleting profile", error });
  }
};

// User Sign In
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Signin request body:", req.body); // Log request body

  if (!email || !password) {
    console.log("Email and password are required");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    console.log("User signed in successfully:", user); // Log signed-in user
    res.status(200).json({ message: "User signed in successfully", token, userId: user.id, isAdmin: user.isAdmin });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ message: "Error signing in", error });
  }
};

// Get Profile By ID
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findOne({
      where: { id },
      include: [{
        model: UserProfile,
        as: 'userProfile',
        attributes: ['bio', 'location', 'website']
      }],
      attributes: ['id', 'name', 'email', 'isAdmin']
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      user: {
        ...user.toJSON(),
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user profile',
      error: error.message 
    });
  }
};

// Example of a restricted action
exports.restrictedAction = async (req, res) => {
  const userId = req.userId; // Assuming you have a way to get the authenticated user's ID
  const user = await User.findByPk(userId);

  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Perform the restricted action
  res.status(200).json({ message: "Action performed successfully" });
};

// Get total users count
exports.getTotalUsersCount = async (req, res) => {
  try {
    // Get the user making the request
    const user = await User.findByPk(req.userId);
    
    // Check if user exists and is an admin
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    const count = await User.count();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total users count", error });
  }
};

// Get Users (with pagination and filters)
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{
        model: UserProfile,
        as: 'userProfile',
        attributes: ['bio', 'location', 'website']
      }],
      attributes: ['id', 'name', 'email', 'isAdmin'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      users: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio, location, website } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user basic info
    user.name = name;
    user.email = email;
    await user.save();

    // Update profile info
    const profile = await UserProfile.findOne({ where: { userId: id } });
    if (profile) {
      profile.bio = bio;
      profile.location = location;
      profile.website = website;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        ...user.toJSON(),
        password: undefined,
        userProfile: profile
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated profile
    await UserProfile.destroy({ where: { userId: id } });
    
    // Delete user
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User and associated profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// Make a user an admin
exports.makeAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: "User promoted to admin successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error promoting user to admin", error });
  }
};

// Get user's favorite books
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      include: [{
        model: Book,
        as: 'favorites',
        through: { attributes: [] } // Exclude join table attributes
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      success: true,
      favorites: user.favorites 
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching favorites',
      error: error.message 
    });
  }
};

// Add a book to favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.addFavorite(bookId);

    res.status(200).json({ 
      success: true,
      message: 'Book added to favorites successfully' 
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding book to favorites',
      error: error.message 
    });
  }
};

// Remove a book from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.removeFavorite(bookId);

    res.status(200).json({ 
      success: true,
      message: 'Book removed from favorites successfully' 
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error removing book from favorites',
      error: error.message 
    });
  }
};