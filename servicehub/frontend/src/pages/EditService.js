import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getServiceById, updateService } from '../utils/api';
import './ServiceForm.css';

const CATEGORIES = ['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'Gardening', 'Moving', 'AC Repair', 'Other'];

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', price: '', priceType: 'fixed', location: '', tags: '', isActive: true });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getServiceById(id).then(({ data }) => {
      setForm({ title: data.title, description: data.description, category: data.category, price: data.price, priceType: data.priceType, location: data.location, tags: data.tags?.join(', ') || '', isActive: data.isActive });
      if (data.image) setPreview(data.image);
    }).finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await updateService(id, fd);
      navigate('/provider/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="spinner-page" />;

  return (
    <div className="page">
      <div className="container">
        <div className="form-page-layout">
          <div className="form-page-header">
            <Link to="/provider/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1 className="page-title">Edit Service</h1>
          </div>
          <div className="form-page-card">
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Service Title *</label>
                <input type="text" className="form-input" value={form.title} onChange={set('title')} required />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input form-select" value={form.category} onChange={set('category')} required>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" className="form-input" value={form.location} onChange={set('location')} required />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-input" value={form.price} onChange={set('price')} min="0" required />
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
                <textarea className="form-input" rows="4" value={form.description} onChange={set('description')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input type="text" className="form-input" value={form.tags} onChange={set('tags')} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input form-select" value={form.isActive} onChange={e => setForm({...form, isActive: e.target.value === 'true'})}>
                  <option value="true">Active (Visible to clients)</option>
                  <option value="false">Inactive (Hidden)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Update Image (optional)</label>
                <div className="image-upload-box" onClick={() => document.getElementById('edit-img').click()}>
                  {preview ? <img src={preview} alt="preview" className="image-preview" /> : (
                    <div className="image-upload-placeholder"><span>📷</span><p>Click to upload image</p></div>
                  )}
                </div>
                <input id="edit-img" type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if(f){setImage(f);setPreview(URL.createObjectURL(f));} }} style={{display:'none'}} />
              </div>
              <div style={{display:'flex',gap:12}}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                  {saving ? <><span className="spinner" /> Saving...</> : 'Save Changes'}
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
