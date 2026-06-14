import { Link } from 'react-router-dom';
import CryptoDeposits from './CryptoDeposits';
import './FeatureSection.css';

/* ══════════════════════════════════════
   INDUSTRY PRICING
══════════════════════════════════════ */
const PRICING = [
  { type: 'FX', val: '0.2', unit: 'pips', desc: 'Trade with ultra-low FX spreads from 0.2 pips on major pairs.' },
  { type: 'Crypto', val: '0.4', unit: '% spread', desc: 'Access the top cryptocurrencies with competitive crypto spreads.' },
  { type: 'Stocks', val: '$3', unit: 'commission', desc: 'Invest in global stocks from as low as $3 commission.' },
  { type: 'Real Estate', val: '$100', unit: 'minimum', desc: 'Diversify into real estate assets with a low entry minimum.' },
];

function IndustryPricing() {
  return (
    <section className="section-light" id="pricing">
      <div className="section-inner">
        <div className="section-hdr centered">
          <p className="section-eyebrow">TRANSPARENT FEES</p>
          <h2>Industry-Leading Prices</h2>
          <p>Low commissions and tight spreads across all asset classes, giving you more of your profit.</p>
        </div>
        <div className="pricing-grid">
          {PRICING.map((p) => (
            <div key={p.type} className="pricing-card-light">
              <div className="pcl-type">{p.type}</div>
              <div className="pcl-from">From</div>
              <div className="pcl-val">{p.val}</div>
              <div className="pcl-unit">{p.unit}</div>
              <p className="pcl-desc">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="pricing-footnote-light">
          <span>✓ No hidden fees</span>
          <span>✓ No deposit fees</span>
          <span>✓ No withdrawal fees</span>
          <span>✓ Free demo account</span>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   SWITCH TO COPYTRADEPRIME
══════════════════════════════════════ */
const SWITCH_FEATURES = [
  {
    title: '2100+ instruments',
    desc: 'Wide range of global markets, including Forex, Indices, Commodities, ETFs and more.',
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1.8">
        <rect x="6" y="8" width="28" height="5" rx="1" />
        <rect x="6" y="17" width="28" height="5" rx="1" />
        <rect x="6" y="26" width="28" height="5" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Safe & Secure',
    desc: "Copy Trade Prime is regulated by the world's biggest supervision authorities, including the Financial Conduct Authority.",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1.8">
        <path d="M20 6 L34 12 L34 22 C34 29 27 34 20 36 C13 34 6 29 6 22 L6 12 Z" />
        <path d="M14 20 L18 24 L26 16" />
      </svg>
    ),
  },
  {
    title: 'Comprehensive education',
    desc: 'Make use of our extensive video library and get to know more about trading.',
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1.8">
        <rect x="8" y="6" width="24" height="28" rx="2" />
        <line x1="13" y1="14" x2="27" y2="14" />
        <line x1="13" y1="20" x2="27" y2="20" />
        <line x1="13" y1="26" x2="21" y2="26" />
      </svg>
    ),
  },
  {
    title: 'Innovative platform',
    desc: "We're constantly improving our trading platform to make it the best on the market.",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1.8">
        <rect x="5" y="8" width="30" height="20" rx="2" />
        <line x1="14" y1="32" x2="26" y2="32" />
        <line x1="20" y1="28" x2="20" y2="32" />
        <polyline points="10,22 16,14 22,18 28,10" />
      </svg>
    ),
  },
  {
    title: '495,000+ customers',
    desc: 'With years of activity in the financial markets, Copy Trade Prime has gained thousands of customers.',
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1.8">
        <circle cx="14" cy="14" r="5" />
        <circle cx="26" cy="14" r="5" />
        <path d="M6 32 C6 26 10 22 14 22 C18 22 20 24 20 24 C20 24 22 22 26 22 C30 22 34 26 34 32" />
      </svg>
    ),
  },
  {
    title: 'Fast & highly qualified support',
    desc: 'Our multilingual customer support team is ready to help you — 24h hours a day.',
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#333" strokeWidth="1.8">
        <path d="M8 14 C8 10 11 7 15 7 L25 7 C29 7 32 10 32 14 L32 22 C32 26 29 29 25 29 L20 29 L14 34 L14 29 C11 29 8 26 8 22 Z" />
        <line x1="14" y1="16" x2="26" y2="16" />
        <line x1="14" y1="21" x2="22" y2="21" />
      </svg>
    ),
  },
];

function SwitchSection() {
  return (
    <section className="section-light">
      <div className="section-inner">
        <div className="section-hdr centered">
          <h2>Switch To Copy Trade Prime</h2>
          <p>At Copy Trade Prime we work hard to enhance your trading experience. As a global, 5 star rated broker, our client's satisfaction is in the center of our focus.</p>
        </div>
        <div className="switch-grid">
          {SWITCH_FEATURES.map((f) => (
            <div key={f.title} className="switch-card">
              <div className="sc-icon">{f.svg}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   TRADE FROM ANY DEVICE
══════════════════════════════════════ */
function AnyDevice() {
  return (
    <section className="section-grey">
      <div className="section-inner device-inner">
        <div className="device-left">
          <div className="device-badges">
            <span className="dev-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#666"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.42.07 2.38.74 3.2.77 1.22-.25 2.38-.94 3.68-.84 1.56.13 2.74.79 3.51 2-3.26 2.04-2.72 6.47.61 7.95-.73 1.93-1.67 3.83-3 5zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
              Available for <strong>iOS</strong>
            </span>
            <span className="dev-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#666"><path d="M17.5 12.5c0-1.58-1.06-2.91-2.5-3.33V4h-1v5.17C12.56 9.59 11.5 10.92 11.5 12.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5zM5 4H4v16l1.5 1.5 1.5-1.5V4H5zm4 0H8v16l1.5 1.5 1.5-1.5V4H9z" /></svg>
              Available for <strong>Android</strong>
            </span>
            <span className="dev-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#666"><path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h10v6H7V9z" /></svg>
              Available for <strong>Windows</strong>
            </span>
          </div>
          <h2>Trade From Any Device</h2>
          <p>Access your account and execute trades seamlessly from desktop, tablet, or mobile. Our platform is optimised for every screen size and operating system.</p>
          <Link to="/register" className="btn-dark" style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Open an Account
          </Link>
        </div>
        <div className="device-right">
          <div className="device-mockup-img">
            <div className="dm-laptop">
              <div className="dm-screen">
                <svg viewBox="0 0 280 180" fill="none">
                  <rect width="280" height="180" fill="#0d1525" />
                  <rect x="0" y="0" width="280" height="28" fill="#111c30" />
                  <text x="10" y="18" fill="#1565ff" fontSize="9" fontWeight="bold">COPYTRADEPRIME</text>
                  {[40, 60, 50, 80, 65, 90, 75, 100, 85, 110, 95, 120].map((h, i) => (
                    <rect key={i} x={20 + i * 22} y={160 - h} width="10" height={h}
                      fill={i % 2 === 0 ? '#00e676' : '#ff3d57'} opacity="0.8" rx="1" />
                  ))}
                  <text x="10" y="175" fill="rgba(255,255,255,0.3)" fontSize="7">Live Trading Dashboard</text>
                </svg>
              </div>
              <div className="dm-base" />
            </div>
            <div className="dm-phone">
              <div className="dm-phone-screen">
                <svg viewBox="0 0 80 140" fill="none">
                  <rect width="80" height="140" fill="#0d1525" />
                  <rect x="0" y="0" width="80" height="20" fill="#111c30" />
                  <text x="8" y="14" fill="#1565ff" fontSize="7" fontWeight="bold">Portfolio</text>
                  <text x="8" y="36" fill="white" fontSize="9" fontWeight="bold">$24,851</text>
                  <text x="8" y="48" fill="#00e676" fontSize="7">+12.4% today</text>
                  {[30, 45, 35, 55, 42, 62, 50, 68].map((h, i) => (
                    <rect key={i} x={8 + i * 8} y={90 - h} width="5" height={h}
                      fill={i % 2 === 0 ? '#1565ff' : '#00cfff'} opacity="0.8" rx="1" />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   MT4 SECTION
══════════════════════════════════════ */
function MT4Section() {
  return (
    <section className="section-light">
      <div className="section-inner mt4-inner">
        <div className="mt4-left">
          <div className="mt4-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1565ff" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span style={{ fontWeight: 700, color: '#1565ff' }}>MetaTrader 5</span>
          </div>
          <h2>Free Demo And Live MT4 Accounts</h2>
          <p>Instant market access and endless possibilities for trading, analysis and automation. Metaquotes 5 is an evolution of MT4 with additional features that supercharge your trading.</p>
          <Link to="/register" className="btn-dark" style={{ marginTop: 24, display: 'inline-flex' }}>Open an Account</Link>
        </div>
        <div className="mt4-right">
          <div className="mt4-devices">
            <div className="mt4-laptop">
              <div className="mt4-screen">
                <svg viewBox="0 0 260 160" fill="none">
                  <rect width="260" height="160" fill="#f0f4f8" />
                  <rect x="0" y="0" width="260" height="24" fill="#1565ff" />
                  <text x="8" y="16" fill="white" fontSize="8" fontWeight="bold">MetaTrader 4 — DEMO</text>
                  {[50, 80, 60, 100, 75, 110, 85, 95, 120, 90, 130, 100].map((h, i) => (
                    <rect key={i} x={10 + i * 20} y={140 - h} width="12" height={h}
                      fill={i % 2 === 0 ? '#00b894' : '#e17055'} opacity="0.85" rx="1" />
                  ))}
                </svg>
              </div>
            </div>
            <div className="mt4-tablet">
              <div className="mt4-tablet-screen">
                <svg viewBox="0 0 100 130" fill="none">
                  <rect width="100" height="130" fill="#f0f4f8" />
                  <rect x="0" y="0" width="100" height="18" fill="#1565ff" />
                  <text x="6" y="12" fill="white" fontSize="6" fontWeight="bold">MT4 DEMO</text>
                  {[40, 60, 45, 70, 55, 75, 50, 65].map((h, i) => (
                    <rect key={i} x={6 + i * 11} y={110 - h} width="7" height={h}
                      fill={i % 2 === 0 ? '#00b894' : '#e17055'} opacity="0.85" rx="1" />
                  ))}
                </svg>
              </div>
            </div>
            <div className="mt4-phone">
              <div className="mt4-phone-screen">
                <svg viewBox="0 0 55 100" fill="none">
                  <rect width="55" height="100" fill="#f0f4f8" />
                  <rect x="0" y="0" width="55" height="14" fill="#1565ff" />
                  <text x="4" y="10" fill="white" fontSize="5" fontWeight="bold">MT4</text>
                  {[30, 45, 35, 50, 40, 55].map((h, i) => (
                    <rect key={i} x={5 + i * 8} y={85 - h} width="5" height={h}
                      fill={i % 2 === 0 ? '#00b894' : '#e17055'} opacity="0.85" rx="1" />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
   TRUSTED / REVIEWS
 */
const RATINGS = [
  { name: 'ICORating', score: '8.9' },
  { name: 'Coin Clarity', score: '7.9' },
  { name: 'ICO Watchlist', score: '8.0' },
  { name: 'CoinMarketAlert', score: '9.0' },
  { name: 'ICO Alert', score: '7.4' },
  { name: 'TokenMarket', score: '8.7' },
];

const REVIEWS = [
  { name: 'Vivian T. Vachon', text: "Copy Trade Prime runs a quick and reliable system. It feels great to know that I can always trust their support system to come through for me. Their response speed is prompt and the delivery precise to the last detail." },
  { name: 'Jack Thompson', text: "I was an engineer in Washington DC when an account manager brought this opportunity to me. I just said casually to invest with £500 but my story today is on a premium plan." },
  { name: 'Robert Prickett', text: "I have only been a member for a few months and I have already earned a decent amount of money. Finally a real and honest company that does what it says. Thank you so much for this great opportunity!" },
];

function TrustedSection() {
  return (
    <section className="section-light">
      <div className="section-inner">
        <div className="section-hdr centered">
          <h2>We Are Trusted</h2>
        </div>
        <div className="ratings-grid">
          {RATINGS.map((r) => (
            <div key={r.name} className="rating-card">
              <div className="rc-name">{r.name}</div>
              <div className="rc-score">{r.score}</div>
            </div>
          ))}
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r) => (
            <div key={r.name} className="review-card">
              <div className="rv-top">
                <div className="rv-avatar">{r.name[0]}</div>
                <div>
                  <div className="rv-name">{r.name}</div>
                  <div className="rv-stars">★★★★★</div>
                </div>
                <div className="rv-quote">"</div>
              </div>
              <p className="rv-text">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   TRUSTED FOR 12 YEARS +
══════════════════════════════════════ */
function TrustedYears() {
  return (
    <section className="trusted-years-section">
      <div className="ty-overlay" />
      <div className="section-inner">
        <div className="ty-card">
          <h2>Trusted for more than 12 years</h2>
          <p>Prime Copy Trade is an online Forex and cryptocurrency STP broker providing CFD trading on hundreds of assets and optimal trading conditions within the award-winning MT4 platform. Prime Copy Trade offers deep liquidity, generous leverage up to 1:500, and some of the best spreads in the industry.</p>
          <p className="ty-multi">Multi-award winner</p>
          <hr className="ty-hr" />
          <div className="ty-awards">
            {[
              { title: 'Best CFD Broker', event: 'TradeON Summit 2020' },
              { title: 'Best Trading Experience', event: 'Jordan Forex EXPO 2015' },
              { title: 'Best Execution Broker', event: 'Forex EXPO Dubai 2017' },
            ].map((a) => (
              <div key={a.title} className="ty-award">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="1.5">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                <div>
                  <div className="ty-award-title">{a.title}</div>
                  <div className="ty-award-event">{a.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="as-seen-bar">
        <div className="section-inner">
          <div className="as-seen-inner">
            <span className="as-seen-label">As seen on</span>
            {['CNBC', 'The Guardian', 'Bloomberg', 'Reuters', 'MarketWatch'].map((m) => (
              <span key={m} className="as-seen-brand">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   TRADE WITH CONFIDENCE
══════════════════════════════════════ */
function TradeConfidence() {
  const STEPS = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#333" strokeWidth="1.8">
          <circle cx="20" cy="18" r="8" />
          <path d="M8 40 C8 32 14 28 20 28" />
          <line x1="32" y1="22" x2="32" y2="36" />
          <line x1="26" y1="29" x2="38" y2="29" />
        </svg>
      ),
      label: 'Register',
      desc: 'Fill in your personal details in our secure online application.',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#333" strokeWidth="1.8">
          <rect x="8" y="14" width="32" height="22" rx="3" />
          <path d="M16 24 h16" />
          <path d="M16 30 h10" />
        </svg>
      ),
      label: 'Deposit',
      desc: 'Make a deposit via debit card, wire transfer or crypto.',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#333" strokeWidth="1.8">
          <rect x="10" y="28" width="6" height="12" rx="1" />
          <rect x="21" y="20" width="6" height="20" rx="1" />
          <rect x="32" y="12" width="6" height="28" rx="1" />
        </svg>
      ),
      label: 'Trading',
      desc: 'Once approved, you can trade on desktop and mobile.',
    },
  ];

  return (
    <section className="section-light">
      <div className="section-inner">
        <div className="section-hdr centered">
          <h2>Trade With Confidence</h2>
        </div>
        <div className="confidence-grid">
          {STEPS.map((s, i) => (
            <div key={s.label} className={`conf-step ${i < STEPS.length - 1 ? 'has-divider' : ''}`}>
              <div className="cs-icon">{s.icon}</div>
              <h4>{s.label}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="open-account-bar">
          <div className="oab-label">OPEN YOUR ACCOUNT</div>
          <div className="oab-inner">
            <p>Connect with over 450,000 investors in the world's leading FX Broker.</p>
            <Link to="/register" className="btn-primary oab-btn">Open Account</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function FeatureSection() {
  return (
    <>
      <SwitchSection />
      <IndustryPricing />
      <AnyDevice />
      <CryptoDeposits />
      <MT4Section />
      <TrustedSection />
      <TrustedYears />
      <TradeConfidence />
    </>
  );
}
