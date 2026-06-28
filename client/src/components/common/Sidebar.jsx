import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const CLIENT_NAV = [
  {
    to: '/dashboard', label: 'Dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" /></svg>
  },
  {
    to: '/deposit', label: 'Deposit',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 14l4 4 4-4" /></svg>
  },
  {
    to: '/withdrawal', label: 'Withdrawal',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 16V8M8 10l4-4 4 4" /></svg>
  },
  {
    to: '/activate-trader', label: 'Active Traders',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3.5" /><path d="M3 20c0-3.5 2.7-6 6-6" /><circle cx="17" cy="14" r="3" /><path d="M14 20.5c0-2 1.3-3.5 3-3.5s3 1.5 3 3.5" /><path d="M15 7l2 2 3-3" /></svg>
  },
  {
    to: '/news', label: 'News Feed',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2" /><path d="M4 11a2 2 0 000 4h.01" /><path d="M2 9v10a2 2 0 002 2" /><line x1="10" y1="7" x2="18" y2="7" /><line x1="10" y1="11" x2="18" y2="11" /><line x1="10" y1="15" x2="14" y2="15" /></svg>
  },
  {
    to: '/account/notifications', label: 'Notifications',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 10-12 0v4l-2 2v1h16v-1l-2-2V8" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
  },
  {
    to: '/live-markets', label: 'Live Markets',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
  },
];

const ADMIN_NAV = [
  {
    to: '/admin', label: 'Overview',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
  },
  {
    to: '/admin/users', label: 'Members',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" /><path d="M16 3.13a4 4 0 010 7.75" /><path d="M21 21v-2a4 4 0 00-3-3.87" /></svg>
  },
  {
    to: '/admin/kyc', label: 'KYC Submissions',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v6c0 5-3 8-8 8s-8-3-8-8V7l8-4z" /><path d="M9 12l2 2 4-4" /></svg>
  },
  {
    to: '/admin/deposits', label: 'Deposits',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 14l4 4 4-4" /></svg>
  },
  {
    to: '/admin/withdrawals', label: 'Withdrawals',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 16V8M8 10l4-4 4 4" /></svg>
  },
  {
    to: '/admin/traders', label: 'Traders',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
  },
  {
    to: '/admin/wallets', label: 'Wallets',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" /><circle cx="16" cy="14" r="2" /></svg>
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const NAV = isAdmin ? ADMIN_NAV : CLIENT_NAV;

  return (
    <>
      {/* Hamburger — only for admin on mobile (clients use bottom nav) */}
      {isAdmin && (
        <>
          <button
            className={`sidebar-mobile-toggle ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
          {mobileOpen && (
            <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
          )}
        </>
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
            <path d="M8 32 L16 8 L24 20 L32 8" stroke="#1565ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>CopyTrade<em>Prime</em></span>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-av">{user?.full_name?.[0]?.toUpperCase() || 'U'}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-uname">{user?.full_name || 'User'}</p>
            <span className="sidebar-role">{isAdmin ? 'Administrator' : 'Client Account'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/admin'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="sidebar-logout"
          onClick={() => { logout(); navigate('/'); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sign Out
        </button>
      </aside>
    </>
  );
}
