import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch book details
        const response = await axios.get(`http://localhost:5005/api/books/${bookId}`);
        if (!response.data || !response.data.book) {
          throw new Error('Book not found');
        }
        setBook(response.data.book);

        // Fetch related books from the same category
        if (response.data.book.categoryId) {
          const relatedResponse = await axios.get(`http://localhost:5005/api/books`, {
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
        <h1>{book.title}</h1>
        <p className="author-header">By {book.author}</p>
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
    </div>
  );
};

export default BookDetailPage;