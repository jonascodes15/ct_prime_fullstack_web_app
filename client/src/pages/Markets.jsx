import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './Markets.css';

/* ── High-quality inline SVG icons per asset class ── */
const CryptoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M17.5 11.8c.18-1.22-.74-1.88-2.01-2.32l.41-1.65-.99-.25-.4 1.6c-.26-.07-.53-.13-.8-.19l.4-1.61-.99-.25-.41 1.65c-.22-.05-.43-.1-.63-.15l-1.38-.35-.27 1.07s.74.17.72.18c.4.1.48.37.47.59l-.47 1.88c.03.01.06.02.1.03l-.1-.03-.66 2.64c-.05.12-.18.31-.47.24.01.02-.72-.18-.72-.18l-.5 1.15 1.31.33c.24.06.48.13.71.19l-.41 1.67 1 .25.41-1.65c.27.07.54.14.8.21l-.41 1.64.99.25.41-1.66c1.72.32 3.01.19 3.56-1.36.44-1.25-.02-1.97-.92-2.44.65-.15 1.14-.58 1.27-1.47zm-2.27 3.19c-.32 1.25-2.44.57-3.13.4l.56-2.22c.69.17 2.88.51 2.57 1.82zm.32-3.25c-.29 1.14-2.05.56-2.62.42l.5-2.01c.57.14 2.41.41 2.12 1.59z" fill="currentColor"/>
  </svg>
);

const ForexIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 14h20M4 14C4 8.477 8.477 4 14 4s10 4.477 10 10-4.477 10-10 10S4 19.523 4 14z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M4 14c0 2.761 4.477 5 10 5s10-2.239 10-5M4 14c0-2.761 4.477-5 10-5s10 2.239 10 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M14 4v20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const StocksIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="4,20 9,13 13,16 18,9 24,12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="4" y1="24" x2="24" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="4" y1="4"  x2="4"  y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="9"  cy="13" r="1.5" fill="currentColor"/>
    <circle cx="13" cy="16" r="1.5" fill="currentColor"/>
    <circle cx="18" cy="9"  r="1.5" fill="currentColor"/>
    <circle cx="24" cy="12" r="1.5" fill="currentColor"/>
  </svg>
);

const IndicesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4"  y="18" width="4" height="6"  rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="12" y="12" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="20" y="6"  width="4" height="18" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="2" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const CommoditiesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3l2.8 5.7 6.2.9-4.5 4.4 1.06 6.2L14 17.27 8.44 20.2l1.06-6.2L5 9.6l6.2-.9L14 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M14 9v5M14 9l2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const ETFsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3"  y="3"  width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="15" y="3"  width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="3"  y="15" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="15" y="15" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="8"  y1="6"  x2="8"  y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="20" y1="6"  x2="20" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="6"  y1="8"  x2="10" y2="8"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const ASSETS = [
  {
    id: 'crypto',
    Icon: CryptoIcon,
    label: 'Cryptocurrency',
    count: '300+',
    spread: '0.4%',
    color: '#F7931A',
    desc: 'Trade the most popular cryptocurrencies with tight spreads and deep liquidity across spot and derivatives markets.',
    features: ['Bitcoin & Altcoins', '24/7 Trading', 'Deep liquidity', 'Leverage available'],
  },
  {
    id: 'forex',
    Icon: ForexIcon,
    label: 'Forex',
    count: '70+',
    spread: '0.2',
    color: '#1565ff',
    desc: 'Access the world\'s largest financial market with 70+ currency pairs including majors, minors and exotics.',
    features: ['Major pairs', 'Minor pairs', 'Exotic pairs', '24/5 market hours'],
  },
  {
    id: 'stocks',
    Icon: StocksIcon,
    label: 'Stocks',
    count: '1,800+',
    spread: '$3',
    color: '#00e676',
    desc: 'Invest in global stocks from the world\'s top exchanges including NYSE, NASDAQ, LSE and more.',
    features: ['US stocks', 'EU stocks', 'UK stocks', 'Fractional shares'],
  },
  {
    id: 'indices',
    Icon: IndicesIcon,
    label: 'Indices',
    count: '30+',
    spread: '0.4',
    color: '#00cfff',
    desc: 'Trade major global indices including S&P 500, NASDAQ 100, FTSE 100, DAX 40, Nikkei 225 and more.',
    features: ['US indices', 'EU indices', 'Asia indices', 'CFD trading'],
  },
  {
    id: 'commodities',
    Icon: CommoditiesIcon,
    label: 'Commodities',
    count: '20+',
    spread: '0.3',
    color: '#FFB800',
    desc: 'Trade precious metals, energy, and agricultural commodities with tight spreads and full transparency.',
    features: ['Gold & Silver', 'Oil & Gas', 'Agriculture', 'Metals'],
  },
  {
    id: 'etfs',
    Icon: ETFsIcon,
    label: 'ETFs',
    count: '100+',
    spread: '$1',
    color: '#8247E5',
    desc: 'Diversify your portfolio with a wide range of Exchange-Traded Funds tracking global markets and sectors.',
    features: ['Sector ETFs', 'Bond ETFs', 'Commodity ETFs', 'Global exposure'],
  },
];

function TVScreener({ market, id }) {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.type  = 'text/javascript';
    script.src   = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 550,
      defaultColumn: 'overview',
      market,
      showToolbar: true,
      colorTheme: 'dark',
      locale: 'en',
    });
    container.appendChild(script);
  }, [market]);

  return (
    <div className="tv-widget-wrap" id={id}>
      <div className="tradingview-widget-container" ref={ref}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

export default function Markets() {
  return (
    <div className="page-body">
      <Navbar />

      {/* ── Hero ── */}
      <section className="mkt-hero">
        <div className="mkt-hero-grid" />
        <div className="mkt-hero-glow mkt-glow-l" />
        <div className="mkt-hero-glow mkt-glow-r" />
        <div className="mkt-hero-inner">
          <div className="mkt-hero-tag">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--blue)"><circle cx="6" cy="6" r="6"/></svg>
            Markets
          </div>
          <h1>Trade Over <span className="mkt-blue">2,100+</span> Global Markets</h1>
          <p>Access the world's most popular financial instruments — from crypto and forex to stocks, indices, and commodities — all from one platform with competitive pricing.</p>
          <div className="mkt-hero-actions">
            <Link to="/register" className="btn-primary mkt-hero-btn">Open Free Account</Link>
            <Link to="/login"    className="mkt-ghost-btn">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── Asset class overview cards ── */}
      <section className="mkt-section mkt-section-dark">
        <div className="mkt-inner">
          <div className="mkt-section-hdr">
            <div className="mkt-tag">Asset Classes</div>
            <h2>What Can You Trade?</h2>
            <p>A comprehensive range of financial instruments across every major asset class, with transparent pricing and deep liquidity.</p>
          </div>

          <div className="mkt-asset-grid">
            {ASSETS.map((a) => (
              <a href={`#${a.id}`} key={a.id} className="mkt-asset-card" style={{ '--ac': a.color }}>
                <div className="mac-top">
                  <div className="mac-icon-wrap">
                    <a.Icon />
                  </div>
                  <div className="mac-spread">
                    <div className="mac-from">From</div>
                    <div className="mac-val">{a.spread}</div>
                  </div>
                </div>
                <div className="mac-label">{a.label}</div>
                <div className="mac-count">{a.count} instruments</div>
                <div className="mac-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detailed asset cards ── */}
      <section className="mkt-section mkt-section-mid">
        <div className="mkt-inner">
          <div className="mkt-detail-grid">
            {ASSETS.map((a) => (
              <div key={a.id} id={a.id} className="mkt-detail-card" style={{ '--ac': a.color }}>
                <div className="mdc-header">
                  <div className="mdc-icon-circle">
                    <a.Icon />
                  </div>
                  <div>
                    <h3>{a.label}</h3>
                    <div className="mdc-count-badge">{a.count} instruments</div>
                  </div>
                </div>
                <p>{a.desc}</p>
                <ul className="mdc-features">
                  {a.features.map((f) => (
                    <li key={f}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mdc-spread-row">
                  <span className="mdc-spread-label">Spread from</span>
                  <span className="mdc-spread-val">{a.spread}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Crypto Screener ── */}
      <section className="mkt-section mkt-section-dark" id="live-prices">
        <div className="mkt-inner">
          <div className="mkt-section-hdr">
            <div className="mkt-tag">Live Prices</div>
            <h2>Crypto Markets</h2>
            <p>Real-time cryptocurrency prices, updated live via TradingView.</p>
          </div>
          <TVScreener market="crypto" id="crypto-screener" />
        </div>
      </section>

      {/* ── Live Forex Screener ── */}
      <section className="mkt-section mkt-section-mid" id="forex-screener">
        <div className="mkt-inner">
          <div className="mkt-section-hdr">
            <div className="mkt-tag">Live Prices</div>
            <h2>Forex Markets</h2>
            <p>Live forex rates across all major, minor, and exotic currency pairs.</p>
          </div>
          <TVScreener market="forex" id="forex-widget" />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mkt-section mkt-section-dark">
        <div className="mkt-inner">
          <div className="mkt-cta-block">
            <div className="mkt-cta-glow" />
            <div className="mkt-cta-content">
              <h2>Ready to Start Trading?</h2>
              <p>Open a free account and get instant access to 2,100+ instruments with competitive spreads.</p>
              <div className="mkt-cta-actions">
                <Link to="/register" className="btn-primary mkt-hero-btn">Open Free Account</Link>
                <Link to="/login"    className="mkt-ghost-btn">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
