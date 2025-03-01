import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    bio: "",
    location: "",
    website: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  // Get userId and token from local storage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Check authentication
  useEffect(() => {
    if (!token || !userId) {
      navigate("/signin");
    }
  }, [token, userId, navigate]);

  // Fetch user profile details
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get('http://localhost:5005/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.user) {
          const userData = response.data.user;
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            bio: userData.userProfile?.bio || "",
            location: userData.userProfile?.location || "",
            website: userData.userProfile?.website || ""
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        const errorMessage = error.response?.data?.message || error.message || "Error fetching profile. Please log in again.";
        setError(errorMessage);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchUserProfile();
    }
  }, [token, userId, navigate]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear any status messages when user starts typing
    if (updateStatus.message) {
      setUpdateStatus({ type: '', message: '' });
    }
  };

  // Handle update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateStatus({ type: '', message: '' });
    
    try {
      const response = await axios.put(
        "http://localhost:5005/api/profile",
        {
          bio: formData.bio,
          location: formData.location,
          website: formData.website
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setUser(response.data.user);
      setUpdateStatus({
        type: 'success',
        message: 'Profile updated successfully!'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error updating profile. Please try again.'
      });
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setUpdateStatus({ type: '', message: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateStatus({
        type: 'error',
        message: 'New passwords do not match.'
      });
      return;
    }

    try {
      await axios.put(
        "http://localhost:5005/api/auth/users/change-password",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUpdateStatus({
        type: 'success',
        message: 'Password changed successfully!'
      });
      setFormData(prev => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      setUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error changing password. Please try again.'
      });
    }
  };

  // Handle account deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5005/api/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate("/signin");
    } catch (error) {
      console.error('Error deleting account:', error);
      setUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error deleting account. Please try again.'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate("/signin");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">Please log in to view your profile</div>;

  return (
    <div className="profile-page-container">
      <header className="header">
        <h1>Manage Your Profile</h1>
        <p>Here you can view and update your personal information, change your password, or delete your account.</p>
      </header>

      {updateStatus.message && (
        <div className={`status-message ${updateStatus.type}`}>
          {updateStatus.message}
        </div>
      )}

      <section className="profile-info">
        <h2>Account Details</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://"
            />
          </div>

          <button type="submit" className="update-btn">Save Changes</button>
        </form>
      </section>

      <section className="change-password">
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="oldPassword">Current Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="change-password-btn">Change Password</button>
        </form>
      </section>

      <section className="danger-zone">
        <h2>Danger Zone</h2>
        <div className="action-buttons">
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>
          <button onClick={handleDelete} className="delete-account-btn">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;