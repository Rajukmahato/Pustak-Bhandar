import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/BookListingPage.css';

const BookListingPage = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all books from the backend with pagination
  useEffect(() => {
    const fetchBooks = async (page) => {
      try {
        const response = await axios.get(`http://localhost:5005/books?page=${page}`);
        setBooks(response.data.books);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError("Error fetching books. Please try again later.");
      }
    };
    fetchBooks(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="book-listing-page-container">
      <header className="header">
        <h1>Book Listing</h1>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.coverImage || 'default-image.jpg'} alt={book.title} className="book-cover" />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.description.slice(0, 100)}...</p>
              <Link to={`/book/${book.id}`} className="view-details-btn">View Details</Link>
            </div>
          ))
        ) : (
          <p>No books available at the moment.</p>
        )}
      </section>

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
    </div>
  );
};

export default BookListingPage;