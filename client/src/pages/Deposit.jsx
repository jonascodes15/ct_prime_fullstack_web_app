import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { depositService } from '../services/dataServices';
import './Deposit.css';

export default function Deposit() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ amount: '', tx_hash: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    depositService.getWallets()
      .then(({ data }) => { setWallets(data); if (data[0]) setSelected(data[0]); })
      .catch(() => setError('Failed to load wallet addresses.'))
      .finally(() => setLoading(false));
  }, []);

  const copyAddress = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError('');
    try {
      await depositService.submit({ wallet_id: selected.id, amount: form.amount, tx_hash: form.tx_hash });
      setSuccess('Deposit submitted! Our team will confirm it within 1–3 hours.');
      setForm({ amount: '', tx_hash: '' });
    } catch {
      setError('Failed to submit deposit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="dash-header">
          <div>
            <h1>Deposit Funds</h1>
            <p>Choose a cryptocurrency and send funds to the wallet below.</p>
          </div>
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}
        {error   && <div className="dash-error">{error}</div>}
        {success && (
          <div className="dash-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {success}
          </div>
        )}

        {!loading && (
          <div className="deposit-layout">
            {/* Crypto Wallet Cards */}
            <div className="deposit-section">
              <h3 className="deposit-section-title">Select Cryptocurrency</h3>
              <div className="wallet-grid">
                {wallets.map((w) => (
                  <div
                    key={w.id}
                    className={`wallet-card ${selected?.id === w.id ? 'active' : ''}`}
                    onClick={() => setSelected(w)}
                  >
                    <div className="wc-symbol">{w.coin_symbol}</div>
                    <div className="wc-info">
                      <span className="wc-name">{w.coin_name}</span>
                      {w.network && <span className="wc-network">{w.network}</span>}
                    </div>
                    {selected?.id === w.id && <span className="wc-check">✓</span>}
                  </div>
                ))}
              </div>

              {/* Fiat Coming Soon */}
              <div className="fiat-placeholder">
                <div className="fiat-icon">🏦</div>
                <div>
                  <div className="fiat-title">Bank / Card Deposits</div>
                  <div className="fiat-sub">Fiat deposit options coming soon</div>
                </div>
                <span className="badge-coming">Coming Soon</span>
              </div>
            </div>

            {/* Selected wallet address + form */}
            {selected && (
              <div className="deposit-section">
                <h3 className="deposit-section-title">
                  Send {selected.coin_name} ({selected.coin_symbol})
                </h3>

                <div className="address-card">
                  <div className="address-label">
                    Wallet Address
                    {selected.network && <span className="network-badge">{selected.network}</span>}
                  </div>
                  <div className="address-box">
                    <span className="address-text">{selected.wallet_address}</span>
                    <button
                      className={`copy-btn ${copied === selected.wallet_address ? 'copied' : ''}`}
                      onClick={() => copyAddress(selected.wallet_address)}
                    >
                      {copied === selected.wallet_address ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  {selected.qr_code_url && (
                    <div className="address-qr">
                      <img src={selected.qr_code_url} alt="QR Code" />
                    </div>
                  )}
                  <div className="address-warning">
                    ⚠ Only send {selected.coin_symbol} to this address.
                    {selected.network && ` Use the ${selected.network} network only.`} Sending wrong assets will result in permanent loss.
                  </div>
                </div>

                {/* Confirm form */}
                <form className="deposit-form" onSubmit={handleSubmit}>
                  <h4>Confirm Your Deposit</h4>
                  <div className="form-group">
                    <label>Amount Sent ({selected.coin_symbol})</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="any"
                      min="0"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Transaction Hash / ID</label>
                    <input
                      type="text"
                      placeholder="Paste your transaction hash"
                      value={form.tx_hash}
                      onChange={(e) => setForm({ ...form, tx_hash: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary deposit-submit" disabled={submitting}>
                    {submitting
                      ? <><span className="spinner-ring" style={{ width: 18, height: 18 }} /> Submitting...</>
                      : 'Submit Deposit Confirmation'
                    }
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
