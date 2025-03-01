import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../styles/FavoritesPage.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchFavorites();
  }, [navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5005/api/favorites', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.favorites) {
        setFavorites(response.data.favorites);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/signin');
        return;
      }
      setError('Failed to load favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      await axios.delete(`http://localhost:5005/api/favorites/${bookId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update the favorites list
      setFavorites(favorites.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/signin');
        return;
      }
      setError('Failed to remove from favorites. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading">Loading your favorites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <header className="favorites-header">
        <h1><FaHeart className="heart-icon" /> My Favorite Books</h1>
      </header>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p><FaRegHeart className="empty-heart-icon" /> You haven't added any books to your favorites yet.</p>
          <Link to="/books" className="browse-books-btn">Browse Books</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((book) => (
            <div key={book.id} className="favorite-book-card">
              <div className="favorite-book-image">
                <img 
                  src={book.coverImage ? `http://localhost:5005/${book.coverImage}` : '/default-book-cover.jpg'} 
                  alt={book.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-book-cover.jpg';
                  }}
                />
                <button
                  className="favorite-btn is-favorite"
                  onClick={() => handleRemoveFromFavorites(book.id)}
                  title="Remove from favorites"
                >
                  <FaHeart />
                </button>
                {book.category && (
                  <div className="category-badge">{book.category.name}</div>
                )}
              </div>
              <div className="favorite-book-info">
                <Link to={`/book/${book.id}`}>
                  <h3>{book.title}</h3>
                </Link>
                <p className="author">By {book.author}</p>
                {book.description && (
                  <p className="description">
                    {book.description.length > 150 
                      ? `${book.description.substring(0, 150)}...` 
                      : book.description}
                  </p>
                )}
                {book.category && (
                  <p className="category">{book.category.name}</p>
                )}
                <Link to={`/book/${book.id}`} className="read-more">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 