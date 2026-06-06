import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Admin.css';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('pending');
  const [acting,   setActing]   = useState({});

  useEffect(() => {
    api.get('/admin/deposits')
      .then(({ data }) => setDeposits(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setActing((a) => ({ ...a, [id]: true }));
    try {
      await api.patch(`/admin/deposits/${id}`, { status });
      setDeposits((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
    } catch { /* silent */ }
    setActing((a) => ({ ...a, [id]: false }));
  };

  const filtered = deposits.filter((d) => filter === 'all' || d.status === filter);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="dash-header">
          <div><h1>Deposits</h1><p>Review and confirm client deposit submissions.</p></div>
        </div>

        <div className="admin-filter-tabs">
          {['pending','confirmed','rejected','all'].map((f) => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">{deposits.filter((d) => f === 'all' || d.status === f).length}</span>
            </button>
          ))}
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}

        <div className="admin-table-wrap">
          {filtered.length === 0 && !loading && <div className="dash-empty">No deposits found.</div>}
          {filtered.map((d) => (
            <div key={d.id} className="admin-row">
              <div className="ar-user">
                <div className="ar-avatar">{d.full_name?.[0]}</div>
                <div>
                  <div className="ar-name">{d.full_name}</div>
                  <div className="ar-email">{d.email}</div>
                </div>
              </div>
              <div className="ar-detail">
                <span className="ar-coin">{d.coin_symbol}</span>
                <span className="ar-amount">{formatCurrency(d.amount)}</span>
              </div>
              {d.tx_hash && (
                <div className="ar-hash" title={d.tx_hash}>
                  TX: {d.tx_hash.slice(0,14)}…
                </div>
              )}
              <div className="ar-date">{formatDate(d.submitted_at)}</div>
              <span className={`ar-status status-${d.status}`}>{d.status}</span>
              {d.status === 'pending' && (
                <div className="ar-actions">
                  <button
                    className="ar-btn confirm"
                    disabled={acting[d.id]}
                    onClick={() => updateStatus(d.id, 'confirmed')}
                  >
                    {acting[d.id] ? '…' : '✓ Confirm'}
                  </button>
                  <button
                    className="ar-btn reject"
                    disabled={acting[d.id]}
                    onClick={() => updateStatus(d.id, 'rejected')}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
