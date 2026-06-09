import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './About.css';

/* ── SVG Icons ── */
const IconPlatform = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="22" height="16" rx="2" />
    <line x1="9" y1="24" x2="19" y2="24" />
    <line x1="14" y1="20" x2="14" y2="24" />
    <polyline points="7,14 11,9 15,12 21,6" />
  </svg>
);

const IconRegulated = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3 L24 7 V14 C24 19.5 19.5 23.5 14 25 C8.5 23.5 4 19.5 4 14 V7 Z" />
    <polyline points="9,14 12,17 19,10" />
  </svg>
);

const IconAward = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="11" r="7" />
    <path d="M9.5 17.5 L7 25 L14 22 L21 25 L18.5 17.5" />
    <polyline points="11,10 13,13 17,8" />
  </svg>
);

const IconTechnology = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="24" height="16" rx="2" />
    <line x1="8" y1="25" x2="20" y2="25" />
    <line x1="14" y1="21" x2="14" y2="25" />
    <polyline points="7,15 10,10 13,13 16,8 21,12" />
  </svg>
);

const IconSupport = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 10 C5 6.13 9.03 3 14 3 C18.97 3 23 6.13 23 10 V15 C23 18.87 18.97 22 14 22" />
    <path d="M5 10 V15 C5 16.1 6.12 17 7.5 17 H8 V10 H7.5 C6.12 10 5 10.9 5 12" />
    <path d="M23 12 V15" />
    <path d="M14 22 C14 22 11 23 9 25" />
    <circle cx="9" cy="25" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconTrust = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="12" width="16" height="13" rx="2" />
    <path d="M10 12 V8 C10 5.79 11.79 4 14 4 C16.21 4 18 5.79 18 8 V12" />
    <circle cx="14" cy="18" r="2" fill="currentColor" stroke="none" />
    <line x1="14" y1="20" x2="14" y2="22" />
  </svg>
);

const IconTransparency = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="14" r="11" />
    <line x1="14" y1="3" x2="14" y2="25" />
    <line x1="3" y1="14" x2="25" y2="14" />
    <path d="M5 8.5 C7.5 10.5 10.5 11.5 14 11.5 S20.5 10.5 23 8.5" />
    <path d="M5 19.5 C7.5 17.5 10.5 16.5 14 16.5 S20.5 17.5 23 19.5" />
  </svg>
);

const IconChat = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6 H26 C27.1 6 28 6.9 28 8 V20 C28 21.1 27.1 22 26 22 H18 L12 28 V22 H6 C4.9 22 4 21.1 4 20 V8 C4 6.9 4.9 6 6 6 Z" />
    <line x1="10" y1="13" x2="22" y2="13" />
    <line x1="10" y1="17" x2="18" y2="17" />
  </svg>
);

const IconEmail = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="24" height="18" rx="2" />
    <polyline points="4,8 16,18 28,8" />
  </svg>
);

const IconPhone = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 5H7C5.9 5 5 5.9 5 7C5 19.15 14.85 29 27 29C28.1 29 29 28.1 29 27V23.51C29 22.41 28.1 21.51 27 21.51C24.76 21.51 22.59 21.16 20.56 20.53C20.12 20.38 19.63 20.49 19.29 20.83L17.06 23.06C14.03 21.5 11.5 18.97 9.94 15.94L12.17 13.71C12.51 13.37 12.62 12.88 12.47 12.44C11.83 10.41 11.49 8.24 11.49 6C11.5 5.9 11.1 5 10.5 5Z" />
  </svg>
);

const PILLARS = [
  { Icon: IconPlatform, color: '#1565ff', title: 'Best Platform', desc: "We constantly improve our trading platform trying to make it the best on the market." },
  { Icon: IconRegulated, color: '#00cfff', title: 'Regulated', desc: "We're regulated by the world's biggest supervision authorities." },
  { Icon: IconAward, color: '#FFB800', title: 'Award Winning', desc: "Our award-winning trading solutions are shaped to help you achieve your trading ambitions." },
];

const VALUES = [
  { Icon: IconTechnology, color: '#1565ff', title: 'Technology', desc: "Nowadays technology is one of the most important elements of investing and finance. That's why we constantly improve our trading platform trying to make it the best on the market." },
  { Icon: IconSupport, color: '#00e676', title: 'Support', desc: "We are here to help our clients become better investors. That's why our experienced customer service team works 24 hours a day, 5 days a week." },
  { Icon: IconTrust, color: '#FFB800', title: 'Trust', desc: "We are regulated by the world's biggest supervision authorities and our award-winning trading solutions are shaped to help you achieve your trading ambitions." },
  { Icon: IconTransparency, color: '#00cfff', title: 'Transparency', desc: "We believe in full transparency with our clients. No hidden fees, no surprises — just clear, honest trading conditions across every instrument we offer." },
];

const CONTACTS = [
  { Icon: IconChat, color: '#1565ff', label: 'Live Chat', val: 'Available 24/5', action: '#' },
  { Icon: IconEmail, color: '#00cfff', label: 'Email', val: 'support@copytradeprime.com', action: 'mailto:support@copytradeprime.com' },
  { Icon: IconPhone, color: '#00e676', label: 'Phone', val: '+1 (800) 000-0000', action: 'tel:+18000000000' },
];

const OFFICES = ['United Kingdom', 'Poland', 'Germany', 'France', 'Chile', 'Nigeria', 'South Africa', 'UAE', 'Singapore', 'Australia', 'Canada', 'Brazil', 'India'];

export default function About() {
  return (
    <div className="page-body">
      <Navbar />

      {/* ── Hero ── */}
      <section className="abt-hero">
        <div className="abt-hero-grid" />
        <div className="abt-hero-glow" />
        <div className="abt-hero-inner">
          <div className="abt-hero-tag">About Us</div>
          <h1>We're One Of The Largest<br />Stock Exchange-Listed FX &amp; CFD<br />Brokers In The World</h1>
          <p>Prime Copy Trade is a licensed industry leader, at work to source the best products in the market for you, while also striving to increase accessibility and transparency in the trading industry.</p>
        </div>
      </section>

      {/* ── 3 Pillars ── */}
      <section className="abt-section abt-dark">
        <div className="abt-inner">
          <div className="abt-pillars">
            {PILLARS.map(({ Icon, color, title, desc }) => (
              <div className="abt-pillar" key={title} style={{ '--pc': color }}>
                <div className="abt-pillar-icon">
                  <Icon />
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Company ── */}
      <section className="abt-section abt-mid">
        <div className="abt-inner abt-two-col">
          <div className="abt-company-text">
            <div className="abt-tag">Our Company</div>
            <h2>Almost 13 Years of<br />Market Experience</h2>
            <p>Prime Copy Trade is one of the largest stock exchange-listed FX &amp; CFD brokers in the world. We have offices in over 13 countries including UK, Poland, Germany, France and Chile.</p>
            <p>Our platform gives you access to thousands of financial instruments including forex, stocks, indices, commodities, and cryptocurrencies — all with competitive pricing and industry-leading execution.</p>
            <Link to="/register" className="btn-primary abt-cta-btn">Open an Account</Link>
          </div>
          <div className="abt-offices-block">
            <div className="abt-offices-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Our Global Offices
            </div>
            <div className="abt-offices-tags">
              {OFFICES.map((o) => (
                <span key={o} className="abt-office-tag">{o}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="abt-section abt-dark">
        <div className="abt-inner">
          <div className="abt-section-hdr">
            <div className="abt-tag">Our Values</div>
            <h2>What Drives Us Every Day</h2>
            <p>Prime Copy Trade strives to provide the best possible trading experience to our clients, and our core values are tightly aligned with that vision.</p>
          </div>
          <div className="abt-values-grid">
            {VALUES.map(({ Icon, color, title, desc }) => (
              <div className="abt-value-card" key={title} style={{ '--vc': color }}>
                <div className="abt-value-icon">
                  <Icon />
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="abt-stats-bar">
        {[
          { val: '20+', label: 'Years Experience' },
          { val: '13+', label: 'Global Offices' },
          { val: '400K+', label: 'Active Clients' },
          { val: '2,100+', label: 'Trading Instruments' },
        ].map((s) => (
          <div key={s.label} className="abt-stat">
            <span className="abt-stat-val">{s.val}</span>
            <span className="abt-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="abt-section abt-mid">
        <div className="abt-inner">
          <div className="abt-section-hdr centered">
            <div className="abt-tag">Get In Touch</div>
            <h2>Contact Us</h2>
            <p>Our support team is available 24/5. Reach out and we'll get back to you as quickly as possible.</p>
          </div>
          <div className="abt-contact-grid">
            {CONTACTS.map(({ Icon, color, label, val, action }) => (
              <a href={action} key={label} className="abt-contact-card" style={{ '--cc': color }}>
                <div className="abt-contact-icon">
                  <Icon />
                </div>
                <div className="abt-contact-label">{label}</div>
                <div className="abt-contact-val">{val}</div>
                <div className="abt-contact-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
