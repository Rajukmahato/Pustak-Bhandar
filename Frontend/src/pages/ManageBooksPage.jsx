import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidePanel from '../components/AdminSidePanel';
import '../styles/ManageBooksPage.css';

const ManageBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [searchQuery, categoryFilter, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/categories');
      // Sort categories alphabetically
      const sortedCategories = response.data.categories.sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/books', {
        params: {
          search: searchQuery,
          categoryId: categoryFilter,
          page: currentPage,
          limit: 10,
        },
      });
      // Sort books alphabetically by title
      const sortedBooks = response.data.books.sort((a, b) => 
        a.title.localeCompare(b.title)
      );
      setBooks(sortedBooks);
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
        // Dispatch custom event for dashboard update
        window.dispatchEvent(new CustomEvent('bookDataChanged'));
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
            placeholder="Search by title or author"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select value={categoryFilter} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={category.id} value={category.id}>
                {`${category.name}`}
              </option>
            ))}
          </select>
          <button onClick={() => navigate('/admin/create-book')}>Add New Book</button>
        </div>
        <div className="table-container">
          <div className="table-scroll-container">
            <table className="books-table">
              <thead>
                <tr className="manage-books-table-header-row">
                  <th>No.</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Cover Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.id} className="manage-books-table-row">
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category?.name || 'Uncategorized'}</td>
                    <td>{book.description}</td>
                    <td>
                      {book.coverImage ? (
                        <a 
                          href={`http://localhost:5005/${book.coverImage}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <img 
                            src={`http://localhost:5005/${book.coverImage}`} 
                            alt={book.title}
                          />
                        </a>
                      ) : (
                        <img 
                          src="/default-image.jpg" 
                          alt="Default cover"
                        />
                      )}
                    </td>
                    <td>
                      <button onClick={() => navigate(`/admin/edit-book/${book.id}`)}>Edit</button>
                      <button onClick={() => handleDelete(book.id)}>Delete</button>
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

export default ManageBooksPage;