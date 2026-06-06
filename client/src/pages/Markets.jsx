import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './Markets.css';

const ASSET_CLASSES = [
  { id: 'crypto',      icon: '₿',  label: 'Cryptocurrency', count: '300+',  spread: '0.4%',  desc: 'Trade the most popular cryptocurrencies with tight spreads and deep liquidity.' },
  { id: 'forex',       icon: '💱', label: 'Forex',          count: '70+',   spread: '0.2',   desc: 'Access the world\'s largest financial market with 70+ currency pairs.' },
  { id: 'stocks',      icon: '📈', label: 'Stocks',         count: '1800+', spread: '$3',    desc: 'Invest in global stocks from top exchanges worldwide.' },
  { id: 'indices',     icon: '📊', label: 'Indices',        count: '30+',   spread: '0.4',   desc: 'Trade major global indices including S&P 500, NASDAQ, FTSE 100 and more.' },
  { id: 'commodities', icon: '🥇', label: 'Commodities',    count: '20+',   spread: '0.3',   desc: 'Trade gold, silver, oil, natural gas, and agricultural commodities.' },
  { id: 'etfs',        icon: '🗂️', label: 'ETFs',           count: '100+',  spread: '$1',    desc: 'Diversify your portfolio with a range of Exchange-Traded Funds.' },
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
      width: '100%', height: 500,
      defaultColumn: 'overview',
      market: market,
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

      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <span className="section-tag">Markets</span>
          <h1>Trade Over <span style={{ color:'var(--blue)' }}>2,100+</span> Global Markets</h1>
          <p>Access the world's most popular financial instruments — from crypto and forex to stocks, indices, and commodities — all from one platform with competitive pricing.</p>
        </div>
      </section>

      {/* Asset class cards */}
      <section className="section-alt">
        <div className="section-inner">
          <div className="section-header centered">
            <span className="section-tag">Asset Classes</span>
            <h2>What Can You Trade?</h2>
            <p>We offer a comprehensive range of financial instruments across all major asset classes.</p>
          </div>
          <div className="asset-grid">
            {ASSET_CLASSES.map((a) => (
              <a href={`#${a.id}`} key={a.id} className="asset-card">
                <div className="ac-icon">{a.icon}</div>
                <div className="ac-info">
                  <div className="ac-label">{a.label}</div>
                  <div className="ac-count">{a.count} instruments</div>
                </div>
                <div className="ac-spread">
                  <div className="acs-from">From</div>
                  <div className="acs-val">{a.spread}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Asset descriptions */}
      <section className="section-dark">
        <div className="section-inner">
          <div className="markets-desc-grid">
            {ASSET_CLASSES.map((a) => (
              <div key={a.id} id={a.id} className="market-desc-card">
                <span className="mdc-icon">{a.icon}</span>
                <h4>{a.label}</h4>
                <p>{a.desc}</p>
                <div className="mdc-stat">
                  <span>{a.count}</span> instruments available
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Crypto Screener */}
      <section className="section-alt" id="live-prices">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Live Prices</span>
            <h2>Crypto Markets</h2>
            <p>Real-time cryptocurrency prices updated live.</p>
          </div>
          <TVScreener market="crypto" id="crypto-screener" />
        </div>
      </section>

      {/* Live Forex Screener */}
      <section className="section-dark" id="forex-screener">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Live Prices</span>
            <h2>Forex Markets</h2>
            <p>Live forex rates across all major, minor, and exotic currency pairs.</p>
          </div>
          <TVScreener market="forex" id="forex-widget" />
        </div>
      </section>

      {/* CTA */}
      <section className="section-alt">
        <div className="section-inner">
          <div className="markets-cta">
            <h2>Ready to Start Trading?</h2>
            <p>Open a free account and get access to 2,100+ instruments instantly.</p>
            <div style={{ display:'flex', gap:12, marginTop:28, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ padding:'14px 36px', fontSize:'0.95rem' }}>Open Free Account</Link>
              <Link to="/login"    className="btn-outline"  style={{ padding:'14px 36px', fontSize:'0.95rem' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
