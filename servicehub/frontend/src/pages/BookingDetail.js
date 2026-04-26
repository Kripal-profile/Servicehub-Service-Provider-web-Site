import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookingById, updateBookingStatus, cancelBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './BookingDetail.css';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getBookingById(id)
      .then(({ data }) => setBooking(data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStatus = async (status) => {
    setActionLoading(status); setError('');
    try {
      const { data } = await updateBookingStatus(id, { status });
      setBooking(data);
    } catch (err) { setError(err.response?.data?.message || 'Action failed'); }
    finally { setActionLoading(''); }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading('cancel'); setError('');
    try {
      await cancelBooking(id);
      setBooking(prev => ({ ...prev, status: 'cancelled' }));
    } catch (err) { setError(err.response?.data?.message || 'Cancel failed'); }
    finally { setActionLoading(''); }
  };

  if (loading) return <div className="spinner-page" />;
  if (!booking) return null;

  const isProvider = user?.role === 'provider';
  const isClient = user?.role === 'client';
  const other = isProvider ? booking.client : booking.provider;

  const statusColors = { pending: 'badge-pending', accepted: 'badge-accepted', rejected: 'badge-rejected', completed: 'badge-completed', cancelled: 'badge-cancelled' };
  const statusIcons = { pending: '🕐', accepted: '✅', rejected: '❌', completed: '🏁', cancelled: '🚫' };

  return (
    <div className="page">
      <div className="container">
        <div className="booking-detail-layout">
          <div className="booking-detail-main">
            <div className="booking-detail-header">
              <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
              <div className="booking-detail-title-row">
                <h1 className="page-title">Booking Details</h1>
                <span className={`badge ${statusColors[booking.status]} badge-lg`}>
                  {statusIcons[booking.status]} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Service Info */}
            <div className="bdetail-card">
              <h3 className="bdetail-card-title">Service</h3>
              <div className="bdetail-service-row">
                <div className="bdetail-service-img">
                  {booking.service?.image ? <img src={booking.service.image} alt="" /> : '🔧'}
                </div>
                <div>
                  <div className="bdetail-service-name">{booking.service?.title}</div>
                  <div className="bdetail-service-cat">{booking.service?.category}</div>
                  {booking.service?.location && <div className="bdetail-service-loc">📍 {booking.service.location}</div>}
                </div>
                <div className="bdetail-price">₹{booking.totalPrice?.toLocaleString()}</div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bdetail-card">
              <h3 className="bdetail-card-title">Schedule</h3>
              <div className="bdetail-info-grid">
                <div className="bdetail-info-item">
                  <span className="bdetail-info-label">Date</span>
                  <span className="bdetail-info-value">
                    {new Date(booking.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="bdetail-info-item">
                  <span className="bdetail-info-label">Time</span>
                  <span className="bdetail-info-value">{booking.scheduledTime}</span>
                </div>
                <div className="bdetail-info-item" style={{gridColumn:'1/-1'}}>
                  <span className="bdetail-info-label">Service Address</span>
                  <span className="bdetail-info-value">{booking.address}</span>
                </div>
                {booking.notes && (
                  <div className="bdetail-info-item" style={{gridColumn:'1/-1'}}>
                    <span className="bdetail-info-label">Client Notes</span>
                    <span className="bdetail-info-value">{booking.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Other Party Info */}
            <div className="bdetail-card">
              <h3 className="bdetail-card-title">{isProvider ? 'Client' : 'Service Provider'}</h3>
              <div className="bdetail-person">
                <div className="bdetail-avatar">{other?.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="bdetail-person-name">{other?.name}</div>
                  <div className="bdetail-person-email">{other?.email}</div>
                  {other?.phone && <div className="bdetail-person-phone">📞 {other.phone}</div>}
                </div>
              </div>
            </div>

            {/* Provider Note */}
            {booking.providerNote && (
              <div className="bdetail-card">
                <h3 className="bdetail-card-title">Provider Note</h3>
                <p className="bdetail-note">{booking.providerNote}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="bdetail-card">
              <h3 className="bdetail-card-title">Booking Timeline</h3>
              <div className="bdetail-timeline">
                <div className="timeline-item done">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-label">Booking Created</span>
                    <span className="timeline-date">{new Date(booking.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className={`timeline-item ${['accepted','rejected','completed','cancelled'].includes(booking.status) ? 'done' : ''}`}>
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-label">Provider Response</span>
                    <span className="timeline-date">{['accepted','rejected'].includes(booking.status) ? booking.status.toUpperCase() : 'Awaiting...'}</span>
                  </div>
                </div>
                <div className={`timeline-item ${booking.status === 'completed' ? 'done' : ''}`}>
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-label">Service Completed</span>
                    <span className="timeline-date">{booking.status === 'completed' ? '✅ Done' : 'Pending'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <aside className="booking-detail-sidebar">
            <div className="bdetail-actions-card">
              <h3>Actions</h3>
              <div className="bdetail-actions">
                {isProvider && booking.status === 'pending' && (
                  <>
                    <button className="btn btn-success btn-lg" style={{width:'100%',justifyContent:'center'}}
                      disabled={!!actionLoading} onClick={() => handleStatus('accepted')}>
                      {actionLoading === 'accepted' ? <span className="spinner" /> : '✅ Accept Booking'}
                    </button>
                    <button className="btn btn-danger btn-lg" style={{width:'100%',justifyContent:'center'}}
                      disabled={!!actionLoading} onClick={() => handleStatus('rejected')}>
                      {actionLoading === 'rejected' ? <span className="spinner" /> : '❌ Reject Booking'}
                    </button>
                  </>
                )}
                {isProvider && booking.status === 'accepted' && (
                  <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}}
                    disabled={!!actionLoading} onClick={() => handleStatus('completed')}>
                    {actionLoading === 'completed' ? <span className="spinner" /> : '🏁 Mark as Completed'}
                  </button>
                )}
                {isClient && ['pending','accepted'].includes(booking.status) && (
                  <button className="btn btn-danger btn-lg" style={{width:'100%',justifyContent:'center'}}
                    disabled={!!actionLoading} onClick={handleCancel}>
                    {actionLoading === 'cancel' ? <span className="spinner" /> : '🚫 Cancel Booking'}
                  </button>
                )}
                {['completed','cancelled','rejected'].includes(booking.status) && (
                  <p className="bdetail-no-action">No further actions available for this booking.</p>
                )}
                <Link
                  to={isProvider ? '/provider/dashboard' : '/client/dashboard'}
                  className="btn btn-secondary" style={{width:'100%',justifyContent:'center',marginTop:8}}>
                  ← Back to Dashboard
                </Link>
              </div>
            </div>

            <div className="bdetail-summary-card">
              <h3>Summary</h3>
              <div className="bdetail-summary-row"><span>Status</span><span className={`badge ${statusColors[booking.status]}`}>{booking.status}</span></div>
              <div className="bdetail-summary-row"><span>Total Price</span><span className="bdetail-summary-price">₹{booking.totalPrice?.toLocaleString()}</span></div>
              <div className="bdetail-summary-row"><span>Booked On</span><span>{new Date(booking.createdAt).toLocaleDateString('en-IN')}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
