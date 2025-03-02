const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

// // Favorites routes
// router.get('/favorites', authMiddleware, userController.getFavorites);
// router.post('/favorites/add', authMiddleware, userController.addFavorite);
// router.post('/favorites/remove', authMiddleware, userController.removeFavorite);

// Protected routes - require authentication
router.get('/auth/profile', authMiddleware, userController.getProfile);
router.put('/auth/profile', authMiddleware, userController.updateProfile);
router.get('/auth/profile/:id', authMiddleware, userController.getProfileById);
router.get("/count", authMiddleware, userController.getTotalUsersCount);
router.get('/auth', authMiddleware, userController.getUsers);
router.put('/auth/:id', authMiddleware, userController.updateUser);
router.delete('/auth/:id', authMiddleware, userController.deleteUser);
router.put('/auth/change-password', authMiddleware, userController.changePassword);
router.put('/auth/:id/make-admin', authMiddleware, userController.makeAdmin);


module.exports = router;