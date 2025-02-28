import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidePanel from '../components/AdminSidePanel';
import '../styles/CreateBook.css';

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [isbn, setIsbn] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);
    formData.append('genre', genre);
    formData.append('publisher', publisher);
    formData.append('publicationDate', publicationDate);
    formData.append('pageCount', pageCount);
    formData.append('isbn', isbn);
    formData.append('coverImage', coverImage);

    // Log the data being sent
    console.log('Form Data:', {
      title,
      author,
      description,
      genre,
      publisher,
      publicationDate,
      pageCount,
      isbn,
      coverImage
    });
    try {
      const response = await axios.post('http://localhost:5005/api/admin/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Book created successfully!');
      setTitle('');
      setAuthor('');
      setDescription('');
      setGenre('');
      setPublisher('');
      setPublicationDate('');
      setPageCount('');
      setIsbn('');
      setCoverImage(null);
      fileInputRef.current.value = null; // Clear the file input
    } catch (error) {
      setMessage('Error creating book. Please try again.');
    }
  };

  return (
    <div className="create-book-page-container">
      <AdminSidePanel />
      <div className="create-book-main-content">
        <header className="create-book-header">
          <h2>Create a New Book</h2>
          <button className="back-btn" onClick={() => navigate('/admin/books')}>Back to Manage Books</button>
        </header>
        <form onSubmit={handleSubmit} className="create-book-form">
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <input
                  type="text"
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="publisher">Publisher</label>
                <input
                  type="text"
                  id="publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="publicationDate">Publication Date</label>
                <input
                  type="date"
                  id="publicationDate"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pageCount">Page Count</label>
                <input
                  type="number"
                  id="pageCount"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="coverImage">Cover Image</label>
                <input
                  type="file"
                  id="coverImage"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required
                />
              </div>
            </div>
          </div>
          <button type="submit" className="submit-btn">Create Book</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateBook;