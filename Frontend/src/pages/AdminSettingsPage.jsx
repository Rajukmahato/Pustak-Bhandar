import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminSettingsPage.css';
import AdminSidePanel from '../components/AdminSidePanel';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [themeColor, setThemeColor] = useState('#6a0dad');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [siteDescription, setSiteDescription] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/users', {
        params: {
          search: searchQuery,
          role: roleFilter,
          page: currentPage,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (id) => {
    // Logic to edit user
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5005/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  const handleMakeAdmin = async (id) => {
    if (window.confirm('Are you sure you want to make this user an admin?')) {
      try {
        await axios.put(`http://localhost:5005/api/auth/users/${id}/make-admin`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        fetchUsers();
      } catch (error) {
        console.error('Error making user an admin', error);
      }
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put('/api/admin/settings/password', {
        currentPassword,
        newPassword
      });
      alert('Password updated successfully');
    } catch (error) {
      alert('Error updating password');
    }
  };

  const handleThemeChange = async () => {
    try {
      await axios.put('/api/admin/settings/theme', { themeColor });
      alert('Theme updated successfully');
    } catch (error) {
      alert('Error updating theme');
    }
  };

  const handleNotificationsChange = async () => {
    try {
      await axios.put('/api/admin/settings/notifications', { notificationsEnabled });
      alert('Notifications updated successfully');
    } catch (error) {
      alert('Error updating notifications');
    }
  };

  const handleConfigurationsChange = async () => {
    try {
      await axios.put('/api/admin/settings/configurations', {
        siteDescription,
        socialLinks
      });
      alert('Configurations updated successfully');
    } catch (error) {
      alert('Error updating configurations');
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
          <button className={activeTab === 'application' ? 'active' : ''} onClick={() => setActiveTab('application')}>Application</button>
          <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>Notifications</button>
          <button className={activeTab === 'system' ? 'active' : ''} onClick={() => setActiveTab('system')}>System</button>
        </div>
        <div className="admin-settings-content">
          {activeTab === 'profile' && (
            <section className="admin-settings-profile">
              <h2>Profile Settings</h2>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button onClick={handlePasswordChange}>Save Changes</button>
            </section>
          )}
          {activeTab === 'application' && (
            <section className="admin-settings-application">
              <h2>Application Settings</h2>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
              />
              <button onClick={handleThemeChange}>Save Changes</button>
            </section>
          )}
          {activeTab === 'notifications' && (
            <section className="admin-settings-notifications">
              <h2>Notification Settings</h2>
              <label>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
                Enable Notifications
              </label>
              <button onClick={handleNotificationsChange}>Save Changes</button>
            </section>
          )}
          {activeTab === 'system' && (
            <section className="admin-settings-system">
              <h2>System Preferences</h2>
              <textarea
                placeholder="Site Description"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Facebook Link"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
              />
              <input
                type="text"
                placeholder="Twitter Link"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
              />
              <input
                type="text"
                placeholder="Instagram Link"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
              />
              <input
                type="text"
                placeholder="LinkedIn Link"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
              />
              <button onClick={handleConfigurationsChange}>Save Changes</button>
            </section>
          )}
          <div className="admin-settings-users">
            <h2>Manage Users</h2>
            <div className="controls">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <select value={roleFilter} onChange={handleRoleChange}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEdit(user.id)}>Edit</button>
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                      {!user.isAdmin && (
                        <button onClick={() => handleMakeAdmin(user.id)}>Make Admin</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`page-btn ${index + 1 === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;