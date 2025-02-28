import React from "react";
import '../styles/AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-page-container">
      <header className="header">
        <h1>About Us</h1>
      </header>

      <section className="about-content">
        <h2>Welcome to PustakBhandar – Your Gateway to Books!</h2>
        <p>
          PustakBhandar is an online platform designed to help book lovers explore a vast collection of books. Whether you're looking for fiction, non-fiction, or academic materials, our website provides detailed information about each book to help you make informed choices.
        </p>
      </section>

      <section className="mission-vision">
        <h2>Our Mission & Vision</h2>
        <p><strong>Mission:</strong> Our mission is to provide easy access to information about books, allowing users to explore and discover a wide range of literature.</p>
        <p><strong>Vision:</strong> We envision a world where every reader can easily find the books they love without any hassle.</p>
      </section>

      <section className="why-choose-us">
        <h2>Why Choose PustakBhandar?</h2>
        <ul>
          <li>User-Friendly Interface – Easy-to-navigate website.</li>
          <li>Wide Range of Books – Covers various genres and topics.</li>
          <li>No Buying Hassle – Focused purely on book exploration.</li>
          <li>Regular Updates – Constantly updated book database.</li>
        </ul>
      </section>

      <section className="meet-our-team">
        <h2>Meet Our Team</h2>
        <p>PustakBhandar was created by passionate book lovers and tech enthusiasts who wanted to make book discovery easier for everyone.</p>
        {/* Add team member photos & short bios here if needed */}
      </section>

      <section className="call-to-action">
        <h2>Ready to discover amazing books?</h2>
        <a href="/books" className="cta-button">Browse Books</a>
      </section>
    </div>
  );
};

export default AboutUsPage;