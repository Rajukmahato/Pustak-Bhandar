import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaComment, FaUser, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import '../styles/BookDetailPage.css';

const BookDetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('details');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch book details
        const response = await axios.get(`http://localhost:5005/books/${bookId}`);
        if (!response.data || !response.data.book) {
          throw new Error('Book not found');
        }
        setBook(response.data.book);

        // Check if book is in favorites if user is logged in
        if (token) {
          try {
            const favResponse = await axios.get(`http://localhost:5005/favorites/${bookId}/check`, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            setIsFavorite(favResponse.data.isFavorite);
          } catch (error) {
            if (error.response?.status === 401) {
              localStorage.removeItem('token');
              setIsLoggedIn(false);
              setIsFavorite(false);
            }
            console.error('Error checking favorite status:', error);
          }
        }

        // Fetch related books from the same category
        if (response.data.book.categoryId) {
          const relatedResponse = await axios.get(`http://localhost:5005/books`, {
            params: {
              categoryId: response.data.book.categoryId,
              limit: 6, // Increased limit to 6 related books
              exclude: bookId
            }
          });
          
          // Filter out the current book and sort by title
          const filteredBooks = relatedResponse.data.books
            .filter(b => b.id !== bookId)
            .sort((a, b) => a.title.localeCompare(b.title));
          setRelatedBooks(filteredBooks);
        }

        fetchReviews();
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError(error.response?.data?.message || error.message || "Error fetching book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5005/reviews/book/${bookId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setReviews(response.data.reviews);
        setAverageRating(response.data.averageRating);
      } else {
        console.error('Error in response:', response.data);
        setReviews([]);
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setAverageRating(0);
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowReviewModal(false);
      navigate('/signin');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5005/reviews/book/', {
        bookId: parseInt(bookId),
        rating,
        text: reviewText
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        await fetchReviews();
        setShowReviewModal(false);
        setReviewText('');
        setRating(0);
      } else {
        console.error('Error in response:', response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setShowReviewModal(false);
        navigate('/signin');
      } else if (error.response?.status === 400) {
        // Handle case where user has already reviewed
        alert(error.response.data.message || 'You have already reviewed this book');
      }
      console.error('Error submitting review:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:5005/favorites/${bookId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Add to favorites
        await axios.post('http://localhost:5005/favorites', 
          { bookId: parseInt(bookId) }, // Ensure bookId is a number
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsFavorite(false);
        navigate('/signin');
      } else if (error.response?.status === 400) {
        console.error('Invalid request:', error.response?.data?.message);
      }
      console.error('Error toggling favorite:', error);
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
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 300) => {
    if (!text) return 'No description available';
    if (text.length <= maxLength) return text;
    return showFullDescription ? text : `${text.substring(0, maxLength)}...`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-to-listing-btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="not-found">
        <h2>Book Not Found</h2>
        <p>The book you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate(-1)} className="back-to-listing-btn">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="book-detail-page-container">
      <header className="header">
        <div className="header-content">
          <h1>{book.title}</h1>
          <p className="author-header">By {book.author}</p>
          <button 
            className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
            onClick={handleFavoriteToggle}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </header>

      <section className="book-detail">
        <div className="book-cover">
          <img 
            src={book.coverImage ? `http://localhost:5005/${book.coverImage}` : '/default-book-cover.jpg'} 
            alt={book.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-book-cover.jpg';
            }}
          />
          {book.category && (
            <div className="book-category-badge">
              {book.category.name}
            </div>
          )}
        </div>

        <div className="book-info">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
            {book.category && (
              <button 
                className={`tab ${activeTab === 'category' ? 'active' : ''}`}
                onClick={() => setActiveTab('category')}
              >
                Category Info
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === 'details' && (
              <div className="details-content">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Author</label>
                    <span>{book.author}</span>
                  </div>
                  <div className="info-item">
                    <label>Publisher</label>
                    <span>{book.publisher || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <label>Publication Date</label>
                    <span>{formatDate(book.publicationDate)}</span>
                  </div>
                  <div className="info-item">
                    <label>Page Count</label>
                    <span>{book.pageCount || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <label>ISBN</label>
                    <span>{book.isbn || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <label>Language</label>
                    <span>{book.language || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'description' && (
              <div className="description-content">
                <p>{truncateText(book.description)}</p>
                {book.description && book.description.length > 300 && (
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <div className="reviews-header">
                  <h2>Reviews</h2>
                  {isLoggedIn && (
                    <button
                      className="write-review-btn"
                      onClick={() => setShowReviewModal(true)}
                    >
                      <FaComment /> Write a Review
                    </button>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="review-user">
                            <FaUser className="user-icon" />
                            <span>{review.user.name}</span>
                          </div>
                          <div className="review-meta">
                            <div className="review-stars">
                              {renderStars(review.rating)}
                            </div>
                            <div className="review-date">
                              <FaClock className="clock-icon" />
                              <span>{formatDate(review.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    <p>No reviews yet. {isLoggedIn ? 'Be the first to review!' : 'Sign in to be the first to review!'}</p>
                    {!isLoggedIn && (
                      <Link to="/signin" className="signin-link">
                        Sign In to Write a Review
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'category' && book.category && (
              <div className="category-content">
                <h3>{book.category.name}</h3>
                <p>{book.category.description}</p>
                <Link to={`/books?category=${book.category.id}`} className="browse-category-btn">
                  Browse More in This Category
                </Link>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={() => navigate(-1)} className="back-to-listing-btn">
              Back to Listings
            </button>
            <Link to={`/books?category=${book.category?.id}`} className="browse-similar-btn">
              Find Similar Books
            </Link>
          </div>
        </div>
      </section>

      {relatedBooks.length > 0 && (
        <section className="related-books">
          <h3>More Books in {book.category?.name}</h3>
          <div className="related-books-grid">
            {relatedBooks.map((relatedBook) => (
              <Link 
                to={`/books/${relatedBook.id}`} 
                key={relatedBook.id} 
                className="related-book-card"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <img 
                  src={relatedBook.coverImage ? `http://localhost:5005/${relatedBook.coverImage}` : '/default-book-cover.jpg'} 
                  alt={relatedBook.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-book-cover.jpg';
                  }}
                />
                <div className="related-book-info">
                  <h4>{relatedBook.title}</h4>
                  <p>By {relatedBook.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showReviewModal && (
        <div className="book-detail-modal-overlay">
          <div className="book-detail-modal">
            <h3>Write a Review for {book.title}</h3>
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
              placeholder="Share your thoughts about this book..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button 
                onClick={handleSubmitReview}
                disabled={!rating || !reviewText.trim()}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;