import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageCategoriesPage.css';
import AdminSidePanel from '../components/AdminSidePanel';

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, [searchQuery, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5005/categories', {
        params: {
          search: searchQuery,
          page: currentPage,
          limit: 10,
        },
      });
      const sortedCategories = response.data.categories.sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setCategories(sortedCategories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCategory = async () => {
    try {
      await axios.post('http://localhost:5005/categories', { name: newCategoryName, description: newCategoryDescription });
      setNewCategoryName('');
      setNewCategoryDescription('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category', error);
    }
  };

  const handleEditCategory = async (id, newName, newDescription) => {
    try {
      await axios.put(`http://localhost:5005/categories/${id}`, { name: newName, description: newDescription });
      fetchCategories();
    } catch (error) {
      console.error('Error editing category', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`http://localhost:5005/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category', error);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    
    <div className="manage-categories-container">
      <AdminSidePanel />
      <div className="main-content">
        <header className="header">
          <h1>Manage Categories</h1>
        </header>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by category name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <input
            type="text"
            placeholder="New category description"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
          />
          <button onClick={handleAddCategory}>Add Category</button>
        </div>
        <div className="manage-categories-table-container">
          <div className="manage-categories-table-scroll">
            <table className="manage-categories-table">
              <thead>
                <tr className="manage-categories-table-header-row">
                  <th>No.</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id} className="manage-categories-table-row">
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEditCategory(category.id, prompt('New name:', category.name), prompt('New description:', category.description))}>Edit</button>
                      <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
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

export default ManageCategoriesPage;