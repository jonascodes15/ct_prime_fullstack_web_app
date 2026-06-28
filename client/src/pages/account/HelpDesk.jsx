import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import BottomNav from '../../components/common/BottomNav';
import AccountMenu from '../../components/common/AccountMenu';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import './Account.css';

const FAQS = [
  {
    question: 'What is CopyTradePrime, and what does it offer?',
    answer: 'CopyTradePrime is a copy trading platform where clients can activate expert traders, track account activity, receive updates, and manage deposits and withdrawals from one dashboard.',
  },
  {
    question: 'How secure is the CopyTradePrime platform?',
    answer: 'CopyTradePrime protects account access with authenticated sessions, account verification, and admin review flows for important account actions.',
  },
  {
    question: 'What is Copy Trading, and how does it work?',
    answer: 'Copy trading lets you follow an experienced trader strategy. Once activated, your dashboard shows the trader assigned to your account and trading activity related to your portfolio.',
  },
  {
    question: 'Do I need prior trading experience to use CopyTradePrime?',
    answer: 'No. CopyTradePrime is built for clients who want a guided trading experience while still seeing deposits, profits, active trades, and updates clearly in their dashboard.',
  },
  {
    question: 'What assets can I trade on CopyTradePrime?',
    answer: 'Available assets depend on the active traders and market opportunities currently supported by the platform. You can review active trades from your dashboard.',
  },
  {
    question: 'How do I get started with CopyTradePrime?',
    answer: 'Create your account, complete any required verification, fund your wallet, and activate a trader from your user dashboard.',
  },
];

const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function HelpDesk() {
  const [subject, setSubject] = useState('');
  const [complaint, setComplaint] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [openFaq, setOpenFaq] = useState(0);

  const loadTickets = () => {
    api.get('/account/tickets')
      .then(({ data }) => setTickets(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    setMessage('');
    if (!file) {
      setScreenshot(null);
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setScreenshot(null);
      setMessageType('error');
      setMessage('Only JPG or PNG screenshots are allowed.');
      return;
    }
    if (file.size > 100 * 1024) {
      setScreenshot(null);
      setMessageType('error');
      setMessage('Screenshot must be below 100KB.');
      return;
    }
    setScreenshot(file);
  };

  const submitTicket = async (event) => {
    event.preventDefault();
    if (!subject.trim() || !complaint.trim()) {
      setMessageType('error');
      setMessage('Please add a subject and describe your complaint.');
      return;
    }

    const form = new FormData();
    form.append('subject', subject.trim());
    form.append('complaint', complaint.trim());
    if (screenshot) form.append('screenshot', screenshot);

    setSubmitting(true);
    setMessage('');
    try {
      await api.post('/account/tickets', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubject('');
      setComplaint('');
      setScreenshot(null);
      setMessageType('success');
      setMessage('Ticket submitted successfully.');
      loadTickets();
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Unable to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <AccountMenu />
      <main className="app-main acct-main">
        <div className="acct-page-header">
          <Link to="/dashboard" className="acct-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
          <div>
            <h1>Helpdesk</h1>
            <p>Create a ticket or browse quick answers.</p>
          </div>
        </div>

        {message && <div className={`acct-alert ${messageType}`}>{message}</div>}

        <div className="helpdesk-grid">
          <section className="acct-section">
            <h3 className="acct-section-title">Create Ticket</h3>
            <form className="acct-form" onSubmit={submitTicket}>
              <label className="help-field">
                Subject
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter ticket subject"
                />
              </label>
              <label className="help-field">
                Complaint
                <textarea
                  rows="6"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="Tell us what happened"
                />
              </label>
              <label className={`help-upload ${screenshot ? 'has-file' : ''}`}>
                <input type="file" accept="image/png,image/jpeg" onChange={handleFile} />
                <span className="help-upload-title">{screenshot ? screenshot.name : 'Attach screenshot'}</span>
                <span className="help-upload-hint">PNG or JPG below 100KB</span>
              </label>
              <button type="submit" className="btn-primary acct-save-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </section>

          <section className="acct-section">
            <h3 className="acct-section-title">Your Recent Tickets</h3>
            {loading ? (
              <div className="dash-loading" style={{ padding: '30px 0' }}><LoadingSpinner size={28} /></div>
            ) : tickets.length ? (
              <div className="help-ticket-list">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="help-ticket-card">
                    <div>
                      <h4>{ticket.subject}</h4>
                      <span>{formatDate(ticket.created_at)}</span>
                    </div>
                    <strong>{ticket.status}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="notification-empty">
                <h3>No tickets yet</h3>
              </div>
            )}
          </section>
        </div>

        <section className="acct-section">
          <h3 className="acct-section-title">FAQs</h3>
          <div className="help-faq-list">
            {FAQS.map((faq, index) => {
              const active = openFaq === index;
              return (
                <button
                  key={faq.question}
                  type="button"
                  className={`help-faq ${active ? 'active' : ''}`}
                  onClick={() => setOpenFaq(active ? null : index)}
                >
                  <span className="help-faq-question">
                    <strong>{faq.question}</strong>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d={active ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
                    </svg>
                  </span>
                  {active && <span className="help-faq-answer">{faq.answer}</span>}
                </button>
              );
            })}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
