import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/bottom-nav.css'

const BottomNav = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Try user logout first (since home page is for users)
      await axios.get('http://localhost:3000/api/auth/user/logout', { withCredentials: true })
      navigate('/user/login')
    } catch (error) {
      // If user logout fails, try food-partner logout
      try {
        await axios.get('http://localhost:3000/api/auth/food-partner/logout', { withCredentials: true })
        navigate('/food-partner/login')
      } catch (partnerError) {
        // If both fail, still redirect to login
        navigate('/user/login')
      }
    }
  }

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom">
      <div className="bottom-nav__inner">
        <NavLink to="/" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* home icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 12 3l9 7.5"/>
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Home</span>
        </NavLink>

        <NavLink to="/saved" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* bookmark icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Saved</span>
        </NavLink>

        <button 
          onClick={handleLogout} 
          className="bottom-nav__item bottom-nav__button"
          aria-label="Logout"
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* logout icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default BottomNav
