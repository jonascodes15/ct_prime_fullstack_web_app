import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import './AuthPages.css';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) return setError('Passwords do not match.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    setLoading(true);
    try {
      const { data } = await authService.register({
        full_name: form.full_name, email: form.email, password: form.password,
      });
      login({ full_name: form.full_name, email: form.email, role: 'client' }, data.token);
      navigate('/activate-trader');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-orb" />
        <div className="auth-left-top">
          <Link to="/" className="auth-back-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Back to Home
          </Link>
          <div className="auth-left-logo">
            <span className="logo-mark">◈</span>
            PRIME<em>COPY</em>TRADE
          </div>
        </div>
        <div className="auth-left-content">
          <h2>Start Copy Trading Today</h2>
          <p>Create a free account and mirror the trades of expert traders to grow your portfolio automatically.</p>
        </div>
        <div className="auth-left-stats">
          {[
            { val: '$0', label: 'Account Fee' },
            { val: '0.2', label: 'FX Pips From' },
            { val: '100%', label: 'Transparent' },
            { val: '24/7', label: 'Support' },
          ].map((s) => (
            <div key={s.label} className="als-card">
              <span className="als-val">{s.val}</span>
              <span className="als-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-mobile-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Back to Home
          </Link>

          <div className="auth-form-header">
            <h1>Create Your Account</h1>
            <p>Join 400,000+ traders growing their portfolios</p>
          </div>

          {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="full_name" placeholder="John Doe"
                value={form.full_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Minimum 8 characters"
                value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirm_password" placeholder="Repeat your password"
                value={form.confirm_password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner-ring" style={{ width: 18, height: 18 }} /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
