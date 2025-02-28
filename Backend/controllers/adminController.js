const bcrypt = require('bcryptjs');
const { Admin, Settings } = require('../models');

// Update Admin Password
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.adminId; // Assuming adminId is available in the request

  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await Admin.update({ password: hashedNewPassword }, { where: { id: adminId } });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
};

// Update Theme Color
exports.updateTheme = async (req, res) => {
  const { themeColor } = req.body;

  try {
    await Settings.update({ themeColor }, { where: { id: 1 } });
    res.status(200).json({ message: 'Theme updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating theme', error });
  }
};

// Update Notification Preferences
exports.updateNotifications = async (req, res) => {
  const { notificationsEnabled } = req.body;

  try {
    await Settings.update({ notificationsEnabled }, { where: { id: 1 } });
    res.status(200).json({ message: 'Notifications updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications', error });
  }
};

// Update Other Configurations
exports.updateConfigurations = async (req, res) => {
  const { siteDescription, socialLinks } = req.body;

  try {
    await Settings.update({ siteDescription, socialLinks }, { where: { id: 1 } });
    res.status(200).json({ message: 'Configurations updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating configurations', error });
  }
};