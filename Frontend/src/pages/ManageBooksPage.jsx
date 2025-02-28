import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidePanel from '../components/AdminSidePanel';
import '../styles/ManageBooksPage.css';

const ManageBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, categoryFilter, currentPage]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/books', {
        params: {
          search: searchQuery,
          category: categoryFilter,
          page: currentPage,
          limit: 10,
        },
      });
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching books', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5005/api/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book', error);
      }
    }
  };

  return (
    <div className="manage-books-page-container">
      <AdminSidePanel />
      <div className="main-content">
        <header className="header">
          <h1>Manage Books</h1>
        </header>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by title, author, or category"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select value={categoryFilter} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {/* Add options for categories dynamically */}
          </select>
          <button onClick={() => navigate('/admin/create-book')}>Add New Book</button>
        </div>
        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Description</th>
              <th>Cover Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.description}</td>
                <td>
                  <img src={book.coverImage || 'default-image.jpg'} alt={book.title} />
                </td>
                <td>
                  <button onClick={() => navigate(`/edit-book/${book.id}`)}>Edit</button>
                  <button onClick={() => handleDelete(book.id)}>Delete</button>
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
  );
};

export default ManageBooksPage;