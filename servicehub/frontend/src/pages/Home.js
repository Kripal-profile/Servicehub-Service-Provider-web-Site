import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const CATEGORIES = [
  { name: 'Electrical', icon: '⚡', color: '#f59e0b' },
  { name: 'Plumbing', icon: '🔧', color: '#3b82f6' },
  { name: 'Cleaning', icon: '🧹', color: '#10b981' },
  { name: 'Carpentry', icon: '🪚', color: '#8b5cf6' },
  { name: 'Painting', icon: '🎨', color: '#ec4899' },
  { name: 'Gardening', icon: '🌿', color: '#22c55e' },
  { name: 'Moving', icon: '📦', color: '#f97316' },
  { name: 'AC Repair', icon: '❄️', color: '#06b6d4' },
];

const STATS = [
  { value: '500+', label: 'Verified Providers' },
  { value: '2,000+', label: 'Services Listed' },
  { value: '10,000+', label: 'Happy Clients' },
  { value: '4.8★', label: 'Average Rating' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${search}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow" />
        <div className="container hero-content">
          <div className="hero-badge">🇮🇳 Trusted across India</div>
          <h1 className="hero-title">
            Find Skilled<br />
            <span className="gradient-text">Service Providers</span><br />
            Near You
          </h1>
          <p className="hero-subtitle">
            Book verified electricians, plumbers, cleaners and more — instantly, at fair prices.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search for a service..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-lg">Search</button>
          </form>
          <div className="hero-actions">
            {!user && (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/services" className="btn btn-secondary btn-lg">Browse Services</Link>
              </>
            )}
            {user && (
              <Link to="/services" className="btn btn-primary btn-lg">Browse All Services →</Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-row">
            {STATS.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Categories</h2>
            <p>From household repairs to professional services</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/services?category=${cat.name}`} className="category-card">
                <span className="category-icon" style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}>
                  {cat.icon}
                </span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get a service booked in 3 simple steps</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', title: 'Search & Browse', desc: 'Find services by category, location, or keyword.' },
              { n: '02', title: 'Book Instantly', desc: 'Choose your date and time. The provider confirms.' },
              { n: '03', title: 'Get It Done', desc: 'Sit back while the expert handles everything.' },
            ].map(step => (
              <div key={step.n} className="step-card">
                <span className="step-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-grid">
              <div className="cta-card cta-client">
                <h3>Need a Service?</h3>
                <p>Browse hundreds of verified providers and book in minutes.</p>
                <Link to="/register" className="btn btn-primary">Join as Client</Link>
              </div>
              <div className="cta-card cta-provider">
                <h3>Are You a Provider?</h3>
                <p>List your services and grow your customer base today.</p>
                <Link to="/register?role=provider" className="btn btn-primary">Join as Provider</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
