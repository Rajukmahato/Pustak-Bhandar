import React from 'react';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
    <nav>
      <ul>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/faqs">FAQs</Link></li>
      </ul>
    </nav>
    <p>&copy; 2025 PustakBhandar. All rights reserved.</p>
    </footer>
    
  );
};

export default Footer;