import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './About.css';

const VALUES = [
  { icon: '🏆', title: 'Technology',   desc: 'Nowadays technology is one of the most important elements of investing and finance. That\'s why we constantly improve our trading platform trying to make it the best on the market.' },
  { icon: '🤝', title: 'Support',      desc: 'We are here to help our clients become better investors. That\'s why our experienced customer service team works 24 hours a day, 5 days a week.' },
  { icon: '🔒', title: 'Trust',        desc: 'We are regulated by the world\'s biggest supervision authorities and our award-winning trading solutions are shaped to help you achieve your trading ambitions.' },
  { icon: '🌍', title: 'Transparency', desc: 'We believe in full transparency with our clients. No hidden fees, no surprises — just clear, honest trading conditions across every instrument we offer.' },
];

const OFFICES = ['United Kingdom', 'Poland', 'Germany', 'France', 'Chile', 'Nigeria', 'South Africa', 'UAE', 'Singapore', 'Australia', 'Canada', 'Brazil', 'India'];

export default function About() {
  return (
    <div className="page-body">
      <Navbar />

      {/* Page hero */}
      <section className="page-hero">
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <span className="section-tag">About Us</span>
          <h1>We're One Of The Largest Stock Exchange-Listed FX & CFD Brokers In The World</h1>
          <p>Prime Copy Trade is a licensed industry leader, at work to source the best products in the market for you, while also striving to increase accessibility and transparency in the trading industry.</p>
        </div>
      </section>

      {/* 3 pillars */}
      <section className="section-alt">
        <div className="section-inner">
          <div className="about-pillars">
            {[
              { icon: '🏅', title: 'Best Platform', desc: 'We constantly improve our trading platform trying to make it the best on the market.' },
              { icon: '🌐', title: 'Regulated',     desc: 'We\'re regulated by the world\'s biggest supervision authorities.' },
              { icon: '🎯', title: 'Award Winning', desc: 'Our award-winning trading solutions are shaped to help you achieve your trading ambitions.' },
            ].map((p) => (
              <div className="pillar-card" key={p.title}>
                <div className="pillar-icon">{p.icon}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Company */}
      <section className="section-dark">
        <div className="section-inner about-two-col">
          <div className="page-body">
            <span className="section-tag">Our Company</span>
            <h2 style={{ fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:800, margin:'12px 0 16px', lineHeight:1.2 }}>
              Almost 20 Years of Market Experience
            </h2>
            <p style={{ color:'var(--grey)', lineHeight:1.75, marginBottom:16 }}>
              Prime Copy Trade is one of the largest stock exchange-listed FX & CFD brokers in the world.
              We have offices in over 13 countries including UK, Poland, Germany, France and Chile.
            </p>
            <p style={{ color:'var(--grey)', lineHeight:1.75, marginBottom:28 }}>
              Our platform gives you access to thousands of financial instruments including forex, stocks,
              indices, commodities, and cryptocurrencies — all with competitive pricing and industry-leading execution.
            </p>
            <Link to="/register" className="btn-primary">Open an Account</Link>
          </div>
          <div className="about-offices">
            <h4>Our Global Offices</h4>
            <div className="offices-grid">
              {OFFICES.map((o) => (
                <div key={o} className="office-tag">{o}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-alt">
        <div className="section-inner">
          <div className="section-header centered">
            <span className="section-tag">Our Values</span>
            <h2>What Drives Us Every Day</h2>
            <p>Prime Copy Trade strives to provide the best possible trading experience to our clients, and our core values are tightly aligned with that vision.</p>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div className="value-card" key={v.title}>
                <div className="vc-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact" className="section-dark">
        <div className="section-inner">
          <div className="section-header centered">
            <span className="section-tag">Get In Touch</span>
            <h2>Contact Us</h2>
            <p>Our support team is available 24/5. Reach out via live chat or email.</p>
          </div>
          <div className="contact-grid">
            {[
              { icon: '💬', label: 'Live Chat',   val: 'Available 24/5',          action: '#'          },
              { icon: '📧', label: 'Email',        val: 'support@copytradeprime.com', action: 'mailto:support@copytradeprime.com' },
              { icon: '📞', label: 'Phone',        val: '+1 (800) 000-0000',        action: 'tel:+18000000000' },
            ].map((c) => (
              <a href={c.action} key={c.label} className="contact-card">
                <div className="cc-icon">{c.icon}</div>
                <div className="cc-label">{c.label}</div>
                <div className="cc-val">{c.val}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
