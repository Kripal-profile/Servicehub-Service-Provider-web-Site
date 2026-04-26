import React from 'react';
import { Link } from 'react-router-dom';
import './BookingCard.css';

export default function BookingCard({ booking, role }) {
  const other = role === 'client' ? booking.provider : booking.client;
  const statusMap = { pending: '🕐', accepted: '✅', rejected: '❌', completed: '🏁', cancelled: '🚫' };

  return (
    <Link to={`/bookings/${booking._id}`} className="booking-card">
      <div className="booking-card-left">
        <div className="booking-service-icon">
          {booking.service?.image ? <img src={booking.service.image} alt="" /> : '🔧'}
        </div>
      </div>
      <div className="booking-card-body">
        <div className="booking-card-top">
          <h4 className="booking-service-name">{booking.service?.title || 'Service'}</h4>
          <span className={`badge badge-${booking.status}`}>{statusMap[booking.status]} {booking.status}</span>
        </div>
        <p className="booking-meta">
          {role === 'client' ? '👤 Provider' : '👤 Client'}: <strong>{other?.name}</strong>
        </p>
        <div className="booking-card-bottom">
          <span className="booking-date">📅 {new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {booking.scheduledTime}</span>
          <span className="booking-price">₹{booking.totalPrice?.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
