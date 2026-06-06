import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Admin.css';

/* Debounce helper */
function useDebounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function MemberRow({ member, onUpdate }) {
  const [fields, setFields] = useState({
    balance:         parseFloat(member.balance        || 0).toFixed(2),
    total_profit:    parseFloat(member.total_profit   || 0).toFixed(2),
    total_deposited: parseFloat(member.total_deposited|| 0).toFixed(2),
  });
  const [saving, setSaving] = useState({});
  const [saved,  setSaved]  = useState({});
  const [expanded, setExpanded] = useState(false);

  /* Save a single field 800ms after typing stops */
  const saveField = useCallback(async (field, value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return;
    setSaving((s) => ({ ...s, [field]: true }));
    try {
      await api.patch(`/admin/users/${member.id}/balance`, { [field]: num });
      setSaved((s) => ({ ...s, [field]: true }));
      onUpdate(member.id, field, num);
      setTimeout(() => setSaved((s) => ({ ...s, [field]: false })), 1800);
    } catch { /* silent */ }
    setSaving((s) => ({ ...s, [field]: false }));
  }, [member.id, onUpdate]);

  const handleChange = (field, value) => {
    setFields((f) => ({ ...f, [field]: value }));
    debouncedSave(field, value);
  };

  const debouncedSave = useCallback(
    (() => {
      const timers = {};
      return (field, value) => {
        clearTimeout(timers[field]);
        timers[field] = setTimeout(() => saveField(field, value), 800);
      };
    })(),
    [saveField]
  );

  const toggleStatus = async () => {
    await api.patch(`/admin/users/${member.id}/status`, { is_active: !member.is_active });
    onUpdate(member.id, 'is_active', !member.is_active);
  };

  const BALANCE_FIELDS = [
    { key: 'balance',         label: 'Total Balance',   color: '#fff'             },
    { key: 'total_profit',    label: 'Total Profit',    color: 'var(--green)'     },
    { key: 'total_deposited', label: 'Total Deposited', color: 'var(--off-white)' },
  ];

  return (
    <div className={`member-card ${expanded ? 'expanded' : ''}`}>
      {/* Member summary row */}
      <div className="mc-row" onClick={() => setExpanded(!expanded)}>
        <div className="mc-avatar">{member.full_name?.[0]?.toUpperCase()}</div>
        <div className="mc-info">
          <div className="mc-name">{member.full_name}</div>
          <div className="mc-email">{member.email}</div>
        </div>
        <div className="mc-balances">
          <div className="mcb-item">
            <span className="mcb-label">Balance</span>
            <span className="mcb-val">{formatCurrency(member.balance)}</span>
          </div>
          <div className="mcb-item">
            <span className="mcb-label">Profit</span>
            <span className="mcb-val green">{formatCurrency(member.total_profit)}</span>
          </div>
          <div className="mcb-item">
            <span className="mcb-label">Deposited</span>
            <span className="mcb-val">{formatCurrency(member.total_deposited)}</span>
          </div>
        </div>
        <div className="mc-meta">
          <span className={`mc-status ${member.is_active ? 'active' : 'suspended'}`}>
            {member.is_active ? 'Active' : 'Suspended'}
          </span>
          <span className="mc-joined">Joined {formatDate(member.created_at)}</span>
        </div>
        <div className="mc-chevron">{expanded ? '▲' : '▼'}</div>
      </div>

      {/* Expanded edit panel */}
      {expanded && (
        <div className="mc-edit-panel" onClick={(e) => e.stopPropagation()}>
          <div className="mep-title">Edit Balances — <em>changes save automatically as you type</em></div>
          <div className="mep-fields">
            {BALANCE_FIELDS.map((f) => (
              <div key={f.key} className="mep-field">
                <label style={{ color: f.color }}>{f.label}</label>
                <div className="mep-input-wrap">
                  <span className="mep-prefix">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fields[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  />
                  <span className="mep-indicator">
                    {saving[f.key] && <span className="spinner-ring" style={{ width:14, height:14 }}/>}
                    {saved[f.key]  && <span className="mep-saved">✓ Saved</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick-add earnings */}
          <EarningForm userId={member.id} />

          {/* Quick-add trade */}
          <TradeForm userId={member.id} />

          {/* Status toggle */}
          <div className="mep-actions">
            <button
              className={`mep-toggle-btn ${member.is_active ? 'suspend' : 'activate'}`}
              onClick={toggleStatus}
            >
              {member.is_active ? '⛔ Suspend Account' : '✅ Activate Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EarningForm({ userId }) {
  const [form, setForm] = useState({ amount:'', period_type:'daily', note:'' });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/earnings', { user_id: userId, ...form });
      setDone(true);
      setForm({ amount:'', period_type:'daily', note:'' });
      setTimeout(() => setDone(false), 2000);
    } catch { /* silent */ }
    setSaving(false);
  };

  return (
    <div className="mep-subform">
      <div className="mep-subtitle">Add Earnings Credit</div>
      <form className="mep-inline-form" onSubmit={submit}>
        <input type="number" placeholder="Amount ($)" min="0" step="0.01"
          value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required />
        <select value={form.period_type} onChange={(e) => setForm({...form, period_type: e.target.value})}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input type="text" placeholder="Note (optional)"
          value={form.note} onChange={(e) => setForm({...form, note: e.target.value})} />
        <button type="submit" className="mep-action-btn" disabled={saving}>
          {saving ? <span className="spinner-ring" style={{width:14,height:14}}/> : done ? '✓' : '+ Add'}
        </button>
      </form>
    </div>
  );
}

function TradeForm({ userId }) {
  const [form, setForm] = useState({ asset:'BTC/USD', direction:'BUY', entry_price:'', quantity:'', profit_loss:'0' });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/trades', { user_id: userId, ...form });
      setDone(true);
      setForm({ asset:'BTC/USD', direction:'BUY', entry_price:'', quantity:'', profit_loss:'0' });
      setTimeout(() => setDone(false), 2000);
    } catch { /* silent */ }
    setSaving(false);
  };

  return (
    <div className="mep-subform">
      <div className="mep-subtitle">Add Active Trade</div>
      <form className="mep-inline-form" onSubmit={submit}>
        <input type="text" placeholder="Asset (e.g. BTC/USD)"
          value={form.asset} onChange={(e) => setForm({...form, asset: e.target.value})} required />
        <select value={form.direction} onChange={(e) => setForm({...form, direction: e.target.value})}>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <input type="number" placeholder="Entry price" step="any" min="0"
          value={form.entry_price} onChange={(e) => setForm({...form, entry_price: e.target.value})} required />
        <input type="number" placeholder="Qty" step="any" min="0"
          value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} required />
        <input type="number" placeholder="P&L ($)" step="any"
          value={form.profit_loss} onChange={(e) => setForm({...form, profit_loss: e.target.value})} />
        <button type="submit" className="mep-action-btn" disabled={saving}>
          {saving ? <span className="spinner-ring" style={{width:14,height:14}}/> : done ? '✓' : '+ Trade'}
        </button>
      </form>
    </div>
  );
}

export default function AdminMembers() {
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search,  setSearch]    = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setMembers(data))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (id, field, value) => {
    setMembers((prev) =>
      prev.map((m) => m.id === id ? { ...m, [field]: value } : m)
    );
  };

  const filtered = members.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="dash-header">
          <div>
            <h1>Members</h1>
            <p>Manage all registered client accounts and their balances.</p>
          </div>
          <div className="admin-header-meta">
            <span className="admin-count">{members.length} total members</span>
          </div>
        </div>

        {/* Search */}
        <div className="admin-search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="admin-search"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}

        {!loading && filtered.length === 0 && (
          <div className="dash-empty" style={{ paddingTop: 60 }}>No members found.</div>
        )}

        <div className="members-list">
          {filtered.map((m) => (
            <MemberRow key={m.id} member={m} onUpdate={handleUpdate} />
          ))}
        </div>
      </main>
    </div>
  );
}
