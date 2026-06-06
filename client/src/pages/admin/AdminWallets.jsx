import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import './Admin.css';

export default function AdminWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ coin_name:'', coin_symbol:'', network:'', wallet_address:'', qr_code_url:'' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(null); // wallet being edited

  useEffect(() => {
    api.get('/admin/wallets').then(({ data }) => setWallets(data)).finally(() => setLoading(false));
  }, []);

  const reload = () => api.get('/admin/wallets').then(({ data }) => setWallets(data));

  const addWallet = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/wallets', form);
      await reload();
      setForm({ coin_name:'', coin_symbol:'', network:'', wallet_address:'', qr_code_url:'' });
      setSuccess('Wallet added!');
      setTimeout(() => setSuccess(''), 2000);
    } catch { /* silent */ }
    setSaving(false);
  };

  const saveEdit = async (w) => {
    await api.patch(`/admin/wallets/${w.id}`, w);
    await reload();
    setEditing(null);
  };

  const deleteWallet = async (id) => {
    if (!window.confirm('Delete this wallet?')) return;
    await api.delete(`/admin/wallets/${id}`);
    setWallets((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="dash-header">
          <div><h1>Crypto Wallets</h1><p>Manage deposit wallet addresses shown to clients.</p></div>
        </div>

        {/* Add wallet form */}
        <div className="dash-section" style={{ marginBottom:24 }}>
          <div className="section-title">Add Wallet</div>
          {success && <div className="alert-success" style={{ marginBottom:14 }}>{success}</div>}
          <form className="trader-form" onSubmit={addWallet}>
            <div className="form-group"><label>Coin Name</label><input placeholder="Bitcoin" value={form.coin_name} onChange={(e) => setForm({...form, coin_name:e.target.value})} required /></div>
            <div className="form-group"><label>Symbol</label><input placeholder="BTC" value={form.coin_symbol} onChange={(e) => setForm({...form, coin_symbol:e.target.value})} required /></div>
            <div className="form-group"><label>Network</label><input placeholder="Bitcoin Network" value={form.network} onChange={(e) => setForm({...form, network:e.target.value})} /></div>
            <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Wallet Address</label><input value={form.wallet_address} onChange={(e) => setForm({...form, wallet_address:e.target.value})} required /></div>
            <div className="form-group" style={{ gridColumn:'1/-1' }}><label>QR Code URL (optional)</label><input value={form.qr_code_url} onChange={(e) => setForm({...form, qr_code_url:e.target.value})} /></div>
            <div style={{ gridColumn:'1/-1' }}>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Adding…' : '+ Add Wallet'}</button>
            </div>
          </form>
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}

        <div className="wallets-list">
          {wallets.map((w) => (
            editing?.id === w.id ? (
              <div key={w.id} className="wallet-edit-card">
                <div className="trader-form">
                  {['coin_name','coin_symbol','network','wallet_address','qr_code_url'].map((f) => (
                    <div key={f} className="form-group" style={f==='wallet_address'||f==='qr_code_url' ? {gridColumn:'1/-1'} : {}}>
                      <label>{f.replace(/_/g,' ')}</label>
                      <input value={editing[f]||''} onChange={(e) => setEditing({...editing, [f]:e.target.value})} />
                    </div>
                  ))}
                  <div style={{ gridColumn:'1/-1', display:'flex', gap:10 }}>
                    <button className="btn-primary" onClick={() => saveEdit(editing)}>Save</button>
                    <button className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={w.id} className="wallet-row">
                <div className="wr-sym">{w.coin_symbol}</div>
                <div className="wr-info">
                  <div className="wr-name">{w.coin_name}</div>
                  {w.network && <div className="wr-net">{w.network}</div>}
                </div>
                <div className="wr-addr">{w.wallet_address}</div>
                <span className={`ar-status ${w.is_active ? 'status-confirmed' : 'status-rejected'}`}>
                  {w.is_active ? 'Active' : 'Hidden'}
                </span>
                <div className="wr-actions">
                  <button className="ar-btn confirm" onClick={() => setEditing({...w})}>Edit</button>
                  <button className="ar-btn reject"  onClick={() => deleteWallet(w.id)}>Delete</button>
                </div>
              </div>
            )
          ))}
        </div>
      </main>
    </div>
  );
}
