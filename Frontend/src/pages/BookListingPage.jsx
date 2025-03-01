import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import '../styles/BookListingPage.css';
import { FaStar, FaRegStar, FaComment } from 'react-icons/fa';

const BookListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'title');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      fetchUserFavorites();
    } else {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
    // Update URL params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy) params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage);
    setSearchParams(params);
  }, [currentPage, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    if (books.length > 0) {
      fetchReviews();
    }
  }, [books]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // Simplified sort parameter
      const response = await axios.get('http://localhost:5005/api/books', {
        params: {
          page: currentPage,
          limit: 12,
          search: searchTerm,
          categoryId: selectedCategory,
          sortBy // Send sortBy directly as the backend expects
        }
      });
      
      if (!response.data || !response.data.books) {
        throw new Error('Invalid response format');
      }

      // Sort books locally if needed
      let sortedBooks = [...response.data.books];
      
      switch (sortBy) {
        case 'title':
          sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'author':
          sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
          break;
        case 'recent':
          sortedBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
      }

      setBooks(sortedBooks);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (error) {
      console.error('Error fetching books:', error);
      setError("Error fetching books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5005/api/users/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data.favorites)) {
        setFavorites(response.data.favorites);
      } else {
        console.error('Invalid favorites data format:', response.data);
        setFavorites([]);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setFavorites([]);
      }
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const bookIds = books.map(book => book.id);
      const response = await axios.get('http://localhost:5005/api/reviews/summary', {
        params: { bookIds: bookIds.join(',') }
      });
      
      if (response.data && response.data.reviews) {
        setReviews(response.data.reviews);
      } else {
        console.error('Invalid reviews data format:', response.data);
        setReviews({});
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews({});
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavorite = async (bookId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const isFavorite = favorites.includes(bookId);
      const endpoint = `http://localhost:5005/api/users/${isFavorite ? 'remove-favorite' : 'add-favorite'}`;
      
      const response = await axios.post(endpoint, 
        { bookId },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        await fetchUserFavorites(); // Refresh favorites list
      } else {
        console.error('Failed to update favorite:', response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setFavorites([]);
        navigate('/signin');
      }
      console.error('Error updating favorites:', error);
    }
  };

  const handleReviewClick = (bookId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    setSelectedBookId(bookId);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowReviewModal(false);
      navigate('/signin');
      return;
    }

    try {
      if (!rating || !reviewText.trim()) {
        console.error('Rating and review text are required');
        return;
      }

      const response = await axios.post('http://localhost:5005/api/reviews', {
        bookId: selectedBookId,
        rating,
        text: reviewText.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await fetchReviews(); // Refresh reviews
        setShowReviewModal(false);
        setReviewText('');
        setRating(0);
        setSelectedBookId(null);
      } else {
        console.error('Failed to submit review:', response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setShowReviewModal(false);
        navigate('/signin');
      }
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? <FaStar key={i} className="star-filled" /> : <FaRegStar key={i} className="star-empty" />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="book-listing-container">
      <header className="book-listing-header">
        <h1>Browse Books</h1>
        <div className="book-listing-search-filters">
          <form onSubmit={handleSearch} className="book-listing-search-form">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="book-listing-search-input"
            />
            <button type="submit" className="book-listing-search-btn">Search</button>
          </form>

          <div className="book-listing-filters">
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="book-listing-category-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className="book-listing-sort-select"
            >
              <option value="title">Sort by Title (A-Z)</option>
              <option value="author">Sort by Author (A-Z)</option>
              <option value="recent">Sort by Recently Added</option>
            </select>

            <div className="book-listing-view-toggle">
              <button 
                className={`book-listing-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={`book-listing-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="book-listing-error">
          <p>{error}</p>
          <button onClick={fetchBooks} className="book-listing-retry-btn">Retry</button>
        </div>
      )}

      <section className={viewMode === 'list' ? 'book-listing-list-view' : 'book-listing-grid'}>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className={viewMode === 'list' ? 'book-listing-list-item' : 'book-listing-grid-item'}>
              <div className={viewMode === 'list' ? 'book-listing-list-cover' : 'book-listing-grid-cover'}>
                <img 
                  src={book.coverImage ? `http://localhost:5005/${book.coverImage}` : '/default-book-cover.jpg'} 
                  alt={book.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-book-cover.jpg';
                  }}
                />
                {book.category && (
                  <div className="book-listing-category-badge">{book.category.name}</div>
                )}
              </div>
              <div className={viewMode === 'list' ? 'book-listing-list-info' : 'book-listing-grid-info'}>
                <h3>{book.title}</h3>
                <p className="book-listing-author">By {book.author}</p>
                <p className="book-listing-description">{book.description ? `${book.description.slice(0, 150)}...` : 'No description available'}</p>
                
                <div className="book-listing-rating">
                  <div className="stars">
                    {renderStars(reviews[book.id]?.averageRating || 0)}
                  </div>
                  <span className="review-count">
                    {reviews[book.id]?.totalReviews || 0} reviews
                  </span>
                </div>

                <div className="book-listing-meta">
                  <span>{book.pageCount || 'N/A'} pages</span>
                  <span>{book.publisher || 'Unknown publisher'}</span>
                </div>

                {isLoggedIn && (
                  <div className="book-listing-actions">
                    <button
                      className={`book-listing-favorite-btn ${favorites.includes(book.id) ? 'active' : ''}`}
                      onClick={() => handleFavorite(book.id)}
                    >
                      {favorites.includes(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    <button
                      className="book-listing-review-btn"
                      onClick={() => handleReviewClick(book.id)}
                    >
                      <FaComment /> Write a Review
                    </button>
                  </div>
                )}
                <Link to={`/book/${book.id}`} className="book-listing-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="book-listing-no-results">
            <h3>No Books Found</h3>
            <p>Try adjusting your search criteria</p>
            <button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSortBy('title');
              setCurrentPage(1);
            }} className="book-listing-clear-btn">
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="book-listing-modal-overlay">
          <div className="book-listing-modal">
            <h3>Write a Review</h3>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer' }}
                >
                  {star <= rating ? <FaStar className="star-filled" /> : <FaRegStar className="star-empty" />}
                </span>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button onClick={handleSubmitReview} disabled={!rating || !reviewText.trim()}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="book-listing-pagination">
          <button 
            className="book-listing-page-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  className={`book-listing-page-btn ${pageNumber === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return <span key={pageNumber} className="book-listing-page-dots">...</span>;
            }
            return null;
          })}

          <button 
            className="book-listing-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookListingPage;