const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/profile', authMiddleware, userController.getProfile);
router.get('/profile/:id', authMiddleware, userController.getProfileById);
router.get("/api/users/count", authMiddleware, userController.getTotalUsersCount);
router.get('/api/users', authMiddleware, userController.getUsers);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/auth/users/:id', authMiddleware, userController.deleteUser);
router.put('/auth/users/change-password', authMiddleware, userController.changePassword);
router.put('/auth/users/:id/make-admin', authMiddleware, userController.makeAdmin);

module.exports = router;