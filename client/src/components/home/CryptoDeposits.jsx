import { Link } from 'react-router-dom';
import './CryptoDeposits.css';

/* ── Real SVG crypto logos ── */
const BitcoinLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
    <path d="M22.2 13.8c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.6 2.6c-.4-.1-.9-.2-1.3-.3l.6-2.7-1.6-.4-.7 2.7c-.3-.1-.7-.2-1-.2v0L11.5 8l-.4 1.7s1.2.3 1.1.3c.6.1.7.5.7.8l-.7 2.9c0 0 .1 0 .1 0l-.1 0-1 3.8c-.1.2-.3.4-.6.4-.1 0-1.1-.3-1.1-.3l-.8 1.8 1.9.5c.4.1.7.2 1.1.2l-.7 2.8 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.7 2.7 1.6.4.7-2.8c2.9.5 5.1.3 6-2.3.7-2.1 0-3.3-1.5-4.1 1.1-.3 1.9-1 2.1-2.4zm-3.8 5.3c-.5 2.1-3.9 1-5 .7l.9-3.6c1.1.3 4.6.8 4.1 2.9zm.5-5.3c-.5 1.9-3.3.9-4.2.7l.8-3.3c1 .2 4 .7 3.4 2.6z" fill="white"/>
  </svg>
);

const EthereumLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#627EEA"/>
    <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="white" fillOpacity="0.6"/>
    <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="white"/>
    <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="white" fillOpacity="0.6"/>
    <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.379z" fill="white"/>
    <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fill="white" fillOpacity="0.2"/>
    <path d="M9 16.22l7.498 4.353v-7.7L9 16.22z" fill="white" fillOpacity="0.6"/>
  </svg>
);

const DashLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#1C75BC"/>
    <path d="M10.5 19.3h6.8l1-3.3H11.5l1-3.3h6.8l1.2-3.9H8.3L5.5 22.6h12.2l.9-3.3H10.5zM26.5 12.8c-.4-1.6-1.9-2.8-4-2.8h-2.7l-1.2 3.9h2.7c1.1 0 1.7.5 1.9 1.5.3 1.4-.6 2.5-2.2 2.5h-2.6l-1 3.3h2.7c3.5 0 6.1-2.6 5.4-8.4z" fill="white"/>
  </svg>
);

const EOSLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#232425"/>
    <path d="M16 5l-9.5 5.5v11L16 27l9.5-5.5v-11L16 5zm0 2.3l7.5 4.3v8.8L16 24.7l-7.5-4.3v-8.8L16 7.3zm-4.2 10.4l4.2 2.4 4.2-2.4v-4.8L16 10.5l-4.2 2.4v4.8z" fill="white"/>
  </svg>
);

const NEOLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#58BF00"/>
    <path d="M10 9h2.8l8.4 10.2V9H24v14h-2.8L12.8 12.8V23H10V9z" fill="white"/>
  </svg>
);

const PolygonLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#8247E5"/>
    <path d="M21.1 13.3c-.4-.2-.9-.2-1.3 0l-3.1 1.8-2.1 1.2-3.1 1.8c-.4.2-.9.2-1.3 0l-2.4-1.4c-.4-.2-.6-.6-.6-1.1v-2.7c0-.4.2-.8.6-1.1l2.4-1.4c.4-.2.9-.2 1.3 0l2.4 1.4c.4.2.6.6.6 1.1v1.8l2.1-1.2v-1.8c0-.4-.2-.8-.6-1.1l-4.5-2.6c-.4-.2-.9-.2-1.3 0l-4.6 2.6c-.4.2-.6.6-.6 1.1v5.3c0 .4.2.8.6 1.1l4.6 2.6c.4.2.9.2 1.3 0l3.1-1.8 2.1-1.2 3.1-1.8c.4-.2.9-.2 1.3 0l2.4 1.4c.4.2.6.6.6 1.1v2.7c0 .4-.2.8-.6 1.1l-2.4 1.4c-.4.2-.9.2-1.3 0l-2.4-1.4c-.4-.2-.6-.6-.6-1.1v-1.8l-2.1 1.2v1.8c0 .4.2.8.6 1.1l4.6 2.6c.4.2.9.2 1.3 0l4.6-2.6c.4-.2.6-.6.6-1.1v-5.3c0-.4-.2-.8-.6-1.1l-4.7-2.6z" fill="white"/>
  </svg>
);

const LitecoinLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#BFBBBB"/>
    <path d="M16 5C10 5 5 10 5 16s5 11 11 11 11-5 11-11S22 5 16 5zm-1.5 14.5l.8-3.2-1.1.3.4-1.5 1.1-.3 1.8-6.8h2.7l-1.8 6.8 1.1-.3-.4 1.5-1.1.3-.9 3.2h-2.6z" fill="white"/>
  </svg>
);

const XRPLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#00AAE4"/>
    <path d="M22.8 9h2.5l-5.8 5.6c-1.9 1.8-4.9 1.8-6.8 0L6.9 9h2.5l4.6 4.4c1.1 1.1 2.9 1.1 4 0L22.8 9zM9.4 23H6.9l5.8-5.6c1.9-1.8 4.9-1.8 6.8 0L25.3 23h-2.5l-4.6-4.4c-1.1-1.1-2.9-1.1-4 0L9.4 23z" fill="white"/>
  </svg>
);

/* Coin config: position % on the canvas, size, animation delay */
const COINS = [
  { Logo: BitcoinLogo,  size: 90,  top: '52%', left: '48%', delay: 0,    zIndex: 3 },  // large center
  { Logo: EthereumLogo, size: 62,  top: '28%', left: '38%', delay: 0.4,  zIndex: 2 },  // upper mid
  { Logo: DashLogo,     size: 58,  top: '20%', left: '24%', delay: 0.8,  zIndex: 2 },  // upper left-mid
  { Logo: EOSLogo,      size: 42,  top: '14%', left: '12%', delay: 1.2,  zIndex: 1 },  // far upper left
  { Logo: NEOLogo,      size: 52,  top: '18%', left: '70%', delay: 0.6,  zIndex: 2 },  // upper right
  { Logo: PolygonLogo,  size: 50,  top: '42%', left: '28%', delay: 1.0,  zIndex: 2 },  // left mid
  { Logo: LitecoinLogo, size: 48,  top: '65%', left: '60%', delay: 0.9,  zIndex: 2 },  // lower right
  { Logo: XRPLogo,      size: 38,  top: '48%', left: '72%', delay: 1.4,  zIndex: 1 },  // right
];

export default function CryptoDeposits() {
  return (
    <section className="cd-section">
      {/* Space / earth background */}
      <div className="cd-bg" />
      <div className="cd-bg-earth" />

      {/* Orbital rings */}
      <div className="cd-orbitals">
        <div className="cd-ring cd-ring-1" />
        <div className="cd-ring cd-ring-2" />
      </div>

      {/* Text content */}
      <div className="cd-content">
        <p className="cd-eyebrow">── DEPOSIT WITH CRYPTO ──</p>
        <h2>We Accept Crypto Deposits</h2>
        <p>Deposit, withdraw and hold your balance in Bitcoin, Ethereum</p>
        <Link to="/deposit" className="cd-btn">Get Started</Link>
      </div>

      {/* Floating coin logos */}
      <div className="cd-coins">
        {COINS.map(({ Logo, size, top, left, delay, zIndex }, i) => (
          <div
            key={i}
            className="cd-coin"
            style={{
              top,
              left,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              zIndex,
            }}
          >
            <Logo />
          </div>
        ))}
      </div>
    </section>
  );
}
