import { useEffect, useRef } from 'react';
import './MarketTable.css';

export default function MarketTable() {
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
      width: '100%', height: 600,
      defaultColumn: 'overview',
      defaultScreen: 'top_gainers',
      market: 'crypto',
      showToolbar: true,
      colorTheme: 'dark',
      locale: 'en',
    });
    container.appendChild(script);
  }, []);

  return (
    <section className="market-section">
      <div className="market-inner">
        <div className="market-header">
          <span className="section-tag">Live Markets</span>
          <h2>Trade Over <span className="highlight">2,100+</span> Global Markets</h2>
          <p>Real-time prices across crypto, forex, stocks, indices, and commodities.</p>
        </div>
        <div className="market-widget">
          <div className="tradingview-widget-container" ref={ref}>
            <div className="tradingview-widget-container__widget" />
          </div>
        </div>
      </div>
    </section>
  );
}
