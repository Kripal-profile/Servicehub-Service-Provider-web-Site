import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById, createBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ scheduledDate: '', scheduledTime: '', address: '', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    getServiceById(id)
      .then(({ data }) => setService(data))
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setBookingError(''); setBookingSuccess('');
    setBookingLoading(true);
    try {
      await createBooking({ serviceId: id, ...booking });
      setBookingSuccess('Booking created! Check your dashboard for status.');
      setBooking({ scheduledDate: '', scheduledTime: '', address: '', notes: '' });
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed');
    } finally { setBookingLoading(false); }
  };

  if (loading) return <div className="spinner-page" />;
  if (!service) return null;

  const isOwnService = user?.role === 'provider' && service.provider?._id === user._id;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <div className="container">
        <div className="detail-layout">
          {/* Main */}
          <main className="detail-main">
            <div className="detail-image-wrap">
              {service.image ? (
                <img src={service.image} alt={service.title} className="detail-image" />
              ) : (
                <div className="detail-image-placeholder">🔧</div>
              )}
            </div>
            <div className="detail-content">
              <div className="detail-category">{service.category}</div>
              <h1 className="detail-title">{service.title}</h1>
              <div className="detail-meta-row">
                <span className="detail-location">📍 {service.location}</span>
                <span className="detail-price">
                  ₹{service.price.toLocaleString()}
                  <span className="detail-price-type">/{service.priceType === 'hourly' ? 'per hour' : 'fixed'}</span>
                </span>
              </div>
              <div className="divider" />
              <h3>About This Service</h3>
              <p className="detail-desc">{service.description}</p>
              {service.tags?.length > 0 && (
                <div className="detail-tags">
                  {service.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className="provider-card">
              <h3>Service Provider</h3>
              <div className="provider-info">
                <div className="provider-avatar">{service.provider?.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="provider-name">{service.provider?.name}</div>
                  <div className="provider-location">📍 {service.provider?.location || 'Location not set'}</div>
                  {service.provider?.bio && <p className="provider-bio">{service.provider.bio}</p>}
                </div>
              </div>
              {service.provider?.phone && <p className="provider-phone">📞 {service.provider.phone}</p>}
            </div>
          </main>

          {/* Booking Sidebar */}
          <aside className="booking-sidebar">
            <div className="booking-box">
              <div className="booking-box-header">
                <span className="booking-price-big">₹{service.price.toLocaleString()}</span>
                <span className="booking-price-label">/{service.priceType === 'hourly' ? 'hour' : 'fixed'}</span>
              </div>

              {isOwnService ? (
                <div className="booking-own">
                  <p>This is your service listing.</p>
                  <Link to={`/provider/services/edit/${service._id}`} className="btn btn-secondary" style={{width:'100%',justifyContent:'center'}}>
                    Edit Service
                  </Link>
                </div>
              ) : !user ? (
                <div className="booking-guest">
                  <p>Sign in to book this service</p>
                  <Link to="/login" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}}>Login to Book</Link>
                </div>
              ) : user.role === 'provider' ? (
                <p className="booking-note">Switch to a client account to book services.</p>
              ) : (
                <form onSubmit={handleBook}>
                  {bookingError && <div className="alert alert-error">{bookingError}</div>}
                  {bookingSuccess && <div className="alert alert-success">{bookingSuccess}</div>}
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" min={today}
                      value={booking.scheduledDate} onChange={e => setBooking({...booking, scheduledDate: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input type="time" className="form-input"
                      value={booking.scheduledTime} onChange={e => setBooking({...booking, scheduledTime: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Address</label>
                    <textarea className="form-input" rows="2" placeholder="Full address for service..."
                      value={booking.address} onChange={e => setBooking({...booking, address: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes (optional)</label>
                    <textarea className="form-input" rows="2" placeholder="Any specific requirements..."
                      value={booking.notes} onChange={e => setBooking({...booking, notes: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}} disabled={bookingLoading}>
                    {bookingLoading ? <span className="spinner" /> : 'Book Now'}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
