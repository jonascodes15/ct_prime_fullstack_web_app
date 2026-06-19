import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import BottomNav from '../components/common/BottomNav';
import AccountMenu from '../components/common/AccountMenu';
import './LiveMarkets.css';

const TABS = [
  { id: 'crypto',      label: 'Crypto'      },
  { id: 'forex',       label: 'Forex'       },
  { id: 'stocks',      label: 'Stocks'      },
  { id: 'commodities', label: 'Commodities' },
  { id: 'indices',     label: 'Indices'     },
];

function TVScreener({ market }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 580,
      defaultColumn: 'overview',
      market,
      showToolbar: true,
      colorTheme: 'dark',
      locale: 'en',
    });
    container.appendChild(script);
  }, [market]);

  return (
    <div className="lm-screener-wrap" ref={ref}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

function TVForexHeatMap() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 400,
      currencies: ['EUR','USD','JPY','GBP','CHF','AUD','CAD','NZD'],
      isTransparent: true,
      colorTheme: 'dark',
      locale: 'en',
    });
    container.appendChild(script);
  }, []);
  return (
    <div className="lm-heatmap-wrap">
      <div className="lm-section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        Forex Heat Map
      </div>
      <div className="lm-widget-box" ref={ref}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

function TVCryptoCoins() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      dataSource: 'Crypto',
      blockSize: 'market_cap_calc',
      blockColor: 'change',
      locale: 'en',
      symbolUrl: '',
      colorTheme: 'dark',
      hasTopBar: true,
      isDataSetEnabled: true,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      isMonoSize: false,
      width: '100%',
      height: 400,
    });
    container.appendChild(script);
  }, []);
  return (
    <div className="lm-heatmap-wrap">
      <div className="lm-section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.5 9h1.5a1.5 1.5 0 010 3h-1v1h1a2 2 0 010 4H9.5M12 7v2M12 18v-2"/>
        </svg>
        Crypto Heat Map
      </div>
      <div className="lm-widget-box" ref={ref}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

export default function LiveMarkets() {
  const [active, setActive] = useState('crypto');

  return (
    <div className="app-layout">
      <Sidebar />
      <AccountMenu />
      <main className="app-main app-main-markets">
        <div className="dash-header">
          <div>
            <h1>Live Markets</h1>
            <p>Real-time prices across crypto, forex, stocks, commodities and indices.</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="lm-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`lm-tab ${active === t.id ? 'active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Heat maps for crypto/forex */}
        {active === 'crypto' && (
          <div className="lm-heatmaps-row">
            <TVCryptoCoins />
          </div>
        )}
        {active === 'forex' && (
          <div className="lm-heatmaps-row">
            <TVForexHeatMap />
          </div>
        )}

        {/* Screener table */}
        <div className="lm-screener-section">
          <TVScreener market={
            active === 'crypto'      ? 'crypto'      :
            active === 'forex'       ? 'forex'        :
            active === 'stocks'      ? 'america'      :
            active === 'commodities' ? 'america'      :
            'america'
          } />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
