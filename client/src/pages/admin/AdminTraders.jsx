import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import './Admin.css';

export default function AdminTraders() {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', strategy: '', win_rate: '', monthly_return: '', avatar_url: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/admin/traders').then(({ data }) => setTraders(data)).finally(() => setLoading(false));
  }, []);

  const addTrader = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/traders', form);
      const { data } = await api.get('/admin/traders');
      setTraders(data);
      setForm({ name: '', strategy: '', win_rate: '', monthly_return: '', avatar_url: '' });
      setSuccess('Trader added!');
      setTimeout(() => setSuccess(''), 2000);
    } catch { /* silent */ }
    setSaving(false);
  };

  const toggleActive = async (t) => {
    await api.patch(`/admin/traders/${t.id}`, { ...t, is_active: !t.is_active });
    setTraders((prev) => prev.map((x) => x.id === t.id ? { ...x, is_active: !x.is_active } : x));
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="dash-header">
          <div><h1>Traders</h1><p>Manage expert traders available for clients to copy.</p></div>
        </div>

        {/* Add trader form */}
        <div className="dash-section" style={{ marginBottom: 24 }}>
          <div className="section-title">Add New Trader</div>
          {success && <div className="alert-success" style={{ marginBottom: 14 }}>{success}</div>}
          <form className="trader-form" onSubmit={addTrader}>
            <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Strategy</label><input value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })} /></div>
            <div className="form-group"><label>Win Rate (%)</label><input type="number" step="0.01" value={form.win_rate} onChange={(e) => setForm({ ...form, win_rate: e.target.value })} /></div>
            <div className="form-group"><label>Monthly Return (%)</label><input type="number" step="0.01" value={form.monthly_return} onChange={(e) => setForm({ ...form, monthly_return: e.target.value })} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Avatar URL</label><input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} /></div>
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Adding…' : '+ Add Trader'}
              </button>
            </div>
          </form>
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}

        <div className="traders-admin-grid">
          {traders.map((t) => (
            <div key={t.id} className={`trader-admin-card ${!t.is_active ? 'inactive' : ''}`}>
              <div className="tac-avatar">{t.avatar_url ? <img src={t.avatar_url} alt={t.name} /> : <span>{t.name[0]}</span>}</div>
              <div className="tac-info">
                <div className="tac-name">{t.name}</div>
                <div className="tac-strategy">{t.strategy}</div>
              </div>
              <div className="tac-stats">
                <span className="badge-green">+{t.monthly_return}% / mo</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--grey)' }}>{t.win_rate}% win rate</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--grey)' }}>{t.total_followers} followers</span>
              </div>
              <button
                className={`mep-toggle-btn ${t.is_active ? 'suspend' : 'activate'}`}
                onClick={() => toggleActive(t)}
              >
                {t.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
