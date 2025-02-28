import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminSidePanel from '../components/AdminSidePanel';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [booksPerCategory, setBooksPerCategory] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const booksResponse = await axios.get('http://localhost:5005/api/books/count');
        const usersResponse = await axios.get('http://localhost:5005/api/users/count');
        const categoriesResponse = await axios.get('http://localhost:5005/api/categories/count');
        const booksPerCategoryResponse = await axios.get('http://localhost:5005/api/books/categories');
        
        setTotalBooks(booksResponse.data.count);
        setTotalUsers(usersResponse.data.count);
        setTotalCategories(categoriesResponse.data.count);
        setBooksPerCategory(booksPerCategoryResponse.data);
      } catch (error) {
        console.error('Error fetching counts', error);
      }
    };
    fetchCounts();
  }, []);

  const chartData = {
    labels: Object.keys(booksPerCategory),
    datasets: [
      {
        label: 'Books per Category',
        data: Object.values(booksPerCategory),
        backgroundColor: 'rgba(106, 13, 173, 0.6)',
        borderColor: 'rgba(106, 13, 173, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidePanel />
      <div className="main-content">
        <header className="header">
          <h1>Admin Dashboard</h1>
        </header>
        <section className="stats-section">
          <div className="stat-card">
            <h2>Total Books</h2>
            <p>{totalBooks}</p>
          </div>
          <div className="stat-card">
            <h2>Total Users</h2>
            <p>{totalUsers}</p>
          </div>
          <div className="stat-card">
            <h2>Total Categories</h2>
            <p>{totalCategories}</p>
          </div>
        </section>
        <section className="graph-section">
          <h2>Books Per Category</h2>
          <Bar data={chartData} />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;