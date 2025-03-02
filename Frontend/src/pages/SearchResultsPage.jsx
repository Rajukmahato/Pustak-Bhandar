import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/SearchResultsPage.css';

const SearchResultsPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Handle search input change
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5005/books/search`, {
        params: { query }
      });
      setResults(response.data.books);
      setError(""); // Clear any previous error
    } catch (error) {
      setError("Error fetching search results. Please try again.");
      setResults([]);
    }
  };

  return (
    <div className="search-results-page-container">
      <header className="header">
        <h1>Search Results</h1>
      </header>

      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="search-results">
        {results.length > 0 ? (
          results.map((book) => (
            <div key={book.id} className="book-card">
              <Link to={`/books/${book.id}`} className="book-link">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </section>
    </div>
  );
};

export default SearchResultsPage;