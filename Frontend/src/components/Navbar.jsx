import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  return (
    <header className="navbar-header">
      <div className="navbar-logo">PustakBhandar</div>
      <nav className="navbar">
        <ul className="navbar-list">
          <li className={`navbar-item ${location.pathname === '/' ? 'navbar-active' : ''}`}>
            <Link to="/">Home</Link>
          </li>
          <li className={`navbar-item ${location.pathname === '/books' ? 'navbar-active' : ''}`}>
            <Link to="/books">Books</Link>
          </li>
          {isLoggedIn && (
            <li className={`navbar-item ${location.pathname === '/favorites' ? 'navbar-active' : ''}`}>
              <Link to="/favorites">Favorites</Link>
            </li>
          )}
          <li className={`navbar-item ${location.pathname === '/about' ? 'navbar-active' : ''}`}>
            <Link to="/about">About Us</Link>
          </li>
          <li className={`navbar-item ${location.pathname === '/contact' ? 'navbar-active' : ''}`}>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li className={`navbar-item ${location.pathname === '/faqs' ? 'navbar-active' : ''}`}>
            <Link to="/faqs">FAQs</Link>
          </li>
          <li className={`navbar-item ${location.pathname === '/signin' ? 'navbar-active' : ''}`}>
            <Link to={isLoggedIn ? "/profile" : "/signin"}>
              {isLoggedIn ? "My Profile" : "Sign In/Sign Up"}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;