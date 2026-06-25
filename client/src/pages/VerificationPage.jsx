import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './VerificationPage.css';

export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // State passed from Register or Login
  const { email, token, user, full_name } = location.state || {};

  const [digits, setDigits] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const sentRef = useRef(false); // StrictMode guard

  /* ── Verify required state and start countdown ── */
  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
    if (sentRef.current) return;
    sentRef.current = true;

    // The server already sends a verification email during registration or login,
    // so we do not auto-send another one here on page mount.
    startCountdown();
  }, []);

  /* ── Countdown timer ── */
  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  /* ── Digit input handlers ── */
  const handleDigitChange = (index, value) => {
    // Handle paste of full code
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, 5).split('');
      const newDigits = [...digits];
      pastedDigits.forEach((d, i) => { if (index + i < 5) newDigits[index + i] = d; });
      setDigits(newDigits);
      const nextIndex = Math.min(index + pastedDigits.length, 4);
      inputRefs.current[nextIndex]?.focus();
      if (pastedDigits.length === 5 - index) {
        setTimeout(() => submitCode(newDigits.join('')), 80);
      }
      return;
    }

    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-advance
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit on last digit
    if (value && index === 4) {
      const code = newDigits.join('');
      if (code.length === 5) setTimeout(() => submitCode(code), 80);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 4) inputRefs.current[index + 1]?.focus();
  };

  /* ── Submit ── */
  const submitCode = async (code) => {
    if (verifying) return;
    setError('');
    setVerifying(true);
    try {
      await api.post('/auth/verify-code', { email, code });
      setSuccess('Email verified! Redirecting you in...');

      // Log the user in
      if (token && user) {
        login({ full_name: user.full_name || full_name, email, role: user.role || 'client' }, token);
        setTimeout(() => navigate('/activate-trader'), 1200);
      } else {
        setTimeout(() => navigate('/login'), 1400);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
      setDigits(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 5) { setError('Please enter all 5 digits.'); return; }
    submitCode(code);
  };

  /* ── Resend ── */
  const handleResend = async () => {
    if (!canResend || resending) return;
    setError('');
    setResending(true);
    try {
      await api.post('/auth/resend-code', { email });
      setSuccess('A new code has been sent to your email.');
      setTimeout(() => setSuccess(''), 4000);
      setDigits(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-orb" />
        <div className="auth-left-top">
          <Link to="/" className="auth-back-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Home
          </Link>
          <div className="auth-left-logo">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <path d="M8 32 L16 8 L24 20 L32 8" stroke="#1565ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            COPY TRADE<em>PRIME</em>
          </div>
        </div>
        <div className="auth-left-content">
          <div className="vp-left-icon">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#1565ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="14" width="40" height="30" rx="3" />
              <polyline points="6,14 26,30 46,14" />
            </svg>
          </div>
          <h2>Check Your Inbox</h2>
          <p>We've sent a 5-digit verification code to <strong style={{ color: '#e8f0ff' }}>{email}</strong>. </p>
        </div>
        <div className="auth-left-stats">
          {[
            { val: '5-Digit', label: 'Secure Code' },
            { val: '10 Min', label: 'Code Expiry' },
            { val: '256-bit', label: 'Encryption' },
            { val: '24/7', label: 'Support' },
          ].map((s) => (
            <div key={s.label} className="als-card">
              <span className="als-val">{s.val}</span>
              <span className="als-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-mobile-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Home
          </Link>

          <div className="vp-icon-header">
            <div className="vp-envelope-icon">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="12" width="36" height="28" rx="3" />
                <polyline points="6,12 24,28 42,12" />
              </svg>
            </div>
          </div>

          <div className="auth-form-header">
            <h1>Verify Your Email</h1>
            <p>Enter the 5-digit code sent to</p>
            <p className="vp-email-display">{email}</p>
            <p>Check your spam folder if you don't see it.</p>
          </div>

          {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}
          {success && <div className="alert-success" style={{ marginBottom: 20 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            {success}
          </div>}

          <form onSubmit={handleSubmit}>
            {/* 5 digit boxes */}
            <div className="vp-digits-row">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className={`vp-digit-input ${d ? 'filled' : ''} ${verifying ? 'loading' : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  autoComplete="one-time-code"
                  disabled={verifying}
                />
              ))}
            </div>

            {verifying && (
              <div className="vp-verifying">
                <span className="spinner-ring" style={{ width: 18, height: 18 }} />
                Verifying…
              </div>
            )}

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={verifying || digits.join('').length < 5}
            >
              {verifying
                ? <><span className="spinner-ring" style={{ width: 18, height: 18 }} /> Verifying…</>
                : 'Verify Email'
              }
            </button>
          </form>

          {/* Resend section */}
          <div className="vp-resend">
            <p>Didn't receive a code?</p>
            {canResend ? (
              <button
                className="vp-resend-btn"
                onClick={handleResend}
                disabled={resending}
              >
                {resending
                  ? <><span className="spinner-ring" style={{ width: 14, height: 14 }} /> Sending…</>
                  : 'Resend Code'
                }
              </button>
            ) : (
              <span className="vp-countdown">
                Resend in <strong>{countdown}s</strong>
              </span>
            )}
          </div>

          <p className="auth-switch">
            Wrong email? <Link to="/register">Start over</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
