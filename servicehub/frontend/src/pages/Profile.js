import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '', bio: user?.bio || '' });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [error, setError] = useState('');
  const [pwError, setPwError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setPw = (k) => (e) => setPwForm({ ...pwForm, [k]: e.target.value });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError(''); setMsg(''); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      const { data } = await updateProfile(fd);
      updateUser(data);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(''); setPwMsg('');
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError('New passwords do not match');
    if (pwForm.newPassword.length < 6) return setPwError('Password must be at least 6 characters');
    setPwSaving(true);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Password change failed');
    } finally { setPwSaving(false); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          {/* Left Panel */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar-wrap">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-placeholder">{user?.name?.charAt(0).toUpperCase()}</div>
                )}
                <button className="avatar-change-btn" onClick={() => document.getElementById('avatar-input').click()}>
                  📷
                </button>
                <input id="avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} style={{display:'none'}} />
              </div>
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              <span className={`profile-role-badge ${user?.role}`}>
                {user?.role === 'client' ? '👤 Client' : '🔧 Service Provider'}
              </span>
              {user?.location && <p className="profile-location">📍 {user.location}</p>}
              {user?.phone && <p className="profile-phone">📞 {user.phone}</p>}
            </div>

            <nav className="profile-nav">
              <button className={`profile-nav-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
                ✏️ Edit Profile
              </button>
              <button className={`profile-nav-btn ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
                🔒 Change Password
              </button>
            </nav>
          </aside>

          {/* Right Panel */}
          <main className="profile-main">
            {tab === 'profile' && (
              <div className="profile-section-card">
                <h2 className="profile-section-title">Edit Profile</h2>
                {msg && <div className="alert alert-success">{msg}</div>}
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleProfileSave}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-input" value={form.name} onChange={set('name')} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City / Location</label>
                    <input type="text" className="form-input" placeholder="e.g. Mumbai, Maharashtra" value={form.location} onChange={set('location')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio {user?.role === 'provider' && '(visible to clients)'}</label>
                    <textarea className="form-input" rows="4"
                      placeholder={user?.role === 'provider' ? 'Describe your expertise, years of experience, certifications...' : 'Tell us a little about yourself...'}
                      value={form.bio} onChange={set('bio')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" value={user?.email} disabled style={{opacity:0.5, cursor:'not-allowed'}} />
                    <small style={{color:'var(--text3)', fontSize:12, marginTop:4, display:'block'}}>Email cannot be changed.</small>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                    {saving ? <><span className="spinner" /> Saving...</> : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'password' && (
              <div className="profile-section-card">
                <h2 className="profile-section-title">Change Password</h2>
                {pwMsg && <div className="alert alert-success">{pwMsg}</div>}
                {pwError && <div className="alert alert-error">{pwError}</div>}
                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" placeholder="Your current password"
                      value={pwForm.currentPassword} onChange={setPw('currentPassword')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" placeholder="Min. 6 characters"
                      value={pwForm.newPassword} onChange={setPw('newPassword')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-input" placeholder="Repeat new password"
                      value={pwForm.confirmPassword} onChange={setPw('confirmPassword')} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={pwSaving}>
                    {pwSaving ? <><span className="spinner" /> Updating...</> : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
