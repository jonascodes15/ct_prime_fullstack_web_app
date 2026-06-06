import { useEffect, useRef } from 'react';
import './PriceTicker.css';

export default function PriceTicker() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    // Remove any previously inserted scripts/widgets
    container.innerHTML = '';

    const script = document.createElement('script');
    script.type  = 'text/javascript';
    script.src   = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'BITSTAMP:BTCUSD',  title: 'BTC/USD'  },
        { proName: 'BITSTAMP:ETHUSD',  title: 'ETH/USD'  },
        { proName: 'BINANCE:BNBUSDT',  title: 'BNB/USDT' },
        { proName: 'BINANCE:SOLUSDT',  title: 'SOL/USDT' },
        { proName: 'BINANCE:XRPUSDT',  title: 'XRP/USDT' },
        { proName: 'FX:EURUSD',        title: 'EUR/USD'  },
        { proName: 'FX:GBPUSD',        title: 'GBP/USD'  },
        { proName: 'FX:USDJPY',        title: 'USD/JPY'  },
        { proName: 'FX:AUDUSD',        title: 'AUD/USD'  },
        { proName: 'NASDAQ:AAPL',      title: 'Apple'    },
        { proName: 'NASDAQ:TSLA',      title: 'Tesla'    },
        { proName: 'INDEX:SPX',        title: 'S&P 500'  },
        { proName: 'COMEX:GC1!',       title: 'Gold'     },
        { proName: 'NYMEX:CL1!',       title: 'Oil'      },
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
    <div className="price-ticker">
      <div className="tradingview-widget-container" ref={ref}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}
