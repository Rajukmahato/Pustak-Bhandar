import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageReviewsPage.css';
import AdminSidePanel from '../components/AdminSidePanel';
import { FaStar, FaRegStar, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ManageReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState('');
  const [books, setBooks] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBooks();
    fetchReviews();
  }, [searchQuery, currentPage, selectedBook]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5005/books');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchQuery,
        bookId: selectedBook
      };

      const response = await axios.get('http://localhost:5005/reviews', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Error fetching reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleBookFilterChange = (e) => {
    setSelectedBook(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://localhost:5005/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Error deleting review');
      }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="manage-reviews-container">
      <AdminSidePanel />
      <div className="main-content">
        <header className="header">
          <h1>Manage Reviews</h1>
        </header>
        <div className="controls">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select value={selectedBook} onChange={handleBookFilterChange}>
            <option value="">All Books</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : (
          <>
            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="review-info">
                        <h3>{review.book?.title}</h3>
                        <p className="review-meta">
                          by {review.user?.name} • {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <div className="review-actions">
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  <p>No reviews found</p>
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageReviewsPage; 