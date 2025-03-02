import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminSidePanel from '../components/AdminSidePanel';
import '../styles/AdminDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [booksPerCategory, setBooksPerCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Create a memoized fetchCounts function that can be called from multiple places
  const fetchCounts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch all data in parallel for better performance
      const [booksResponse, usersResponse, categoriesResponse, booksPerCategoryResponse] = await Promise.all([
        axios.get('http://localhost:5005/books/count'),
        axios.get('http://localhost:5005/users/count', config),
        axios.get('http://localhost:5005/categories/count'),
        axios.get('http://localhost:5005/books/categories', config)
      ]);
      
      setTotalBooks(booksResponse.data.count);
      setTotalUsers(usersResponse.data.count);
      setTotalCategories(categoriesResponse.data.count);

      // Log the raw response to check the data structure
      console.log('📊 Raw API Response:', booksPerCategoryResponse.data);

      // Transform the array of category objects into an object with categoryName as key and count as value
      const categoryData = booksPerCategoryResponse.data.reduce((acc, category) => {
        acc[category.categoryName] = parseInt(category.count, 10);
        return acc;
      }, {});

      console.log('📊 Transformed category data:', categoryData);
      setBooksPerCategory(categoryData);
      
    } catch (error) {
      console.error('❌ Error fetching counts:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Add a useEffect to log whenever booksPerCategory changes
  useEffect(() => {
    console.log('Current booksPerCategory state:', booksPerCategory);
  }, [booksPerCategory]);

  // Effect for initial load and auto-refresh
  useEffect(() => {
    fetchCounts();

    // Set up auto-refresh interval
    const refreshInterval = setInterval(fetchCounts, 30000); // Refresh every 30 seconds

    // Add event listener for book data changes
    const handleBookDataChange = () => {
      console.log('Book data changed, refreshing dashboard...');
      fetchCounts();
    };

    window.addEventListener('bookDataChanged', handleBookDataChange);

    // Cleanup interval and event listener on component unmount
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('bookDataChanged', handleBookDataChange);
    };
  }, [fetchCounts]);

  // Effect to handle updates when returning from other admin pages
  useEffect(() => {
    // Check if we're returning from book creation/edit/delete
    if (location.state?.bookUpdated || location.state?.bookCreated || location.state?.bookDeleted) {
      fetchCounts();
      // Clear the state after handling
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, fetchCounts, navigate]);

  // Listen for storage events (in case other tabs update the data)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'bookUpdated' || e.key === 'bookCreated' || e.key === 'bookDeleted') {
        fetchCounts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCounts]);

  const chartData = {
    labels: Object.keys(booksPerCategory),
    datasets: [
      {
        label: 'Number of Books',
        data: Object.values(booksPerCategory),
        backgroundColor: [
          'rgba(106, 13, 173, 0.7)',   // Primary Purple
          'rgba(255, 99, 132, 0.7)',    // Pink
          'rgba(54, 162, 235, 0.7)',    // Blue
          'rgba(255, 206, 86, 0.7)',    // Yellow
          'rgba(75, 192, 192, 0.7)',    // Teal
          'rgba(153, 102, 255, 0.7)',   // Light Purple
          'rgba(255, 159, 64, 0.7)',    // Orange
          'rgba(201, 203, 207, 0.7)',   // Grey
          'rgba(255, 99, 71, 0.7)',     // Tomato
          'rgba(50, 205, 50, 0.7)'      // Lime Green
        ],
        borderColor: [
          'rgb(106, 13, 173)',         // Primary Purple
          'rgb(255, 99, 132)',         // Pink
          'rgb(54, 162, 235)',         // Blue
          'rgb(255, 206, 86)',         // Yellow
          'rgb(75, 192, 192)',         // Teal
          'rgb(153, 102, 255)',        // Light Purple
          'rgb(255, 159, 64)',         // Orange
          'rgb(201, 203, 207)',        // Grey
          'rgb(255, 99, 71)',          // Tomato
          'rgb(50, 205, 50)'           // Lime Green
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverOffset: 4,
        hoverBorderWidth: 3,
        barThickness: 35,
        maxBarThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    layout: {
      padding: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 25
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Distribution of Books Across Categories',
        font: {
          size: 16,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          weight: 'bold'
        },
        padding: {
          top: 5,
          bottom: 15
        },
        color: '#4b0082'
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(75, 0, 130, 0.9)',
        titleFont: {
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          size: 11
        },
        padding: 8,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y || 0;
            return `${value} book${value !== 1 ? 's' : ''}`;
          },
          title: (context) => {
            return `Category: ${context[0].label}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        border: {
          display: true,
          color: '#4b0082',
          width: 1
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          },
          padding: 5,
          callback: (value) => `${value} book${value !== 1 ? 's' : ''}`,
          color: '#4b0082'
        }
      },
      x: {
        grid: {
          display: false
        },
        border: {
          display: true,
          color: '#4b0082',
          width: 1
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8,
          color: '#4b0082',
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            // If label is longer than 15 characters, truncate it
            return label.length > 15 ? label.substr(0, 15) + '...' : label;
          }
        }
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    }
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
          <div className="chart-container">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;