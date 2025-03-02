import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './context/ThemeContext';
import Homepage from './pages/Homepage';
import BookListingPage from './pages/BookListingPage';
import BookDetailPage from './pages/BookDetailPage';
import SignInSignUpPage from './pages/SignInSignUpPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQsPage from './pages/FAQsPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageBooksPage from './pages/ManageBooksPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageReviewsPage from './pages/ManageReviewsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import CreateBook from './pages/CreateBookPage';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import EditBookPage from './pages/EditBookPage';
import 'react-toastify/dist/ReactToastify.css';
import './styles/variables.css';
import './App.css';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const hideNavbar = isAdminRoute;
  const hideFooter = isAdminRoute;

  return (
    <ThemeProvider>
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
            <Route path="/favorites" element={<FavoritesPage />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedAdminRoute>
                <ManageBooksPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedAdminRoute>
                <ManageUsersPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/reviews" element={
              <ProtectedAdminRoute>
                <ManageReviewsPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedAdminRoute>
                <AdminSettingsPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedAdminRoute>
                <ManageCategoriesPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/create-book" element={
              <ProtectedAdminRoute>
                <CreateBook />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/edit-book/:id" element={
              <ProtectedAdminRoute>
                <EditBookPage />
              </ProtectedAdminRoute>
            } />
          </Routes>
        </main>
        {!hideFooter && <Footer />}
        <ToastContainer position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;