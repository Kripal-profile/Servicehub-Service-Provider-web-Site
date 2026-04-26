import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">ServiceHub</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Browse Services
          </Link>
          {user ? (
            <>
              <Link
                to={isProvider ? '/provider/dashboard' : '/client/dashboard'}
                className={`nav-link ${location.pathname.includes('dashboard') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isProvider && (
                <Link to="/provider/services/new" className="nav-link" onClick={() => setMenuOpen(false)}>
                  + List Service
                </Link>
              )}
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              <div className="nav-user">
                <span className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="nav-name">{user.name.split(' ')[0]}</span>
                <span className={`nav-role-badge ${user.role}`}>{user.role}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
