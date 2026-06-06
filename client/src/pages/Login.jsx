import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import './AuthPages.css';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.login(form);
      login({ full_name: data.full_name, email: form.email, role: data.role }, data.token);
      navigate(data.requiresTraderActivation ? '/activate-trader' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-orb" />
        <div className="auth-left-top">
          <Link to="/" className="auth-back-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Home
          </Link>
          <div className="auth-left-logo">
            <span className="logo-mark">◈</span>
            PRIME<em>COPY</em>TRADE
          </div>
        </div>
        <div className="auth-left-content">
          <h2>Access Your Trading Dashboard</h2>
          <p>Sign in to monitor your copy trading performance, manage deposits, and track your portfolio in real time.</p>
        </div>
        <div className="auth-left-stats">
          {[
            { val: '400K+',  label: 'Active Traders' },
            { val: '2100+',  label: 'Markets' },
            { val: '7+ Yrs', label: 'Experience' },
            { val: '150+',   label: 'Countries' },
          ].map((s) => (
            <div key={s.label} className="als-card">
              <span className="als-val">{s.val}</span>
              <span className="als-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-mobile-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Home
          </Link>

          <div className="auth-form-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your trading dashboard</p>
          </div>

          {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter your password"
                value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner-ring" style={{ width:18, height:18 }} /> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
