import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

const CATEGORY_ICONS = {
  Electrical: '⚡', Plumbing: '🔧', Cleaning: '🧹', Carpentry: '🪚',
  Painting: '🎨', Gardening: '🌿', Moving: '📦', 'AC Repair': '❄️', Other: '🔨',
};

export default function ServiceCard({ service }) {
  const icon = CATEGORY_ICONS[service.category] || '🔨';
  return (
    <Link to={`/services/${service._id}`} className="service-card">
      <div className="service-card-image">
        {service.image ? (
          <img src={service.image} alt={service.title} />
        ) : (
          <div className="service-card-placeholder">{icon}</div>
        )}
        <span className="service-card-category">{icon} {service.category}</span>
      </div>
      <div className="service-card-body">
        <h3 className="service-card-title">{service.title}</h3>
        <p className="service-card-desc">{service.description.slice(0, 90)}{service.description.length > 90 ? '...' : ''}</p>
        <div className="service-card-meta">
          <span className="service-card-location">📍 {service.location}</span>
          {service.provider && (
            <span className="service-card-provider">by {service.provider.name}</span>
          )}
        </div>
        <div className="service-card-footer">
          <span className="service-card-price">
            ₹{service.price.toLocaleString()}
            <span className="price-type">/{service.priceType === 'hourly' ? 'hr' : 'fixed'}</span>
          </span>
          <span className="service-card-cta">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
