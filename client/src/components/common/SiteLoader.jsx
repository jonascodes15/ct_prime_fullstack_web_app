import { useState, useEffect } from 'react';
import './SiteLoader.css';

export default function SiteLoader() {
  const [visible,  setVisible]  = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState(0);

  useEffect(() => {
    const steps = [
      { target: 30,  delay: 0    },
      { target: 60,  delay: 400  },
      { target: 85,  delay: 800  },
      { target: 100, delay: 1200 },
    ];
    steps.forEach(({ target, delay }) => {
      setTimeout(() => setProgress(target), delay);
    });
    setTimeout(() => setPhase(1), 1600);
    setTimeout(() => setVisible(false), 2000);
  }, []);

  if (!visible) return null;

  return (
    <div className={`sl-wrap ${phase === 1 ? 'sl-fade' : ''}`}>
      <div className="sl-grid" />
      <div className="sl-orb sl-orb-1" />
      <div className="sl-orb sl-orb-2" />

      <div className="sl-logo">
        <div className="sl-logo-icon">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <path d="M8 32 L16 8 L24 20 L32 8" stroke="#1565ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="sl-logo-path"/>
          </svg>
        </div>
        <div className="sl-logo-text">
          <span className="sl-logo-top">COPY TRADE</span>
          <span className="sl-logo-bot">PRIME</span>
        </div>
      </div>

      <div className="sl-chart">
        <svg viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="slGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1565ff" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#1565ff" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path className="sl-chart-line" d="M0 48 L30 40 L60 43 L90 28 L120 32 L150 18 L180 12 L210 16 L240 6 L270 3 L300 1" stroke="#1565ff" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M0 48 L30 40 L60 43 L90 28 L120 32 L150 18 L180 12 L210 16 L240 6 L270 3 L300 1 L300 60 L0 60Z" fill="url(#slGrad)"/>
        </svg>
      </div>

      <div className="sl-progress-wrap">
        <div className="sl-progress-bar">
          <div className="sl-progress-fill" style={{ width: `${progress}%` }}/>
        </div>
        <div className="sl-progress-label">
          {progress < 100 ? 'Loading platform…' : 'Ready!'}
        </div>
      </div>

      <p className="sl-tagline">Smart Investments & Copy Trading</p>
    </div>
  );
}
