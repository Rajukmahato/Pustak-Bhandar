import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/BookPage.css';

const BookPage = () => {
  const [books, setBooks] = useState([]);

  // Fetch all books from the backend API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5005/books");
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="book-page-container">
      <header className="header">
        <h1>All Books</h1>
      </header>

      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/books">Books</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/faqs">FAQs</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>

      <section className="book-list">
        <div className="books">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-item">
                <img src={book.coverImage || 'default-image.jpg'} alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.description.slice(0, 100)}...</p>
                <Link to={`/books/${book.id}`}>Read More</Link>
              </div>
            ))
          ) : (
            <p>No books available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookPage;