import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Homepage from './pages/Homepage';
import BookListingPage from './pages/BookListingPage';
import BookDetailPage from './pages/BookDetailPage';
import SignInSignUpPage from './pages/SignInSignUpPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQsPage from './pages/FAQsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ManageBooksPage from './pages/ManageBooksPage';
import ManageUsersPage from './pages/ManageUsersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import CreateBook from './components/CreateBookPage';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const location = useLocation();
  const hideNavbar= 
  location.pathname === '/admin'|| 
  location.pathname === '/admin/books' || 
  location.pathname === '/create-book' || 
  location.pathname === '/admin/users' || 
  location.pathname === '/admin/settings' || 
  location.pathname === '/admin/categories' || 
  location.pathname === '/admin/add-category' || 
  location.pathname === '/admin/create-book';
  const hideFooter = 
  location.pathname === '/admin' || 
  location.pathname === '/admin/books' || 
  location.pathname === '/create-book' || 
  location.pathname === '/admin/users' || 
  location.pathname === '/admin/settings' || 
  location.pathname === '/admin/categories' || 
  location.pathname === '/admin/add-category' || 
  location.pathname === '/admin/create-book';


  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/books" element={<BookListingPage />} />
          <Route path="/book/:bookId" element={<BookDetailPage />} />
          <Route path="/signin" element={<SignInSignUpPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<ManageBooksPage />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/categories" element={<ManageCategoriesPage />} />
          <Route path="/admin/create-book" element={<CreateBook />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;