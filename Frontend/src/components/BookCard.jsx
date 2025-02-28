import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img src={book.coverImage || 'default-image.jpg'} alt={book.title} />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>{book.description.slice(0, 100)}...</p>
      <Link to={`/books/${book.id}`}>Read More</Link>
    </div>
  );
};

export default BookCard;