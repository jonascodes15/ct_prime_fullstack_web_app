import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './BottomNav.css';

/* ── High-quality SVG icons ── */
const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L12 3l9 9"/>
    <path d="M9 21V12h6v9"/>
    <path d="M3 12v9h18V12"/>
  </svg>
);

const DepositIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 8v8M8 14l4 4 4-4"/>
  </svg>
);

const WithdrawIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 16V8M8 10l4-4 4 4"/>
  </svg>
);

const TradersIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3.5"/>
    <path d="M3 20c0-3.5 2.7-6 6-6"/>
    <circle cx="17" cy="14" r="3"/>
    <path d="M14 20.5c0-2 1.3-3.5 3-3.5s3 1.5 3 3.5"/>
    <path d="M15 7l2 2 3-3"/>
  </svg>
);

const NewsIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2"/>
    <path d="M4 11a2 2 0 000 4h.01"/>
    <path d="M2 9v10a2 2 0 002 2"/>
    <line x1="10" y1="7" x2="18" y2="7"/>
    <line x1="10" y1="11" x2="18" y2="11"/>
    <line x1="10" y1="15" x2="14" y2="15"/>
  </svg>
);

const MarketsIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const TABS = [
  { to: '/dashboard',       label: 'Home',     Icon: HomeIcon     },
  { to: '/deposit',         label: 'Deposit',  Icon: DepositIcon  },
  { to: '/withdrawal',      label: 'Withdraw', Icon: WithdrawIcon },
  { to: '/activate-trader', label: 'Traders',  Icon: TradersIcon  },
  { to: '/news',            label: 'News',     Icon: NewsIcon     },
  { to: '/live-markets',    label: 'Markets',  Icon: MarketsIcon  },
];

export default function BottomNav() {
  const { user } = useAuth();
  if (user?.role === 'admin') return null; // admin uses sidebar only

  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/dashboard'}
          className={({ isActive }) => `bn-tab${isActive ? ' bn-active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bn-icon"><Icon active={isActive} /></span>
              <span className="bn-label">{label}</span>
              {isActive && <span className="bn-dot" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
