import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/BookPage.css';

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5005/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch books with pagination, search, and filtering
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5005/books`, {
          params: {
            page: currentPage,
            limit: 12,
            search: searchQuery,
            categoryId: selectedCategoryId
          }
        });
        setBooks(response.data.books);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [currentPage, searchQuery, selectedCategoryId]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle category filter
  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="book-page-container">
      <header className="header">
        <h1>All Books</h1>
        
        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>

          <select
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <Link to={`/book/${book.id}`}>
              <img
                src={book.coverImage || '/default-book-cover.jpg'}
                alt={book.title}
                className="book-cover"
              />
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                {book.category && (
                  <p className="book-category">{book.category.name}</p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookPage;