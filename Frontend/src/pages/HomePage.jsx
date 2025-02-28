import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/HomePage.css';

const HomePage = () => {
  const [books, setBooks] = useState([]);

  // Fetch the books from the backend API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/books");
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-image">
          
        </div>
        <div className="hero-content">
          <h1>Explore a World of Knowledge with PustakBhandar</h1>
          <input type="text" placeholder="Search for books..." className="search-bar" />
        </div>
      </section>

      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="books">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-item">
                <img src={book.coverImage || 'default-image.jpg'} alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <Link to={`/books/${book.id}`}>Read More</Link>
              </div>
            ))
          ) : (
            <p>No books available at the moment.</p>
          )}
        </div>
      </section>

      <section className="categories">
        <h2>Categories</h2>
        <div className="category-cards">
          <div className="category-card">Fiction</div>
          <div className="category-card">Non-Fiction</div>
          <div className="category-card">Educational</div>
          <div className="category-card">History</div>
          <div className="category-card">Science</div>
        </div>
      </section>

      <section className="why-us">
        <h2>Why PustakBhandar?</h2>
        <ul>
          <li>Wide variety of books</li>
          <li>Easy to navigate</li>
          <li>Detailed book information</li>
        </ul>
      </section>

      <section className="call-to-action">
        <Link to="/books" className="browse-books-btn">Browse Books</Link>
      </section>
    </div>
  );
};

export default HomePage;