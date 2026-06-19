import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { traderService } from '../services/dataServices';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BottomNav from '../components/common/BottomNav';
import AccountMenu from '../components/common/AccountMenu';
import './TraderActivation.css';

/* ── Generate a unique random candlestick chart SVG per card ── */
function CandleChart({ seed = 0 }) {
  const W = 300, H = 180;
  const candles = [];
  const linePoints = [];
  let rng = seed * 9301 + 49297;
  const rand = () => { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; };

  let price = 60 + rand() * 40;

  for (let i = 0; i < 18; i++) {
    const x       = 10 + i * 16;
    const change  = (rand() - 0.46) * 18;
    const open    = price;
    const close   = Math.max(10, Math.min(H - 10, price + change));
    const high    = Math.min(open, close) - rand() * 8;
    const low     = Math.max(open, close) + rand() * 8;
    const bullish = close < open; // SVG y inverted

    candles.push({ x, open, close, high, low, bullish });
    linePoints.push(`${x},${close}`);
    price = close;
  }

  const linePath = `M ${linePoints.join(' L ')}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width={W} height={H} fill="#050d1a"/>

      {/* Subtle grid lines */}
      {[40,80,120,160].map(y => (
        <line key={y} x1="0" y1={y} x2={W} y2={y}
          stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
      ))}

      {/* Candles */}
      {candles.map((c, i) => (
        <g key={i}>
          {/* Wick */}
          <line x1={c.x} y1={c.high} x2={c.x} y2={c.low}
            stroke={c.bullish ? '#00e676' : '#ff3d57'}
            strokeWidth="1" opacity="0.7"/>
          {/* Body */}
          <rect
            x={c.x - 4}
            y={Math.min(c.open, c.close)}
            width={8}
            height={Math.max(2, Math.abs(c.open - c.close))}
            fill={c.bullish ? '#00e676' : '#ff3d57'}
            opacity="0.85"
            rx="1"
          />
        </g>
      ))}

      {/* Price line */}
      <path d={linePath} fill="none"
        stroke="rgba(21,101,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Single trader card ── */
function TraderCard({ trader, selected, onSelect }) {
  return (
    <div
      className={`trader-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(trader.id)}
    >
      {/* Candlestick chart background */}
      <div className="tc-chart-bg">
        <CandleChart seed={trader.id * 137 + trader.name.charCodeAt(0)} />
      </div>

      {/* Dark gradient overlay */}
      <div className="tc-overlay" />

      {/* Activate / Selected button */}
      <button
        className={`tc-activate-btn ${selected ? 'is-selected' : ''}`}
        onClick={(e) => { e.stopPropagation(); onSelect(trader.id); }}
      >
        {selected ? (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Selected
          </>
        ) : 'Activate'}
      </button>

      {/* Avatar centred */}
      <div className="tc-avatar-wrap">
        <div className="tc-avatar">
          {trader.avatar_url
            ? <img src={trader.avatar_url} alt={trader.name} />
            : <div className="tc-avatar-placeholder">{trader.name[0]}</div>
          }
          <span className={`tc-status ${trader.is_active ? 'online' : 'offline'}`} />
        </div>
      </div>

      {/* Name + stats at the bottom */}
      <div className="tc-info-bottom">
        <div className="tc-name">{trader.name}</div>
        <div className="tc-strategy">{trader.strategy}</div>

        <div className="tc-stats">
          <div className="tc-stat">
            <span className="ts-label">Win Rate</span>
            <span className="ts-val green">{trader.win_rate}%</span>
          </div>
          <div className="tc-stat">
            <span className="ts-label">Monthly ROI</span>
            <span className="ts-val green">+{trader.monthly_return}%</span>
          </div>
          <div className="tc-stat">
            <span className="ts-label">Followers</span>
            <span className="ts-val">{Number(trader.total_followers).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function TraderActivation() {
  const [traders,    setTraders]    = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activating, setActivating] = useState(false);
  const [error,      setError]      = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    traderService.list()
      .then(({ data }) => setTraders(data))
      .catch(() => setError('Failed to load traders. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const handleActivate = async () => {
    if (!selected) return;
    setActivating(true);
    try {
      await traderService.activate(selected);
      navigate('/dashboard');
    } catch {
      setError('Failed to activate trader. Please try again.');
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="activation-page">
      <div className="activation-bg" />
      <AccountMenu />

      <div className="activation-inner">
        {/* Header */}
        <div className="activation-header">
          <div className="activation-logo">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <path d="M8 32L16 8L24 20L32 8" stroke="#1565ff"
                strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            CopyTrade<em>Prime</em>
          </div>
          <h1>Choose Your Expert Trader</h1>
          <p>Select a trader to copy. Their trades will be mirrored in your account automatically.</p>
        </div>

        {/* Error */}
        {error && <div className="activation-error">{error}</div>}

        {/* Loading */}
        {loading && (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
            <LoadingSpinner size={40} />
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <>
            <div className="traders-grid">
              {traders.map((t) => (
                <TraderCard
                  key={t.id}
                  trader={t}
                  selected={selected === t.id}
                  onSelect={setSelected}
                />
              ))}
            </div>

            <div className="activation-footer">
              <button
                className="btn-primary activation-btn"
                disabled={!selected || activating}
                onClick={handleActivate}
              >
                {activating
                  ? <><span className="spinner-ring" style={{ width:18, height:18 }} /> Activating…</>
                  : 'Activate Selected Trader'
                }
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
