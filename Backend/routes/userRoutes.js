const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

// // Favorites routes
// router.get('/favorites', authMiddleware, userController.getFavorites);
// router.post('/favorites/add', authMiddleware, userController.addFavorite);
// router.post('/favorites/remove', authMiddleware, userController.removeFavorite);

// Protected routes - require authentication
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/profile/:id', authMiddleware, userController.getProfileById);
router.get("/api/users/count", authMiddleware, userController.getTotalUsersCount);
router.get('/api/users', authMiddleware, userController.getUsers);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/auth/users/:id', authMiddleware, userController.deleteUser);
router.put('/auth/users/change-password', authMiddleware, userController.changePassword);
router.put('/auth/users/:id/make-admin', authMiddleware, userController.makeAdmin);


module.exports = router;