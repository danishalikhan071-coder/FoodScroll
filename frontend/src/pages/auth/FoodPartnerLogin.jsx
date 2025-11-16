import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/api';

const FoodPartnerLogin = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('') // Clear previous errors
    setIsLoading(true)

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(`${API_URL}/api/auth/food-partner/login`, {
        email,
        password
      }, { withCredentials: true })
      navigate("/create-food"); // Redirect to create food page after login
    } catch (error) {
      // Show error message from backend or default message
      const errorMessage = error.response?.data?.message || 'Invalid email or password. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="business@example.com" 
              autoComplete="email"
              onChange={() => setError('')} // Clear error when user types
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Password" 
              autoComplete="current-password"
              onChange={() => setError('')} // Clear error when user types
            />
          </div>
          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
