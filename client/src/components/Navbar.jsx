import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
            <Link to="/dashboard" className="navbar-logo">
              <div className="logo-icon-wrapper">
                <svg className="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <path d="M20 20 L80 20 L80 40 L20 40 Z" fill="url(#navLogoGradient)" opacity="0.9"/>
                  <path d="M20 50 L60 50 L60 70 L20 70 Z" fill="url(#navLogoGradient)" opacity="0.7"/>
                  <path d="M20 75 L50 75 L50 85 L20 85 Z" fill="url(#navLogoGradient)" opacity="0.5"/>
                  <circle cx="75" cy="65" r="8" fill="url(#navLogoGradient)"/>
                </svg>
              </div>
              <span className="logo-text">NoteX</span>
            </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/notes" className="navbar-link">Notes</Link>
          <Link to="/chat" className="navbar-link">Chat</Link>
          <Link to="/profile" className="navbar-link">Profile</Link>
          <span className="navbar-user">Hi, {user.name || 'User'}</span>
          <button onClick={handleLogout} className="navbar-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

