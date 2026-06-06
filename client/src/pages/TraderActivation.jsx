import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { traderService } from '../services/dataServices';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './TraderActivation.css';

export default function TraderActivation() {
  const [traders, setTraders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    traderService.list()
      .then(({ data }) => setTraders(data))
      .catch(() => setError('Failed to load traders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleActivate = async () => {
    if (!selected) return;
    setActivating(true);
    try {
      await traderService.activate(selected);
      navigate('/dashboard');
    } catch {
      setError('Failed to activate trader. Please try again.');
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="activation-page">
      <div className="activation-bg">
        <div className="auth-grid" />
        <div className="auth-orb auth-orb-1" />
      </div>

      <div className="activation-inner">
        <div className="activation-header">
          <div className="activation-logo">◈ CopyTrade<em>Prime</em></div>
          <h1>Choose Your Expert Trader</h1>
          <p>Select a trader to copy. Their trades will be mirrored in your account automatically.</p>
        </div>

        {loading && <LoadingSpinner size={40} />}
        {error   && <div className="auth-error" style={{ maxWidth: 600, margin: '0 auto 24px' }}>{error}</div>}

        {!loading && (
          <>
            <div className="traders-grid">
              {traders.map((t) => (
                <div
                  key={t.id}
                  className={`trader-card ${selected === t.id ? 'selected' : ''}`}
                  onClick={() => setSelected(t.id)}
                >
                  <div className="tc-avatar">
                    {t.avatar_url
                      ? <img src={t.avatar_url} alt={t.name} />
                      : <span>{t.name[0]}</span>
                    }
                    <span className={`tc-status ${t.is_active ? 'online' : 'offline'}`} />
                  </div>

                  <div className="tc-info">
                    <h4>{t.name}</h4>
                    <p className="tc-strategy">{t.strategy}</p>
                  </div>

                  <div className="tc-stats">
                    <div className="tc-stat">
                      <span className="ts-label">Win Rate</span>
                      <span className="ts-val green">{t.win_rate}%</span>
                    </div>
                    <div className="tc-stat">
                      <span className="ts-label">Monthly ROI</span>
                      <span className="ts-val green">+{t.monthly_return}%</span>
                    </div>
                    <div className="tc-stat">
                      <span className="ts-label">Followers</span>
                      <span className="ts-val">{t.total_followers.toLocaleString()}</span>
                    </div>
                  </div>

                  {selected === t.id && (
                    <div className="tc-selected-badge">✓ Selected</div>
                  )}
                </div>
              ))}
            </div>

            <div className="activation-footer">
              <button
                className="btn-primary activation-btn"
                disabled={!selected || activating}
                onClick={handleActivate}
              >
                {activating
                  ? <><span className="spinner-ring" style={{ width: 18, height: 18 }} /> Activating...</>
                  : 'Activate Selected Trader →'
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
