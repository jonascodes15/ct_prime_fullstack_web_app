import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'HOME',     to: '/' },
  { label: 'ABOUT US', to: '/about' },
  {
    label: 'MARKETS', to: '/markets',
    children: [
      { label: 'Forex',        to: '/markets#forex'   },
      { label: 'Cryptos',      to: '/markets#crypto'  },
      { label: 'Stocks',       to: '/markets#stocks'  },
      { label: 'Indices',      to: '/markets#indices' },
      { label: 'Commodities',  to: '/markets#commodities' },
    ],
  },
  {
    label: 'TRADING', to: '#',
    children: [
      { label: 'Copy Trading', to: '/register' },
      { label: 'Live Account', to: '/register' },
      { label: 'Demo Account', to: '/register' },
      { label: 'Pricing',      to: '/#pricing'  },
    ],
  },
  {
    label: 'COMPANY', to: '#',
    children: [
      { label: 'About Us',    to: '/about'          },
      { label: 'Why Us',      to: '/about#why'      },
      { label: 'Contact Us',  to: '/about#contact'  },
    ],
  },
];

export default function Navbar() {
  const { isAuth, user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [openDd, setOpenDd]         = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu]     = useState(false);
  const navRef = useRef();

  useEffect(() => { setMobileOpen(false); setOpenDd(null); }, [location.pathname]);

  useEffect(() => {
    const h = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDd(null); setUserMenu(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <header className="site-header" ref={navRef}>

      {/* ── TOP BAR: black, logo left, login/signup right ── */}
      <div className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="topbar-logo">
            <svg className="logo-svg" width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M8 32 L16 8 L24 20 L32 8" stroke="#1565ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 26 L12 14" stroke="#1565ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <div className="logo-text-block">
              <span className="logo-top">COPY TRADE</span>
              <span className="logo-bot">PRIME</span>
            </div>
          </Link>

          <div className="topbar-auth">
            {!isAuth ? (
              <>
                <Link to="/login"    className="topbar-login">Login</Link>
                <Link to="/register" className="topbar-signup">Sign Up</Link>
              </>
            ) : (
              <div className="topbar-user" onClick={() => setUserMenu(!userMenu)}>
                <div className="topbar-av">{user?.full_name?.[0]?.toUpperCase() || 'U'}</div>
                <span className="topbar-uname">{user?.full_name?.split(' ')[0]}</span>
                <svg width="10" height="7" viewBox="0 0 10 7" fill="white"><path d="M5 7L0 0h10z"/></svg>
                {userMenu && (
                  <div className="topbar-dropdown">
                    <Link to="/dashboard"  className="tdd-item">Dashboard</Link>
                    <Link to="/deposit"    className="tdd-item">Deposit</Link>
                    <Link to="/withdrawal" className="tdd-item">Withdraw</Link>
                    <hr className="tdd-hr"/>
                    <button className="tdd-item tdd-logout" onClick={() => { logout(); navigate('/'); }}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger (mobile only) */}
          <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* ── NAV BAR: white, links row ── */}
      <div className="navrow">
        <div className="navrow-inner">
          <nav className="desktop-nav">
            {NAV_LINKS.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className={`navrow-item has-dd ${openDd === item.label ? 'open' : ''}`}
                  onMouseEnter={() => setOpenDd(item.label)}
                  onMouseLeave={() => setOpenDd(null)}
                >
                  <span className={`navrow-link ${location.pathname.startsWith(item.to) && item.to !== '#' ? 'active' : ''}`}>
                    {item.label}
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor"><path d="M4 6L0 0h8z"/></svg>
                  </span>
                  <div className="navrow-dropdown">
                    {item.children.map((c) => (
                      <Link key={c.label} to={c.to} className="navrow-dd-link">{c.label}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`navrow-item navrow-link ${location.pathname === item.to ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Dashboard link shown in navrow when logged in */}
          {isAuth && (
            <div className="navrow-right">
              <Link to="/dashboard"  className="navrow-link small">Dashboard</Link>
              <Link to="/deposit"    className="navrow-link small">Deposit</Link>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/"        className="mob-link">Home</Link>
        <Link to="/about"   className="mob-link">About Us</Link>
        <Link to="/markets" className="mob-link">Markets</Link>
        {!isAuth ? (
          <>
            <div className="mob-div"/>
            <Link to="/login"    className="mob-link">Sign In</Link>
            <Link to="/register" className="mob-cta">Create Account</Link>
          </>
        ) : (
          <>
            <div className="mob-div"/>
            <Link to="/dashboard"  className="mob-link">Dashboard</Link>
            <Link to="/deposit"    className="mob-link">Deposit</Link>
            <Link to="/withdrawal" className="mob-link">Withdrawal</Link>
            <button className="mob-link mob-logout" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
          </>
        )}
      </div>
    </header>
  );
}
