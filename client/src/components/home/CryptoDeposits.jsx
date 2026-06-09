import { Link } from 'react-router-dom';
import './CryptoDeposits.css';

/* ── Inline SVG crypto logos (real branded icons) ── */
const BTC = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
    <path fill="#fff" d="M22.2 13.8c.31-2.09-1.28-3.21-3.46-3.96l.71-2.84-1.73-.43-.69 2.76c-.45-.11-.92-.22-1.38-.33l.69-2.78-1.73-.43-.71 2.84c-.38-.09-.75-.17-1.1-.26l-2.39-.6-.46 1.85s1.28.29 1.25.31c.7.17.83.64.81 1.01l-.81 3.26c.05.01.11.03.18.06l-.18-.05-1.14 4.56c-.09.21-.31.53-.8.41.02.03-1.25-.31-1.25-.31l-.86 1.98 2.25.56c.42.11.83.22 1.23.32l-.72 2.88 1.73.43.71-2.84c.47.13.93.25 1.38.36l-.71 2.83 1.73.43.72-2.87c2.97.56 5.2.34 6.14-2.35.76-2.16-.04-3.41-1.6-4.23 1.14-.26 2-.1 2.23-1.87zm-3.98 5.58c-.54 2.16-4.19.99-5.37.7l.96-3.83c1.18.3 4.96.88 4.41 3.13zm.54-5.62c-.49 1.97-3.52.97-4.5.72l.87-3.48c.98.25 4.14.71 3.63 2.76z"/>
  </svg>
);

const ETH = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#627EEA"/>
    <path fill="#fff" fillOpacity=".6" d="M16.498 4v8.87l7.497 3.35z"/>
    <path fill="#fff" d="M16.498 4L9 16.22l7.498-3.35z"/>
    <path fill="#fff" fillOpacity=".6" d="M16.498 21.97v6.02L24 17.62z"/>
    <path fill="#fff" d="M16.498 27.99v-6.02L9 17.62z"/>
    <path fill="#fff" fillOpacity=".2" d="M16.498 20.57l7.497-4.35-7.497-3.35z"/>
    <path fill="#fff" fillOpacity=".6" d="M9 16.22l7.498 4.35v-7.7z"/>
  </svg>
);

const DASH = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#1C75BC"/>
    <path fill="#fff" d="M10.6 19.5h6.9l1-3.4H11.6l1-3.3h6.9l1.2-4H8.5L5.6 23h12.5l.9-3.4h-8.4zm16.3-6.6c-.4-1.7-2-2.9-4.1-2.9h-2.8l-1.2 4h2.8c1.1 0 1.8.5 2 1.6.3 1.4-.6 2.6-2.3 2.6h-2.7l-1 3.4h2.8c3.6 0 6.3-2.7 5.5-8.7z"/>
  </svg>
);

const EOS = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#19191A"/>
    <path fill="#fff" d="M16 5l-9.5 5.5v11L16 27l9.5-5.5v-11zm0 2.5l7.3 4.2v8.6L16 24.5l-7.3-4.2v-8.6zm-4 9.7l4 2.3 4-2.3v-4.5l-4-2.3-4 2.3z"/>
  </svg>
);

const NEO = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#58BF00"/>
    <path fill="#fff" d="M10 9h2.9l8.5 10.4V9H24v14h-2.9L12.7 12.6V23H10z"/>
  </svg>
);

const POLYGON = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#8247E5"/>
    <path fill="#fff" d="M20.9 13.4c-.4-.2-.9-.2-1.3 0l-3.1 1.8-2.1 1.2-3.1 1.8c-.4.2-.9.2-1.3 0l-2.5-1.4c-.4-.2-.6-.6-.6-1.1v-2.7c0-.4.2-.9.6-1.1l2.4-1.4c.4-.2.9-.2 1.3 0l2.4 1.4c.4.2.6.6.6 1.1v1.8l2.1-1.2v-1.8c0-.4-.2-.9-.6-1.1l-4.5-2.6c-.4-.2-.9-.2-1.3 0L6.4 12c-.4.2-.6.6-.6 1.1v5.3c0 .4.2.9.6 1.1l4.6 2.6c.4.2.9.2 1.3 0l3.1-1.8 2.1-1.2 3.1-1.8c.4-.2.9-.2 1.3 0l2.4 1.4c.4.2.6.6.6 1.1v2.7c0 .4-.2.9-.6 1.1L22 23c-.4.2-.9.2-1.3 0l-2.4-1.4c-.4-.2-.6-.6-.6-1.1v-1.8l-2.1 1.2v1.8c0 .4.2.9.6 1.1l4.6 2.6c.4.2.9.2 1.3 0l4.6-2.6c.4-.2.6-.6.6-1.1v-5.3c0-.4-.2-.9-.6-1.1z"/>
  </svg>
);

const LTC = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#BFBBBB"/>
    <path fill="#fff" d="M16 5C10 5 5 10 5 16s5 11 11 11 11-5 11-11S22 5 16 5zm-1.4 14.6l.8-3.3-1.1.3.4-1.6 1.1-.3 1.8-6.9h2.8l-1.8 6.9 1.1-.3-.4 1.6-1.1.3-1 3.3z"/>
  </svg>
);

const XRP = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#00AAE4"/>
    <path fill="#fff" d="M22.8 9h2.6L19.7 14.7c-2 1.8-5.1 1.8-7.1 0L6.9 9h2.6l4.7 4.5c1.1 1 2.9 1 4 0zm-13.6 14h-2.6l5.7-5.7c2-1.8 5.1-1.8 7.1 0l5.7 5.7h-2.6L18 18.5c-1.1-1-2.9-1-4 0z"/>
  </svg>
);

/* Coin positions: top, left as % — arranged around/below center text like reference */
const COINS = [
  { Coin: EOS,     size: 44, top: '15%', left: '14%', delay: 0    },
  { Coin: DASH,    size: 58, top: '22%', left: '26%', delay: 0.5  },
  { Coin: ETH,     size: 62, top: '14%', left: '39%', delay: 0.3  },
  { Coin: NEO,     size: 52, top: '12%', left: '59%', delay: 0.7  },
  { Coin: POLYGON, size: 50, top: '38%', left: '16%', delay: 1.0  },
  { Coin: BTC,     size: 88, top: '55%', left: '48%', delay: 0    },
  { Coin: XRP,     size: 38, top: '50%', left: '72%', delay: 1.2  },
  { Coin: LTC,     size: 48, top: '68%', left: '60%', delay: 0.8  },
  { Coin: POLYGON, size: 46, top: '52%', left: '30%', delay: 1.4  },
];

export default function CryptoDeposits() {
  return (
    <section className="cd-section">
      {/* Earth / space background */}
      <div className="cd-bg-space" />
      <div className="cd-bg-earth" />

      {/* Orbital rings */}
      <div className="cd-orbit cd-orbit-1" />
      <div className="cd-orbit cd-orbit-2" />

      {/* Floating coin logos */}
      <div className="cd-coins-layer">
        {COINS.map(({ Coin, size, top, left, delay }, i) => (
          <div
            key={i}
            className="cd-coin"
            style={{
              top,
              left,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              animationDuration: `${4.5 + i * 0.35}s`,
            }}
          >
            <Coin />
          </div>
        ))}
      </div>

      {/* Text — centred on top of everything */}
      <div className="cd-content">
        <p className="cd-eyebrow">── DEPOSIT WITH CRYPTO ──</p>
        <h2>We Accept Crypto Deposits</h2>
        <p>Deposit, withdraw and hold your balance in Bitcoin, Ethereum</p>
        <Link to="/deposit" className="cd-cta">Get Started</Link>
      </div>
    </section>
  );
}
