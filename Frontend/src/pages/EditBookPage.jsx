import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidePanel from '../components/AdminSidePanel';
import '../styles/EditBook.css';

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    categoryId: '',
    publisher: '',
    publicationDate: '',
    pageCount: '',
    isbn: '',
    coverImage: null
  });
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    fetchBook();
    fetchCategories();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/api/books/${id}`);
      const bookData = response.data.book;
      setBook(bookData);
      setFormData({
        title: bookData.title || '',
        author: bookData.author || '',
        description: bookData.description || '',
        categoryId: bookData.categoryId || '',
        publisher: bookData.publisher || '',
        publicationDate: bookData.publicationDate ? new Date(bookData.publicationDate).toISOString().split('T')[0] : '',
        pageCount: bookData.pageCount || '',
        isbn: bookData.isbn || ''
      });
      if (bookData.coverImage) {
        setCurrentImage(`http://localhost:5005/${bookData.coverImage}`);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book:', error);
      setMessage('Error loading book details');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Error loading categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'coverImage' && formData[key] === null) {
        return;
      }
      submitData.append(key, formData[key]);
    });

    try {
      await axios.put(`http://localhost:5005/api/admin/books/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Book updated successfully!');
      // Dispatch custom event for dashboard update
      window.dispatchEvent(new CustomEvent('bookDataChanged'));
      setTimeout(() => navigate('/admin/books'), 1500);
    } catch (error) {
      console.error('Error updating book:', error);
      setMessage('Error updating book. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-book-page-container">
      <AdminSidePanel />
      <div className="edit-book-main-content">
        <header className="edit-book-header">
          <h2>Edit Book</h2>
          <button className="back-btn" onClick={() => navigate('/admin/books')}>Back to Manage Books</button>
        </header>
        <form onSubmit={handleSubmit} className="edit-book-form">
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="publisher">Publisher</label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="publicationDate">Publication Date</label>
                <input
                  type="date"
                  id="publicationDate"
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pageCount">Page Count</label>
                <input
                  type="number"
                  id="pageCount"
                  name="pageCount"
                  value={formData.pageCount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="coverImage">Cover Image</label>
                {currentImage && (
                  <div className="current-image">
                    <img src={currentImage} alt="Current cover" />
                    <p>Current cover image</p>
                  </div>
                )}
                <input
                  type="file"
                  id="coverImage"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept="image/*"
                />
                <small>Leave empty to keep current image</small>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Update Book</button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/admin/books')}>Cancel</button>
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default EditBookPage; 