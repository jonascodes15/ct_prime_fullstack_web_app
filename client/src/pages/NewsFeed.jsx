import { useEffect, useRef } from 'react';
import Sidebar from '../components/common/Sidebar';
import BottomNav from '../components/common/BottomNav';
import AccountMenu from '../components/common/AccountMenu';
import './NewsFeed.css';

function TVNewsWidget() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: 'all_symbols',
      isTransparent: true,
      displayMode: 'regular',
      width: '100%',
      height: 700,
      colorTheme: 'dark',
      locale: 'en',
    });
    container.appendChild(script);
  }, []);

  return (
    <div className="tv-news-widget" ref={ref}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

function TVTickerNews() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'BITSTAMP:BTCUSD', title: 'BTC/USD' },
        { proName: 'BITSTAMP:ETHUSD', title: 'ETH/USD' },
        { proName: 'FX:EURUSD',       title: 'EUR/USD' },
        { proName: 'FX:GBPUSD',       title: 'GBP/USD' },
        { proName: 'INDEX:SPX',       title: 'S&P 500' },
        { proName: 'NASDAQ:AAPL',     title: 'Apple'   },
        { proName: 'NASDAQ:TSLA',     title: 'Tesla'   },
        { proName: 'COMEX:GC1!',      title: 'Gold'    },
        { proName: 'NYMEX:CL1!',      title: 'Oil'     },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      colorTheme: 'dark',
      displayMode: 'adaptive',
      locale: 'en',
    });
    container.appendChild(script);
  }, []);

  return (
    <div className="nf-ticker-wrap" ref={ref}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default function NewsFeed() {
  return (
    <div className="app-layout">
      <Sidebar />
      <AccountMenu />
      <main className="app-main app-main-feed">
        <div className="dash-header">
          <div>
            <h1>News Feed</h1>
            <p>Live market news and updates from global financial markets.</p>
          </div>
        </div>

        {/* Live ticker strip */}
        <div className="nf-ticker-section">
          <TVTickerNews />
        </div>

        {/* Category chips */}
        <div className="nf-categories">
          {['All News','Crypto','Forex','Stocks','Commodities','Indices','Economy'].map((c) => (
            <span key={c} className={`nf-chip ${c === 'All News' ? 'active' : ''}`}>{c}</span>
          ))}
        </div>

        {/* Main news feed */}
        <div className="nf-feed-wrap">
          <TVNewsWidget />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
