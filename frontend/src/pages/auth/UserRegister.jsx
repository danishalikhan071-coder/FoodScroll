import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth-shared.css";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import API_URL from '../../config/api';

const UserRegister = () => {

    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setError('') // Clear previous errors
        setIsLoading(true)

        const firstName = e.target.firstName.value.trim();
        const lastName = e.target.lastName.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        // Basic validation
        if(!firstName || !lastName || !email || !password){
            setError('Please fill in all fields')
            setIsLoading(false)
            return
        }

        if(password.length < 6){
            setError('Password must be at least 6 characters long')
            setIsLoading(false)
            return
        }

        try {
            const response = await axios.post(`${API_URL}/api/auth/user/register`,{
                fullName: firstName + " " + lastName,
                email,
                password
            },{withCredentials: true})
            navigate('/')
        } catch (error) {
            // Show error message from backend or default message
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="auth-page-wrapper">
      <div
        className="auth-card"
        role="region"
        aria-labelledby="user-register-title"
      >
        <header>
          <h1 id="user-register-title" className="auth-title">
            Create your account
          </h1>
          <p className="auth-subtitle">
            Join to explore and enjoy delicious meals.
          </p>
        </header>
        <nav className="auth-alt-action" style={{ marginTop: "-4px" }}>
          <strong style={{ fontWeight: 600 }}>Switch:</strong>{" "}
          <Link to="/user/register">User</Link> •{" "}
          <Link to="/food-partner/register">Food partner</Link>
        </nav>
        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}
          <div className="two-col">
            <div className="field-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                placeholder="Jane"
                autoComplete="given-name"
                onChange={() => setError('')}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                autoComplete="family-name"
                onChange={() => setError('')}
                required
              />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              onChange={() => setError('')}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              onChange={() => setError('')}
              minLength={6}
              required
            />
          </div>
          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-alt-action">
          Already have an account? <Link to="/user/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
