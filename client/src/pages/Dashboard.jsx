import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { dashboardService } from '../services/dataServices';
import { formatCurrency, formatDate } from '../utils/formatters';
import BottomNav from '../components/common/BottomNav';
import AccountMenu from '../components/common/AccountMenu';
import './Dashboard.css';

export default function Dashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    dashboardService.getData()
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <AccountMenu />
      <main className="app-main">

        {/* Header — NO deposit/withdraw buttons here */}
        <div className="dash-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back — here's your portfolio overview.</p>
          </div>
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}
        {error   && <div className="dash-error">{error}</div>}

        {data && (
          <>
            {/* Balance Cards */}
            <div className="balance-grid">
              <div className="balance-card main-balance">
                <div className="bc-label">Total Balance</div>
                <div className="bc-value">{formatCurrency(data.balance?.balance)}</div>
                <div className="bc-sub">
                  <span className="badge-green">↑ Active</span>
                  <span>Updated just now</span>
                </div>
              </div>

              <div className="balance-card">
                <div className="bc-label">Total Profit</div>
                <div className="bc-value green">{formatCurrency(data.balance?.total_profit)}</div>
                <div className="bc-sub"><span className="badge-green">↑ All time</span></div>
              </div>

              <div className="balance-card">
                <div className="bc-label">Total Deposited</div>
                <div className="bc-value">{formatCurrency(data.balance?.total_deposited)}</div>
                <div className="bc-sub"><span style={{ color:'var(--grey-dark)', fontSize:'0.82rem' }}>Cumulative</span></div>
              </div>

              <div className="balance-card">
                <div className="bc-label">Active Trader</div>
                {data.trader ? (
                  <>
                    <div className="bc-value trader-name">{data.trader.name}</div>
                    <div className="bc-sub">
                      <span className="badge-green">+{data.trader.monthly_return}% monthly</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bc-value" style={{ fontSize:'1rem', color:'var(--grey)' }}>No trader</div>
                    <Link to="/activate-trader" className="bc-action">Activate →</Link>
                  </>
                )}
              </div>
            </div>

            {/* Earnings + Trades */}
            <div className="dash-grid-2">
              <div className="dash-section">
                <div className="section-title">Recent Earnings</div>
                {data.earnings?.length > 0 ? (
                  <div className="earnings-list">
                    {data.earnings.map((e) => (
                      <div key={e.id} className="earning-row">
                        <div className="er-left">
                          <span className={`er-type ${e.period_type}`}>{e.period_type}</span>
                          <span className="er-note">{e.note || 'Earnings credit'}</span>
                        </div>
                        <div className="er-right">
                          <span className="er-amount green">+{formatCurrency(e.amount)}</span>
                          <span className="er-date">{formatDate(e.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dash-empty">No earnings recorded yet.</div>
                )}
              </div>

              <div className="dash-section">
                <div className="section-title">Active Trades</div>
                {data.trades?.length > 0 ? (
                  <div className="trades-list">
                    {data.trades.map((t) => (
                      <div key={t.id} className="trade-row">
                        <div className="tr-left">
                          <span className={`trade-dir ${t.direction.toLowerCase()}`}>{t.direction}</span>
                          <div>
                            <div className="tr-asset">{t.asset}</div>
                            <div className="tr-entry">Entry: {formatCurrency(t.entry_price)}</div>
                          </div>
                        </div>
                        <div className="tr-right">
                          <span className={`tr-pnl ${t.profit_loss >= 0 ? 'green' : 'red'}`}>
                            {t.profit_loss >= 0 ? '+' : ''}{formatCurrency(t.profit_loss)}
                          </span>
                          <span className="tr-qty">Qty: {t.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dash-empty">No active trades at the moment.</div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
