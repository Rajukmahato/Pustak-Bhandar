const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/api/admin/profile', authMiddleware, adminController.getProfile);
router.put('/api/admin/profile', authMiddleware, adminController.updateProfile);
router.put('/api/admin/password', authMiddleware, adminController.updatePassword);
router.get('/api/admin/settings', authMiddleware, adminController.getSettings);
router.put('/api/admin/settings', authMiddleware, adminController.updateSettings);
router.put('/api/admin/notifications', authMiddleware, adminController.updateNotifications);

module.exports = router;