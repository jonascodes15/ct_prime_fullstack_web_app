import './DashLoader.css';

/* Used when logging in — full screen overlay with branded animation */
export default function DashLoader({ message = 'Signing you in…' }) {
  return (
    <div className="dl-wrap">
      <div className="dl-grid" />
      <div className="dl-orb dl-orb-1" />
      <div className="dl-orb dl-orb-2" />

      {/* Spinning ring with logo */}
      <div className="dl-spinner-wrap">
        <svg className="dl-ring" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="rgba(21,101,255,0.12)" strokeWidth="4"/>
          <circle cx="50" cy="50" r="44" stroke="url(#dlGrad)" strokeWidth="4"
            strokeLinecap="round" strokeDasharray="276" strokeDashoffset="200"
            className="dl-ring-arc"/>
          <defs>
            <linearGradient id="dlGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1565ff"/>
              <stop offset="100%" stopColor="#00cfff"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="dl-logo-center">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <path d="M8 32 L16 8 L24 20 L32 8" stroke="#1565ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Pulse dots */}
      <div className="dl-dots">
        <span className="dl-dot" style={{ animationDelay: '0s'    }}/>
        <span className="dl-dot" style={{ animationDelay: '0.2s'  }}/>
        <span className="dl-dot" style={{ animationDelay: '0.4s'  }}/>
      </div>

      <p className="dl-message">{message}</p>

      {/* Mini live stats */}
      <div className="dl-stats">
        <div className="dl-stat">
          <span className="dl-stat-dot green"/>
          <span>Markets live</span>
        </div>
        <div className="dl-stat">
          <span className="dl-stat-dot blue"/>
          <span>Portfolio syncing</span>
        </div>
        <div className="dl-stat">
          <span className="dl-stat-dot cyan"/>
          <span>Traders active</span>
        </div>
      </div>
    </div>
  );
}
