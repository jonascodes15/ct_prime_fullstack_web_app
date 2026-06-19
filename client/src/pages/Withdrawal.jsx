import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { withdrawalService } from '../services/dataServices';
import { formatCurrency, formatDate } from '../utils/formatters';
import BottomNav from '../components/common/BottomNav';
import AccountMenu from '../components/common/AccountMenu';
import './Withdrawal.css';

const COINS = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'USDC', 'TRX', 'LTC', 'XRP', 'DOGE'];

export default function Withdrawal() {
  const [form, setForm] = useState({ amount: '', wallet_address: '', coin_symbol: 'USDT' });
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    withdrawalService.getHistory()
      .then(({ data }) => setHistory(data))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.amount || parseFloat(form.amount) <= 0) return setError('Please enter a valid amount.');
    if (!form.wallet_address.trim()) return setError('Please enter your wallet address.');
    setSubmitting(true);
    try {
      await withdrawalService.request(form);
      setSuccess('Withdrawal request submitted! Processing takes 1–24 hours.');
      setForm({ amount: '', wallet_address: '', coin_symbol: 'USDT' });
      const { data } = await withdrawalService.getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (s) => {
    if (s === 'approved') return 'green';
    if (s === 'rejected') return 'red';
    if (s === 'processing') return 'blue';
    return 'muted';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <AccountMenu />
      <main className="app-main">
        <div className="dash-header">
          <div>
            <h1>Withdrawal</h1>
            <p>Request a withdrawal to your personal crypto wallet.</p>
          </div>
        </div>

        {error   && <div className="dash-error">{error}</div>}
        {success && (
          <div className="dash-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {success}
          </div>
        )}

        <div className="withdrawal-layout">
          {/* Form */}
          <div className="dash-section withdrawal-form-section">
            <div className="section-title">New Withdrawal Request</div>

            <div className="withdrawal-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              Withdrawals are processed manually within 1–24 hours. Ensure your wallet address is correct — transfers are irreversible.
            </div>

            <form className="withdrawal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cryptocurrency</label>
                <select name="coin_symbol" value={form.coin_symbol} onChange={handleChange}>
                  {COINS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <div className="amount-input-wrap">
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    step="any"
                    min="0"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                  <span className="amount-coin">{form.coin_symbol}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Your {form.coin_symbol} Wallet Address</label>
                <input
                  type="text"
                  name="wallet_address"
                  placeholder="Paste your receiving wallet address"
                  value={form.wallet_address}
                  onChange={handleChange}
                  required
                />
                <span className="field-hint">Double-check this address. Incorrect addresses lead to permanent fund loss.</span>
              </div>

              <button type="submit" className="btn-primary withdrawal-submit" disabled={submitting}>
                {submitting
                  ? <><span className="spinner-ring" style={{ width: 18, height: 18 }} /> Processing...</>
                  : <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                      </svg>
                      Submit Withdrawal Request
                    </>
                }
              </button>
            </form>
          </div>

          {/* Withdrawal History */}
          <div className="dash-section">
            <div className="section-title">Withdrawal History</div>
            {loadingHistory && <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><LoadingSpinner size={28} /></div>}
            {!loadingHistory && history.length === 0 && (
              <div className="dash-empty">No withdrawal requests yet.</div>
            )}
            {!loadingHistory && history.length > 0 && (
              <div className="wh-list">
                {history.map((w) => (
                  <div key={w.id} className="wh-row">
                    <div className="wh-left">
                      <div className="wh-coin">{w.coin_symbol}</div>
                      <div>
                        <div className="wh-amount">{formatCurrency(w.amount)}</div>
                        <div className="wh-addr">{w.wallet_address.slice(0, 12)}...{w.wallet_address.slice(-6)}</div>
                      </div>
                    </div>
                    <div className="wh-right">
                      <span className={`wh-status status-${statusColor(w.status)}`}>{w.status}</span>
                      <span className="wh-date">{formatDate(w.requested_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
