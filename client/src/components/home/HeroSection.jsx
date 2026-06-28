import { Link } from 'react-router-dom';
import './HeroSection.css';

// Free-to-use trading video clips from public CDNs
const VIDEO_SOURCES = ['/videos/hero.mp4'];

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Video background */}
      <div className="hero-video-wrap">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=80"
        >
          <source src={VIDEO_SOURCES[0]} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-inner">
          <p className="hero-eyebrow animate-up">The #1 Copy Trading Platform</p>

          <h1 className="hero-title animate-up" style={{ animationDelay: '0.1s' }}>
            Trade Alongside the Pros.<br />
            Maximize Your Portfolio with
            <span className="hero-blue"> Copy Trading</span>
          </h1>

          <p className="hero-sub animate-up" style={{ animationDelay: '0.2s' }}>
            Mirror an expert's trades to grow value and knowledge through Copy Trading,
            and a wide range of trading offers — Options Trading, Stocks, Derivatives,
            Currency Pairs, and more.
          </p>

          <div className="hero-actions animate-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/register" className="btn-primary hero-btn">
              Open an Account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/login" className="hero-btn-ghost">Sign In</Link>
          </div>

          {/* Stats row */}
          <div className="hero-stats animate-up" style={{ animationDelay: '0.4s' }}>
            {[
              { val: '200K+', label: 'Active Clients' },
              { val: '2,100+', label: 'Markets' },
              { val: '150+', label: 'Countries' },
              { val: '12+', label: 'Years Experience' },
            ].map((s) => (
              <div key={s.label} className="hstat">
                <span className="hstat-val">{s.val}</span>
                <span className="hstat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
