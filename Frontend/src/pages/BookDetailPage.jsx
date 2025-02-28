import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import '../styles/BookDetailPage.css';

const BookDetailPage = () => {
  const { bookId } = useParams(); // Get book ID from URL
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [error, setError] = useState("");

  // Fetch book details from the backend using the book ID
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/books/${bookId}`);
        setBook(response.data.book);
        // Fetch related books
        const relatedResponse = await axios.get(`http://localhost:5005/books?category=${response.data.book.genre}`);
        setRelatedBooks(relatedResponse.data.books.filter(b => b.id !== bookId));
      } catch (error) {
        setError("Error fetching book details. Please try again later.");
      }
    };
    fetchBookDetails();
  }, [bookId]);

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-detail-page-container">
      <header className="header">
        <h1>Book Details</h1>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="book-detail">
        <div className="book-cover">
          <img src={book.coverImage || 'default-image.jpg'} alt={book.title} />
        </div>
        <div className="book-info">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Publisher:</strong> {book.publisher}</p>
          <p><strong>Publication Date:</strong> {book.publicationDate}</p>
          <p><strong>Description:</strong> {book.description}</p>
          <p><strong>Page Count:</strong> {book.pageCount}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <Link to="/books" className="back-to-listing-btn">Back to Listings</Link>
        </div>
      </section>

      <section className="related-books">
        <h2>Related Books</h2>
        <div className="related-books-list">
          {relatedBooks.map((relatedBook) => (
            <div key={relatedBook.id} className="related-book-item">
              <img src={relatedBook.coverImage || 'default-image.jpg'} alt={relatedBook.title} />
              <h3>{relatedBook.title}</h3>
              <p>{relatedBook.author}</p>
              <Link to={`/books/${relatedBook.id}`}>Read More</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BookDetailPage;