import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/ProfilePage.css';
import Navbar from '../components/Navbar'; // Assuming Navbar is a global component
import Footer from '../components/Footer'; // Assuming Footer is a global component

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    bio: "",
    location: "",
    website: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get userId and token from local storage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Fetch user profile details from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          password: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
          bio: response.data.user.userProfile.bio || "",
          location: response.data.user.userProfile.location || "",
          website: response.data.user.userProfile.website || ""
        });
      } catch (error) {
        setError("Error fetching profile. Please log in again.");
      }
    };
    fetchUserProfile();
  }, [userId, token]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle update profile form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5005/api/profile",
        { 
          userId,
          bio: formData.bio,
          location: formData.location,
          website: formData.website
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      alert("Profile updated successfully!");
      setUser(response.data.user);
    } catch (error) {
      setError("Error updating profile. Please try again.");
    }
  };

  // Handle change password form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      await axios.put(
        "http://localhost:5005/api/auth/users/change-password",
        { oldPassword: formData.oldPassword, newPassword: formData.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      alert("Password changed successfully!");
      setFormData({ ...formData, oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setError("Error changing password. Please try again.");
    }
  };

  // Handle delete account
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5005/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
      alert("Account deleted successfully!");
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate("/signin");
    } catch (error) {
      setError("Error deleting account. Please try again.");
    }
  };

  const handleLogout = () => {
    // Remove token and userId from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Perform logout logic
    navigate("/signin");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <div className="profile-page-container">
        <header className="header">
          <h1>Manage Your Profile</h1>
          <p>Here you can view and update your personal information, change your password, or delete your account.</p>
        </header>

        <section className="profile-info">
          <h2>Account Details</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              ></textarea>
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
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="update-btn">Save Changes</button>
          </form>
        </section>

        <section className="change-password">
          <h2>Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="oldPassword">Old Password</label>
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
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="update-btn">Change Password</button>
          </form>
        </section>

        <section className="delete-account">
          <h2>Delete Account</h2>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <button onClick={handleDelete} className="delete-btn">Delete Account</button>
        </section>

        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </>
  );
};

export default ProfilePage;