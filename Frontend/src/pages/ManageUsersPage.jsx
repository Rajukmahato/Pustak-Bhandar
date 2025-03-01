import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageUsersPage.css';
import AdminSidePanel from '../components/AdminSidePanel';

const ManageUsersPage = () => {
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
      // Sort users alphabetically by name
      const sortedUsers = response.data.users.sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setUsers(sortedUsers);
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
        await axios.put(`http://localhost:5005/auth/users/${id}/make-admin`, {}, {
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

  return (
    <div className="manage-users-container">
      <AdminSidePanel />
      <div className="main-content">
        <header className="header">
          <h1>Manage Users</h1>
        </header>
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
        <div className="manage-users-table-container">
          <div className="manage-users-table-scroll">
            <table className="manage-users-table">
              <thead>
                <tr className="manage-users-table-header-row">
                  <th>No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="manage-users-table-row">
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
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
          </div>
        </div>
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;