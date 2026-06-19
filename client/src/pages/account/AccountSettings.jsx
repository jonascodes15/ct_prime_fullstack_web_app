import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import BottomNav from '../../components/common/BottomNav';
import AccountMenu from '../../components/common/AccountMenu';
import api from '../../services/api';
import './Account.css';

function Section({ title, children }) {
  return (
    <div className="acct-section">
      <h3 className="acct-section-title">{title}</h3>
      {children}
    </div>
  );
}

export default function AccountSettings() {
  const [profile, setProfile] = useState({ full_name: '', email: '' });
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [profileMsg, setProfileMsg] = useState({ text:'', type:'' });
  const [passMsg,    setPassMsg]    = useState({ text:'', type:'' });
  const [saving,     setSaving]     = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      setProfile({ full_name: data.full_name, email: data.email });
    });
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg({ text:'', type:'' });
    try {
      await api.patch('/account/profile', profile);
      setProfileMsg({ text: 'Profile updated successfully.', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Failed to update.', type: 'error' });
    } finally { setSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.confirm_password)
      return setPassMsg({ text: 'New passwords do not match.', type: 'error' });
    if (passForm.new_password.length < 8)
      return setPassMsg({ text: 'Password must be at least 8 characters.', type: 'error' });
    setSavingPass(true);
    setPassMsg({ text:'', type:'' });
    try {
      await api.patch('/account/password', {
        current_password: passForm.current_password,
        new_password:     passForm.new_password,
      });
      setPassMsg({ text: 'Password changed successfully.', type: 'success' });
      setPassForm({ current_password:'', new_password:'', confirm_password:'' });
    } catch (err) {
      setPassMsg({ text: err.response?.data?.message || 'Failed to change password.', type: 'error' });
    } finally { setSavingPass(false); }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <AccountMenu />
      <main className="app-main acct-main">
        <div className="acct-page-header">
          <Link to="/dashboard" className="acct-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </Link>
          <div>
            <h1>Account Settings</h1>
            <p>Manage your personal information and security</p>
          </div>
        </div>

        {/* Profile */}
        <Section title="Personal Information">
          {profileMsg.text && (
            <div className={`acct-alert ${profileMsg.type}`}>{profileMsg.text}</div>
          )}
          <form className="acct-form" onSubmit={saveProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={profile.full_name}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary acct-save-btn" disabled={saving}>
              {saving ? <><span className="spinner-ring" style={{width:16,height:16}}/> Saving…</> : 'Save Changes'}
            </button>
          </form>
        </Section>

        {/* Password */}
        <Section title="Change Password">
          {passMsg.text && (
            <div className={`acct-alert ${passMsg.type}`}>{passMsg.text}</div>
          )}
          <form className="acct-form" onSubmit={savePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={passForm.current_password} placeholder="Enter current password"
                onChange={e => setPassForm({ ...passForm, current_password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={passForm.new_password} placeholder="Minimum 8 characters"
                onChange={e => setPassForm({ ...passForm, new_password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={passForm.confirm_password} placeholder="Repeat new password"
                onChange={e => setPassForm({ ...passForm, confirm_password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary acct-save-btn" disabled={savingPass}>
              {savingPass ? <><span className="spinner-ring" style={{width:16,height:16}}/> Updating…</> : 'Update Password'}
            </button>
          </form>
        </Section>
      </main>
      <BottomNav />
    </div>
  );
}
