import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaUser, FaTags, FaCog, FaPlus, FaSignOutAlt, FaComment } from 'react-icons/fa';
import '../styles/AdminSidePanel.css';

const AdminSidePanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Add logout logic here
    navigate('/signin');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin' },
    { name: 'Manage Books', icon: <FaBook />, path: '/admin/books' },
    // { name: 'Create New Book', icon: <FaPlus />, path: '/admin/create-book' },
    { name: 'Manage Users', icon: <FaUser />, path: '/admin/users' },
    { name: 'Manage Reviews', icon: <FaComment />, path: '/admin/reviews' },
    { name: 'Manage Categories', icon: <FaTags />, path: '/admin/categories' },
    { name: 'Admin Settings', icon: <FaCog />, path: '/admin/settings' },
  ];

  return (
    <aside className={`admin-panel-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-panel-sidebar-header">
        <div className="admin-panel-logo" onClick={() => navigate('/admin')}>
          {isCollapsed ? 'PB' : 'PustakBhandar'}
        </div>
        <button className="admin-panel-collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '>' : '<'}
        </button>
      </div>
      <nav className="admin-panel-nav">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </li>
          ))}
        </ul>
      </nav>
      <div className="admin-panel-sidebar-footer">
        <div className="admin-panel-logout" onClick={handleLogout}>
          <FaSignOutAlt />
          {!isCollapsed && <span>Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidePanel;