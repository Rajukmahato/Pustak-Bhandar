const jwt = require('jsonwebtoken');
const { User, UserProfile } = require('../models');
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

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    console.log("User signed in successfully:", user); // Log signed-in user
    res.status(200).json({ message: "User signed in successfully", token, userId: user.id });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ message: "Error signing in", error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have a way to get the authenticated user's ID
    const user = await User.findByPk(userId, {
      include: {
        model: UserProfile,
        as: 'userProfile'
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Get User Profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: UserProfile,
        as: 'userProfile'
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error });
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
    const count = await User.count();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total users count", error });
  }
};

// Fetch all users with search and role filter
exports.getUsers = async (req, res) => {
  const { search, role, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  if (role) {
    where.role = role;
  }

  try {
    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({ users: rows, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.role = role;
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and delete the associated user profile
    const profile = await UserProfile.findOne({ where: { userId: id } });
    if (profile) {
      await profile.destroy();
    }

    await user.destroy();
    res.status(200).json({ message: "User and profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user and profile", error });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId; // Ensure this is correctly set by the authMiddleware

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
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