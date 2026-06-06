import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import './Admin.css';

export default function AdminOverview() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Members',       value: stats.total_users,        color: 'var(--blue)',  icon: '👥' },
    { label: 'Total Deposited',     value: formatCurrency(stats.total_deposited),   color: 'var(--green)', icon: '💰' },
    { label: 'Platform Balance',    value: formatCurrency(stats.total_balance),     color: 'var(--cyan)',  icon: '📊' },
    { label: 'Pending Deposits',    value: stats.pending_deposits,    color: 'var(--gold)',  icon: '⏳' },
    { label: 'Pending Withdrawals', value: stats.pending_withdrawals, color: 'var(--red)',   icon: '📤' },
  ] : [];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="dash-header">
          <div>
            <h1>Admin Overview</h1>
            <p>Platform statistics and quick links.</p>
          </div>
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}

        {stats && (
          <>
            <div className="admin-stats-grid">
              {STAT_CARDS.map((s) => (
                <div key={s.label} className="admin-stat-card">
                  <div className="asc-icon">{s.icon}</div>
                  <div className="asc-val" style={{ color: s.color }}>{s.value}</div>
                  <div className="asc-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="admin-quick-links">
              <h3>Quick Actions</h3>
              <div className="aql-grid">
                {[
                  { label:'View All Members',     to:'/admin/users',       icon:'👥' },
                  { label:'Pending Deposits',     to:'/admin/deposits',    icon:'💳' },
                  { label:'Pending Withdrawals',  to:'/admin/withdrawals', icon:'📤' },
                  { label:'Manage Traders',       to:'/admin/traders',     icon:'📈' },
                  { label:'Manage Wallets',       to:'/admin/wallets',     icon:'💼' },
                ].map((l) => (
                  <a key={l.label} href={l.to} className="aql-card">
                    <span className="aql-icon">{l.icon}</span>
                    <span>{l.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
