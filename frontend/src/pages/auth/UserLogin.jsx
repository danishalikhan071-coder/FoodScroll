import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/api';

const UserLogin = () => {

  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setError('') // Clear previous errors
    setIsLoading(true)
    
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const response = await axios.post(`${API_URL}/api/auth/user/login`,{email,password},{withCredentials: true})
      navigate('/')
    } catch (error) {
      // Show error message from backend or default message
      const errorMessage = error.response?.data?.message || 'Invalid email or password. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form"  noValidate onSubmit={handleSubmit}>
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
              placeholder="you@example.com" 
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
              placeholder="••••••••" 
              autoComplete="current-password"
              onChange={() => setError('')} // Clear error when user types
            />
          </div>
          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-alt-action">
          New here? <a href="/user/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
