const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.put('/settings/password', adminController.updatePassword);
router.put('/settings/theme', adminController.updateTheme);
router.put('/settings/notifications', adminController.updateNotifications);
router.put('/settings/configurations', adminController.updateConfigurations);

module.exports = router;