import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AccountMenu.css';

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6"  x2="6"  y2="18"/>
    <line x1="6"  y1="6"  x2="18" y2="18"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const KYCIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="8" cy="11" r="2"/>
    <path d="M4 19c0-2 2-3 4-3s4 1 4 3"/>
    <line x1="16" y1="9"  x2="20" y2="9"/>
    <line x1="16" y1="13" x2="20" y2="13"/>
  </svg>
);

const ReferralIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5"  r="3"/>
    <circle cx="6"  cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MENU_ITEMS = [
  { label: 'Settings',         to: '/account/settings', Icon: SettingsIcon,  desc: 'Update name, email & password' },
  { label: 'KYC Verification', to: '/account/kyc',      Icon: KYCIcon,       desc: 'Verify your identity'          },
  { label: 'Referral Program', to: '/account/referral', Icon: ReferralIcon,  desc: 'Earn 15% deposit bonus'        },
];

export default function AccountMenu() {
  const [open, setOpen]   = useState(false);
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const menuRef           = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (user?.role === 'admin') return null;

  return (
    <div className="acct-menu-wrap" ref={menuRef}>
      {/* Hamburger trigger button */}
      <button
        className={`acct-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
      >
        <div className="acct-trigger-avatar">
          {user?.full_name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="acct-trigger-icon">
          {open ? <CloseIcon /> : <MenuIcon />}
        </div>
      </button>

      {/* Slide-down panel */}
      {open && (
        <>
          <div className="acct-backdrop" onClick={() => setOpen(false)} />
          <div className="acct-panel">
            {/* User header */}
            <div className="acct-panel-user">
              <div className="acct-panel-avatar">
                {user?.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="acct-panel-info">
                <div className="acct-panel-name">{user?.full_name}</div>
                <div className="acct-panel-email">{user?.email}</div>
              </div>
            </div>

            <div className="acct-panel-divider"/>

            {/* Menu items */}
            <nav className="acct-panel-nav">
              {MENU_ITEMS.map(({ label, to, Icon, desc }) => (
                <button
                  key={to}
                  className={`acct-nav-item ${location.pathname === to ? 'active' : ''}`}
                  onClick={() => navigate(to)}
                >
                  <div className="acct-nav-icon"><Icon /></div>
                  <div className="acct-nav-text">
                    <span className="acct-nav-label">{label}</span>
                    <span className="acct-nav-desc">{desc}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="acct-nav-arrow">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              ))}
            </nav>

            <div className="acct-panel-divider"/>

            {/* Logout */}
            <button className="acct-logout-btn" onClick={handleLogout}>
              <LogoutIcon />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
