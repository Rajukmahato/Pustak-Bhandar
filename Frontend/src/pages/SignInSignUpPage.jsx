import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SignInSignUpPage.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (Sign Up or Sign In)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isSignUp) {
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          toast.error("Passwords do not match");
          return;
        }
        // Handle Sign Up
        response = await axios.post("http://localhost:5005/api/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Sign Up Successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsSignUp(false); // Switch to Sign In form
      } else {
        // Handle Sign In
        response = await axios.post("http://localhost:5005/api/signin", {
          email: formData.email,
          password: formData.password,
        });
        toast.success("Sign In Successful!");
        localStorage.setItem('token', response.data.token); // Store JWT in local storage
        localStorage.setItem('userId', response.data.userId); // Store userId in local storage
        navigate("/"); // Navigate to homepage
      }
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.message || "Authentication failed. Please try again.");
      toast.error(error.response.data.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="auth-page-container">
      <ToastContainer />
      <header className="header">
        <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
      </header>

      <section className="auth-form">
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={isSignUp}
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
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={isSignUp}
                />
              </div>
            </>
          )}

          {!isSignUp && (
            <>
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
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* {error && <p className="error">{error}</p>} */}

          <button type="submit" className="auth-btn">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setIsSignUp(!isSignUp)} className="toggle-form">
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </section>
    </div>
  );
};

export default AuthPage;