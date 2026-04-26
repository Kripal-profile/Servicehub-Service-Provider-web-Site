import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createService } from '../utils/api';
import './ServiceForm.css';

const CATEGORIES = ['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'Gardening', 'Moving', 'AC Repair', 'Other'];

export default function CreateService() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', price: '', priceType: 'fixed', location: '', tags: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await createService(fd);
      navigate('/provider/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-page-layout">
          <div className="form-page-header">
            <Link to="/provider/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1 className="page-title">List a New Service</h1>
            <p className="page-subtitle">Fill in the details below to list your service on ServiceHub.</p>
          </div>
          <div className="form-page-card">
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Service Title *</label>
                <input type="text" className="form-input" placeholder="e.g. Expert AC Installation & Repair"
                  value={form.title} onChange={set('title')} required />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input form-select" value={form.category} onChange={set('category')} required>
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" className="form-input" placeholder="e.g. Andheri, Mumbai"
                    value={form.location} onChange={set('location')} required />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-input" placeholder="e.g. 500"
                    value={form.price} onChange={set('price')} min="0" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price Type</label>
                  <select className="form-input form-select" value={form.priceType} onChange={set('priceType')}>
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Per Hour</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input" rows="4" placeholder="Describe what you offer, your experience, tools used, etc."
                  value={form.description} onChange={set('description')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input type="text" className="form-input" placeholder="e.g. 24/7, emergency, certified"
                  value={form.tags} onChange={set('tags')} />
              </div>
              <div className="form-group">
                <label className="form-label">Service Image</label>
                <div className="image-upload-box" onClick={() => document.getElementById('svc-img').click()}>
                  {preview ? <img src={preview} alt="preview" className="image-preview" /> : (
                    <div className="image-upload-placeholder">
                      <span>📷</span><p>Click to upload image</p><small>JPG, PNG, WEBP — max 5MB</small>
                    </div>
                  )}
                </div>
                <input id="svc-img" type="file" accept="image/*" onChange={handleImage} style={{display:'none'}} />
              </div>
              <div style={{display:'flex', gap:12}}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? <><span className="spinner" /> Publishing...</> : 'Publish Service'}
                </button>
                <Link to="/provider/dashboard" className="btn btn-secondary btn-lg">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
