import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import BottomNav from '../../components/common/BottomNav';
import AccountMenu from '../../components/common/AccountMenu';
import api from '../../services/api';
import './Account.css';

export default function ReferralPage() {
  const [referral, setReferral] = useState(null);
  const [copied,   setCopied]   = useState(false);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/account/referral')
      .then(({ data }) => setReferral(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const referralLink = referral
    ? `https://copytradeprime.com/register?ref=${referral.referral_code}`
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(`Join CopyTradePrime and start copy trading today! Use my referral link: ${referralLink}`)}`);

  const shareTelegram = () =>
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join CopyTradePrime — Smart Investments & Copy Trading')}`);

  const shareEmail = () =>
    window.open(`mailto:?subject=Join CopyTradePrime&body=Hey! I think you'll love CopyTradePrime for copy trading. Use my link to get started: ${referralLink}`);

  return (
    <div className="app-layout">
      <Sidebar />
      <AccountMenu />
      <main className="app-main acct-main">
        <div className="acct-page-header">
          <Link to="/dashboard" className="acct-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </Link>
          <div>
            <h1>Referral Program</h1>
            <p>Invite friends and earn 15% on their deposits</p>
          </div>
        </div>

        {/* Hero banner */}
        <div className="ref-hero">
          <div className="ref-hero-glow"/>
          <div className="ref-hero-content">
            <div className="ref-hero-badge">🎁 Earn While You Sleep</div>
            <h2>Invite Friends.<br/>Earn <span style={{color:'var(--gold)'}}>15%</span> Deposit Bonus.</h2>
            <p>For every friend you refer who activates a trader and makes their first deposit, you earn a <strong>15% bonus</strong> credited directly to your account balance.</p>
          </div>
          {/* How it works steps */}
          <div className="ref-steps">
            {[
              { step:'01', title:'Share Your Link',     desc:'Send your unique referral link to friends'             },
              { step:'02', title:'They Register',       desc:'Your friend signs up using your referral link'         },
              { step:'03', title:'They Activate',       desc:'Your friend activates a trader and makes a deposit'    },
              { step:'04', title:'You Earn 15%',        desc:'15% of their deposit is credited to your balance'      },
            ].map((s) => (
              <div key={s.step} className="ref-step">
                <div className="ref-step-num">{s.step}</div>
                <div className="ref-step-title">{s.title}</div>
                <div className="ref-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="dash-loading" style={{padding:'40px 0'}}>
            <span className="spinner-ring" style={{width:32,height:32}}/>
          </div>
        ) : (
          <>
            {/* Referral code + link */}
            <div className="acct-section">
              <h3 className="acct-section-title">Your Referral Link</h3>

              <div className="ref-code-row">
                <div className="ref-code-label">Referral Code</div>
                <div className="ref-code-display">
                  {referral?.referral_code || '—'}
                </div>
              </div>

              <div className="ref-link-box">
                <div className="ref-link-text">{referralLink}</div>
                <button
                  className={`ref-copy-btn ${copied ? 'copied' : ''}`}
                  onClick={copyLink}
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>

              {/* Share buttons */}
              <div className="ref-share-row">
                <div className="ref-share-label">Share via</div>
                <div className="ref-share-btns">
                  <button className="ref-share-btn whatsapp" onClick={shareWhatsApp}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.115 1.523 5.844L.057 23.571l5.9-1.543A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 01-5.012-1.371l-.36-.214-3.5.916.935-3.41-.235-.375A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                    WhatsApp
                  </button>
                  <button className="ref-share-btn telegram" onClick={shareTelegram}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.008 9.461c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.288 13.78l-2.95-.924c-.642-.2-.654-.642.136-.953l11.53-4.448c.537-.194 1.006.131.558 1.793z"/>
                    </svg>
                    Telegram
                  </button>
                  <button className="ref-share-btn email" onClick={shareEmail}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <polyline points="2,4 12,13 22,4"/>
                    </svg>
                    Email
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="acct-section">
              <h3 className="acct-section-title">Your Referral Stats</h3>
              <div className="ref-stats-grid">
                <div className="ref-stat-card">
                  <div className="ref-stat-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/>
                    </svg>
                  </div>
                  <div className="ref-stat-val">{referral?.total_referrals ?? 0}</div>
                  <div className="ref-stat-label">Total Referrals</div>
                </div>
                <div className="ref-stat-card">
                  <div className="ref-stat-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <div className="ref-stat-val">{referral?.active_referrals ?? 0}</div>
                  <div className="ref-stat-label">Active Traders</div>
                </div>
                <div className="ref-stat-card gold">
                  <div className="ref-stat-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                    </svg>
                  </div>
                  <div className="ref-stat-val">${referral?.total_earned ?? '0.00'}</div>
                  <div className="ref-stat-label">Total Earned</div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="acct-section">
              <h3 className="acct-section-title">Terms & Conditions</h3>
              <ul className="ref-terms-list">
                <li>Your referral must register using your unique referral link.</li>
                <li>Your referral must activate a copy trader within 30 days of registration.</li>
                <li>Your referral must make a minimum deposit of $100 to qualify.</li>
                <li>You earn 15% of your referral's first deposit, credited to your balance.</li>
                <li>Bonus is credited within 24 hours after your referral's deposit is confirmed.</li>
                <li>Self-referrals or fraudulent accounts are not eligible.</li>
                <li>CopyTradePrime reserves the right to modify the program at any time.</li>
              </ul>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
