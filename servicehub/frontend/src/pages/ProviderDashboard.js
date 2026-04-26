import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyServices, getProviderBookings, updateBookingStatus, deleteService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/bookings/BookingCard';
import './Dashboard.css';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookingTab, setBookingTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    Promise.all([getMyServices(), getProviderBookings()])
      .then(([svc, bkn]) => { setServices(svc.data); setBookings(bkn.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (bookingId, status) => {
    setActionLoading(bookingId + status);
    try {
      const { data } = await updateBookingStatus(bookingId, { status });
      setBookings(prev => prev.map(b => b._id === bookingId ? data : b));
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(serviceId);
      setServices(prev => prev.filter(s => s._id !== serviceId));
    } catch (err) { alert('Delete failed'); }
  };

  const stats = {
    services: services.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  const filteredBookings = bookingTab === 'all' ? bookings : bookings.filter(b => b.status === bookingTab);

  if (loading) return <div className="spinner-page" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header dashboard-header-row">
          <div>
            <h1 className="page-title">🔧 Provider Dashboard</h1>
            <p className="page-subtitle">Welcome, {user?.name?.split(' ')[0]}!</p>
          </div>
          <Link to="/provider/services/new" className="btn btn-primary btn-lg">+ List New Service</Link>
        </div>

        <div className="stats-grid" style={{marginBottom: 32}}>
          <div className="stat-card"><span className="stat-card-num">{stats.services}</span><span className="stat-card-label">My Services</span></div>
          <div className="stat-card stat-pending"><span className="stat-card-num">{stats.pending}</span><span className="stat-card-label">Pending Requests</span></div>
          <div className="stat-card stat-accepted"><span className="stat-card-num">{stats.accepted}</span><span className="stat-card-label">Active Jobs</span></div>
          <div className="stat-card stat-completed"><span className="stat-card-num">{stats.completed}</span><span className="stat-card-label">Completed</span></div>
        </div>

        <div className="tabs" style={{marginBottom: 24}}>
          <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Booking Requests {stats.pending > 0 && <span className="tab-badge">{stats.pending}</span>}</button>
          <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>My Services</button>
        </div>

        {activeTab === 'bookings' && (
          <>
            <div className="tabs tabs-secondary">
              {['pending', 'accepted', 'completed', 'all'].map(t => (
                <button key={t} className={`tab-btn ${bookingTab === t ? 'active' : ''}`} onClick={() => setBookingTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            {filteredBookings.length === 0 ? (
              <div className="empty-state"><h3>No bookings here</h3></div>
            ) : (
              <div className="bookings-list">
                {filteredBookings.map(b => (
                  <div key={b._id} className="booking-with-actions">
                    <BookingCard booking={b} role="provider" />
                    {b.status === 'pending' && (
                      <div className="booking-actions">
                        <button className="btn btn-success btn-sm"
                          disabled={actionLoading === b._id + 'accepted'}
                          onClick={() => handleStatus(b._id, 'accepted')}>
                          {actionLoading === b._id + 'accepted' ? <span className="spinner" /> : '✅ Accept'}
                        </button>
                        <button className="btn btn-danger btn-sm"
                          disabled={actionLoading === b._id + 'rejected'}
                          onClick={() => handleStatus(b._id, 'rejected')}>
                          {actionLoading === b._id + 'rejected' ? <span className="spinner" /> : '❌ Reject'}
                        </button>
                      </div>
                    )}
                    {b.status === 'accepted' && (
                      <div className="booking-actions">
                        <button className="btn btn-primary btn-sm"
                          disabled={actionLoading === b._id + 'completed'}
                          onClick={() => handleStatus(b._id, 'completed')}>
                          {actionLoading === b._id + 'completed' ? <span className="spinner" /> : '🏁 Mark Complete'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'services' && (
          services.length === 0 ? (
            <div className="empty-state">
              <h3>No services listed yet</h3>
              <Link to="/provider/services/new" className="btn btn-primary" style={{marginTop: 16}}>List Your First Service</Link>
            </div>
          ) : (
            <div className="services-table-wrap">
              <table className="services-table">
                <thead>
                  <tr><th>Service</th><th>Category</th><th>Price</th><th>Location</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s._id}>
                      <td><span className="svc-title">{s.title}</span></td>
                      <td><span className="badge badge-accepted">{s.category}</span></td>
                      <td>₹{s.price.toLocaleString()}/{s.priceType === 'hourly' ? 'hr' : 'fixed'}</td>
                      <td>{s.location}</td>
                      <td><span className={`badge ${s.isActive ? 'badge-accepted' : 'badge-cancelled'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <div style={{display:'flex',gap:8}}>
                          <Link to={`/provider/services/edit/${s._id}`} className="btn btn-secondary btn-sm">Edit</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
