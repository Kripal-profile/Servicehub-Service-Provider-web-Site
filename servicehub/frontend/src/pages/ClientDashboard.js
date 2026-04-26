import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/bookings/BookingCard';
import './Dashboard.css';

const STATUS_TABS = ['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'];

export default function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    getMyBookings()
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">👤 Client Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name?.split(' ')[0]}!</p>
        </div>

        <div className="stats-grid" style={{marginBottom: 32}}>
          <div className="stat-card"><span className="stat-card-num">{stats.total}</span><span className="stat-card-label">Total Bookings</span></div>
          <div className="stat-card stat-pending"><span className="stat-card-num">{stats.pending}</span><span className="stat-card-label">Pending</span></div>
          <div className="stat-card stat-accepted"><span className="stat-card-num">{stats.accepted}</span><span className="stat-card-label">Accepted</span></div>
          <div className="stat-card stat-completed"><span className="stat-card-num">{stats.completed}</span><span className="stat-card-label">Completed</span></div>
        </div>

        <div className="dashboard-cta-bar">
          <h3>Need a service?</h3>
          <Link to="/services" className="btn btn-primary">Browse Services →</Link>
        </div>

        <div className="tabs">
          {STATUS_TABS.map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t !== 'all' && <span className="tab-count">{bookings.filter(b => b.status === t).length}</span>}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner-page" /> : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>Book your first service to get started.</p>
            <Link to="/services" className="btn btn-primary" style={{marginTop: 16}}>Browse Services</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map(b => <BookingCard key={b._id} booking={b} role="client" />)}
          </div>
        )}
      </div>
    </div>
  );
}
