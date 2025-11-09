import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cursorTrailRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createCursorEffect = (e) => {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      container.appendChild(trail);

      cursorTrailRef.current.push(trail);

      // Remove old trails (keep only last 20)
      if (cursorTrailRef.current.length > 20) {
        const oldTrail = cursorTrailRef.current.shift();
        if (oldTrail && oldTrail.parentNode) {
          oldTrail.parentNode.removeChild(oldTrail);
        }
      }

      // Fade out and remove
      setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0)';
        setTimeout(() => {
          if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
          }
        }, 500);
      }, 100);
    };

    const handleMouseMove = (e) => {
      createCursorEffect(e);
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      // Cleanup trails
      cursorTrailRef.current.forEach(trail => {
        if (trail && trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      });
      cursorTrailRef.current = [];
    };
  }, []);

  const handleExploreNow = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container" ref={containerRef}>
      <nav className="home-navbar">
        <div className="home-logo">
          <div className="logo-icon-wrapper">
            <svg className="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <path d="M20 20 L80 20 L80 40 L20 40 Z" fill="url(#logoGradient)" opacity="0.9"/>
              <path d="M20 50 L60 50 L60 70 L20 70 Z" fill="url(#logoGradient)" opacity="0.7"/>
              <path d="M20 75 L50 75 L50 85 L20 85 Z" fill="url(#logoGradient)" opacity="0.5"/>
              <circle cx="75" cy="65" r="8" fill="url(#logoGradient)"/>
            </svg>
          </div>
          <span className="logo-text">NoteX</span>
        </div>
        <div className="home-nav-links">
          <button onClick={handleLogin} className="nav-link-btn">Sign In</button>
        </div>
      </nav>

      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-title-wrapper">
            <h1 className="hero-title">
              Meet NoteX — Your AI Study Companion
            </h1>
          </div>
          <p className="hero-description">
            Organize your study notes, chat with them using AI, and unlock powerful insights. 
            Upload PDFs, create quick notes, and get AI-powered summaries, quizzes, and explanations — 
            all in one intelligent workspace.
          </p>
          <div className="hero-actions">
            <button onClick={handleExploreNow} className="btn-explore">
              <span>Explore Now</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-element"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Smart Notes</h3>
          <p>Create and organize your study notes with ease. Upload PDFs and extract text automatically.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Chat</h3>
          <p>Chat with your notes using Google Gemini AI. Get instant answers and explanations.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Quick Notes</h3>
          <p>Add quick reminders and short notes instantly. Keep track of important information.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Study Tools</h3>
          <p>Generate summaries, quizzes, flashcards, and explanations with AI-powered tools.</p>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-text">
            <span>Powered by NoteX</span>
            <span className="footer-separator">•</span>
            <span>© 2025 NoteX - Made with <span className="heart">❤️</span> for Learners</span>
            <span className="footer-separator">•</span>
            <span>Developed by <span className="developer-name">Prashant Talaviya</span></span>
          </div>
          <div className="footer-social">
            <a 
              href="https://www.linkedin.com/in/prashant-talaviya/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/prashant-talaviya" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://prashanttalaviya.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Portfolio"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

