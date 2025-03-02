import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../styles/HomePage.css';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      fetchUserFavorites();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all books
        const booksResponse = await axios.get("http://localhost:5005/books");
        setBooks(booksResponse.data.books);
        setFilteredBooks(booksResponse.data.books);

        // Fetch categories
        const categoriesResponse = await axios.get("http://localhost:5005/categories");
        setCategories(categoriesResponse.data.categories);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error loading content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter books based on search term and category
    const filtered = books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? book.category?.id === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, books]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const fetchUserFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5005/favorites', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.favorites) {
        // Extract just the book IDs from the favorites array
        const favoriteBookIds = response.data.favorites.map(book => book.id);
        setFavorites(favoriteBookIds);
      } else {
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

  const handleFavoriteToggle = async (bookId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const isFavorite = favorites.includes(bookId);
      
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:5005/favorites/${bookId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setFavorites(favorites.filter(id => id !== bookId));
      } else {
        // Add to favorites
        await axios.post('http://localhost:5005/favorites', 
          { bookId },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setFavorites([...favorites, bookId]);
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-image"></div>
        <div className="hero-content">
          <h1>Explore a World of Knowledge with PustakBhandar</h1>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search for books..." 
              className="search-bar"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          <button 
            className={`category-card ${selectedCategory === "" ? "active" : ""}`}
            onClick={() => handleCategoryFilter("")}
          >
            All Books
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-card ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => handleCategoryFilter(category.id)}
            >
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="featured-books">
        <h2>{selectedCategory ? "Filtered Books" : "All Books"}</h2>
        <div className="books">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="book-item">
                <div className="book-cover">
                  <img 
                    src={book.coverImage ? `http://localhost:5005/${book.coverImage}` : '/default-book-cover.jpg'} 
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-book-cover.jpg';
                    }}
                  />
                  {isLoggedIn && (
                    <button
                      className={`favorite-btn ${favorites.includes(book.id) ? 'is-favorite' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleFavoriteToggle(book.id);
                      }}
                    >
                      {favorites.includes(book.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  )}
                  {book.category && (
                    <div className="category-badge">{book.category.name}</div>
                  )}
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">By {book.author}</p>
                  {book.category && (
                    <p className="category">{book.category.name}</p>
                  )}
                  <Link to={`/book/${book.id}`} className="read-more">Read More</Link>
                </div>
              </div>
            ))
          ) : (
            <p className="no-books">No books found matching your criteria.</p>
          )}
        </div>
      </section>

      <section className="why-us">
        <h2>Why PustakBhandar?</h2>
        <ul>
          <li>Wide variety of books across multiple categories</li>
          <li>Easy to navigate and search functionality</li>
          <li>Detailed book information and descriptions</li>
          <li>Regular updates with new titles</li>
        </ul>
      </section>

      <section className="call-to-action">
        <Link to="/books" className="browse-books-btn">Browse All Books</Link>
      </section>
    </div>
  );
};

export default HomePage;