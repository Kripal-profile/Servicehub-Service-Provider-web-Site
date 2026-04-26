import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: searchParams.get('role') || 'client', phone: '', location: '',
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    const { confirmPassword, ...data } = form;
    const result = await register(data);
    if (result.success) navigate(form.role === 'provider' ? '/provider/dashboard' : '/client/dashboard');
    else setError(result.message);
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo">⚡</div>
          <h1>Create an account</h1>
          <p>Join ServiceHub today — it's free</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="role-toggle">
          {['client', 'provider'].map(r => (
            <button key={r} type="button"
              className={`role-btn ${form.role === r ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: r })}>
              {r === 'client' ? '👤 I need services' : '🔧 I provide services'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Ravi Kumar"
                value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" className="form-input" placeholder="+91 98765 43210"
                value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">City / Location</label>
            <input type="text" className="form-input" placeholder="Mumbai, Maharashtra"
              value={form.location} onChange={set('location')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" placeholder="Repeat password"
                value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
