import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FOMOPopup.css';

export default function FOMOPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('fomo_dismissed')) return;
    const timer = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      sessionStorage.setItem('fomo_dismissed', '1');
    }, 320);
  };

  if (!visible) return null;

  return (
    <>
      <div className={`fomo-backdrop ${closing ? 'fomo-out' : ''}`} onClick={dismiss} />
      <div className={`fomo-popup ${closing ? 'fomo-out' : ''}`}>
        <button className="fomo-close" onClick={dismiss} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div className="fomo-live-badge">
          <span className="fomo-pulse-dot"/>
          400,000+ traders active right now
        </div>
        <h2 className="fomo-heading">Stop Guessing<br/>the Markets.</h2>
        <div className="fomo-chart">
          <svg viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1565ff" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#1565ff" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0 65 L30 58 L55 62 L85 45 L110 48 L140 30 L170 22 L200 28 L230 14 L260 8 L290 4 L320 2" stroke="#1565ff" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M0 65 L30 58 L55 62 L85 45 L110 48 L140 30 L170 22 L200 28 L230 14 L260 8 L290 4 L320 2 L320 80 L0 80Z" fill="url(#fcGrad)"/>
            <rect x="242" y="0" width="72" height="22" rx="4" fill="rgba(0,230,118,0.15)" stroke="rgba(0,230,118,0.4)" strokeWidth="1"/>
            <text x="278" y="15" textAnchor="middle" fill="#00e676" fontSize="10" fontWeight="700">+24.3%</text>
          </svg>
        </div>
        <p className="fomo-sub">Join <strong>400K+ smart investors</strong> who let veteran traders do the heavy lifting.</p>
        <div className="fomo-social-proof">
          <div className="fomo-avatars">
            {['A','K','M','J','P'].map((l, i) => (
              <div key={i} className="fomo-avatar" style={{ background: ['#1565ff','#00cfff','#00e676','#ff3d57','#ffb800'][i] }}>{l}</div>
            ))}
          </div>
          <span className="fomo-joined-text"><strong>127 people</strong> joined in the last hour</span>
        </div>
        <div className="fomo-stats">
          <div className="fomo-stat"><span className="fomo-stat-val">$142K+</span><span className="fomo-stat-label">Paid out today</span></div>
          <div className="fomo-stat-divider"/>
          <div className="fomo-stat"><span className="fomo-stat-val">15%</span><span className="fomo-stat-label">Avg weekly gain</span></div>
          <div className="fomo-stat-divider"/>
          <div className="fomo-stat"><span className="fomo-stat-val">2,100+</span><span className="fomo-stat-label">Markets</span></div>
        </div>
        <Link to="/register" className="fomo-cta" onClick={dismiss}>
          Start Copying for Free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
        <p className="fomo-disclaimer">No credit card required · Cancel anytime</p>
      </div>
    </>
  );
}
