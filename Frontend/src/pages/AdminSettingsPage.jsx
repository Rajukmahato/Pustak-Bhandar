import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminSettingsPage.css';
import AdminSidePanel from '../components/AdminSidePanel';
import { toast } from 'react-hot-toast';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });

  // Get token from local storage
  const token = localStorage.getItem('token');

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await axios.put('/api/admin/settings/password', {
        currentPassword,
        newPassword
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast.error('Error updating password');
    }
  };

  const handleConfigurationsChange = async () => {
    try {
      await axios.put('/api/admin/settings/configurations', {
        siteDescription,
        socialLinks
      });
      toast.success('Configurations updated successfully');
    } catch (error) {
      toast.error('Error updating configurations');
    }
  };

  return (
    <div className="admin-settings-page-container">
      <AdminSidePanel />
      <div className="admin-settings-main-content">
        <header className="admin-settings-header">
          <h1>Admin Settings</h1>
        </header>
        <div className="admin-settings-tabs">
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={activeTab === 'system' ? 'active' : ''} onClick={() => setActiveTab('system')}>System</button>
        </div>
        <div className="admin-settings-content">
          {activeTab === 'profile' && (
            <section className="admin-settings-profile">
              <h2>Profile Settings</h2>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <button onClick={handlePasswordChange}>Update Password</button>
            </section>
          )}
          {activeTab === 'system' && (
            <section className="admin-settings-system">
              <h2>System Preferences</h2>
              <div className="form-group">
                <label>Site Description</label>
                <textarea
                  placeholder="Enter site description"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <h3>Social Media Links</h3>
                <input
                  type="url"
                  placeholder="Facebook URL"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Twitter URL"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Instagram URL"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                />
              </div>
              <button onClick={handleConfigurationsChange}>Save Changes</button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;