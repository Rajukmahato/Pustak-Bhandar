import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContactUsPage.css';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5005/contacts', formData);
      console.log('Form submitted', response.data);
      alert('Thank you! We will contact you soon.');
      // Clear the form fields
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <>
      <div className="contact-us-container">
        <section className="contact-hero">
          <h1>Get in Touch with Us!</h1>
          <p>Have a question, suggestion, or need assistance? We're here to help! Fill out the form below, and we’ll get back to you as soon as possible.</p>
        </section>
        <section className="contact-form-section">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </section>
        <section className="contact-details">
          <h2>Contact Details</h2>
          <p><strong>Email:</strong> support@pustakbhandar.com</p>
          <p><strong>Phone:</strong> +977-9815851974</p>
          <p><strong>Address:</strong> Kathmandu, Nepal</p>
        </section>
        <section className="social-media">
          <h2>Follow us on social media for updates!</h2>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </section>
      </div>
    </>
  );
};

export default ContactUsPage;