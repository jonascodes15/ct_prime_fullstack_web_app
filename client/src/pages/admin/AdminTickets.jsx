import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import './Admin.css';

const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/tickets')
      .then(({ data }) => setTickets(data || []))
      .catch(() => setError('Unable to load support tickets.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="dash-header">
          <div>
            <h1>Support Tickets</h1>
            <p>Review complaints submitted by client users.</p>
          </div>
          <div className="admin-header-meta">
            <span className="admin-count">{tickets.length} total tickets</span>
          </div>
        </div>

        {loading && <div className="dash-loading"><LoadingSpinner size={36} /></div>}
        {error && <div className="admin-alert error">{error}</div>}

        {!loading && !tickets.length && (
          <div className="notification-empty">
            <h3>No tickets yet</h3>
            <p>Submitted helpdesk tickets will appear here.</p>
          </div>
        )}

        <div className="ticket-admin-list">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="ticket-admin-card">
              <div className="ticket-admin-head">
                <div className="kyc-user">
                  <div className="ar-avatar">{ticket.full_name?.[0] || 'U'}</div>
                  <div>
                    <div className="ar-name">{ticket.full_name}</div>
                    <div className="ar-email">{ticket.email}</div>
                  </div>
                </div>
                <div className="kyc-meta">
                  <span className="ar-status status-pending">{ticket.status}</span>
                  <span className="ar-date">{formatDate(ticket.created_at)}</span>
                </div>
              </div>

              <div className="ticket-admin-body">
                <div>
                  <div className="mcb-label">Subject</div>
                  <h3>{ticket.subject}</h3>
                </div>
                <div>
                  <div className="mcb-label">Complaint</div>
                  <p>{ticket.complaint}</p>
                </div>
                {ticket.screenshot_data && ticket.screenshot_mime && (
                  <div>
                    <div className="mcb-label">Screenshot</div>
                    <a
                      className="ticket-screenshot-link"
                      href={`data:${ticket.screenshot_mime};base64,${ticket.screenshot_data}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`data:${ticket.screenshot_mime};base64,${ticket.screenshot_data}`}
                        alt={ticket.screenshot_name || 'Ticket screenshot'}
                      />
                      <span>{ticket.screenshot_name || 'View screenshot'}</span>
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
