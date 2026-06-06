import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Admin.css';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter,  setFilter]          = useState('pending');
  const [acting,  setActing]          = useState({});
  const [noteMap, setNoteMap]         = useState({});

  useEffect(() => {
    api.get('/admin/withdrawals')
      .then(({ data }) => setWithdrawals(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setActing((a) => ({ ...a, [id]: true }));
    try {
      await api.patch(`/admin/withdrawals/${id}`, { status, admin_note: noteMap[id] || '' });
      setWithdrawals((prev) => prev.map((w) => w.id === id ? { ...w, status } : w));
    } catch { /* silent */ }
    setActing((a) => ({ ...a, [id]: false }));
  };

  const filtered = withdrawals.filter((w) => filter === 'all' || w.status === filter);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="dash-header">
          <div><h1>Withdrawals</h1><p>Review and process client withdrawal requests.</p></div>
        </div>

        <div className="admin-filter-tabs">
          {['pending','approved','rejected','all'].map((f) => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">{withdrawals.filter((w) => f === 'all' || w.status === f).length}</span>
            </button>
          ))}
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}

        <div className="admin-table-wrap">
          {filtered.length === 0 && !loading && <div className="dash-empty">No withdrawals found.</div>}
          {filtered.map((w) => (
            <div key={w.id} className="admin-row">
              <div className="ar-user">
                <div className="ar-avatar">{w.full_name?.[0]}</div>
                <div>
                  <div className="ar-name">{w.full_name}</div>
                  <div className="ar-email">{w.email}</div>
                </div>
              </div>
              <div className="ar-detail">
                <span className="ar-coin">{w.coin_symbol}</span>
                <span className="ar-amount">{formatCurrency(w.amount)}</span>
              </div>
              <div className="ar-hash" title={w.wallet_address}>
                To: {w.wallet_address.slice(0,14)}…
              </div>
              <div className="ar-date">{formatDate(w.requested_at)}</div>
              <span className={`ar-status status-${w.status}`}>{w.status}</span>
              {w.status === 'pending' && (
                <div className="ar-actions ar-actions-col">
                  <input
                    type="text"
                    className="ar-note-input"
                    placeholder="Admin note (optional)"
                    value={noteMap[w.id] || ''}
                    onChange={(e) => setNoteMap((n) => ({ ...n, [w.id]: e.target.value }))}
                  />
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="ar-btn confirm" disabled={acting[w.id]} onClick={() => updateStatus(w.id,'approved')}>
                      {acting[w.id] ? '…' : '✓ Approve'}
                    </button>
                    <button className="ar-btn reject"  disabled={acting[w.id]} onClick={() => updateStatus(w.id,'rejected')}>
                      ✕ Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
