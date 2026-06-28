import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import './Admin.css';

const STATUS_LABELS = {
    pending: 'Pending Review',
    approved: 'Verified',
    rejected: 'Rejected',
};

const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function AdminKYC() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('pending');
    const [actionLoading, setActionLoading] = useState(null);
    const [notes, setNotes] = useState({});
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('all');
    const [broadcastSubject, setBroadcastSubject] = useState('');
    const [broadcastBody, setBroadcastBody] = useState('');
    const [broadcastLoading, setBroadcastLoading] = useState(false);
    const [broadcastMessage, setBroadcastMessage] = useState('');

    useEffect(() => {
        api.get('/admin/kyc-submissions')
            .then(({ data }) => setSubmissions(data || []))
            .catch(() => setError('Failed to load KYC submissions.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        api.get('/admin/users')
            .then(({ data }) => setUsers((data || []).filter((item) => item.role === 'client')))
            .catch(() => setUsers([]));
    }, []);

    const handleStatusUpdate = async (submissionId, status) => {
        setActionLoading(submissionId);
        try {
            const admin_note = notes[submissionId] || '';
            await api.patch(`/admin/kyc-submissions/${submissionId}`, { status, admin_note });
            setSubmissions((prev) => prev.map((item) => (
                item.id === submissionId ? { ...item, status, admin_note, reviewed_at: new Date().toISOString() } : item
            )));
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to update submission.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleBroadcast = async () => {
        if (!broadcastSubject.trim() || !broadcastBody.trim()) {
            return setBroadcastMessage('Subject and message body are required.');
        }
        setBroadcastLoading(true);
        setBroadcastMessage('');
        try {
            await api.post('/admin/notifications/broadcast', {
                subject: broadcastSubject,
                body: broadcastBody,
                user_id: selectedUserId === 'all' ? undefined : selectedUserId,
            });
            setBroadcastMessage(selectedUserId === 'all' ? 'Broadcast sent successfully.' : 'Message sent to selected user.');
            setBroadcastSubject('');
            setBroadcastBody('');
            setSelectedUserId('all');
        } catch (err) {
            setBroadcastMessage(err.response?.data?.message || 'Failed to send broadcast.');
        } finally {
            setBroadcastLoading(false);
        }
    };

    const filtered = submissions.filter((item) => filter === 'all' ? true : item.status === filter);
    const counts = submissions.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="app-main">
                <div className="dash-header">
                    <div>
                        <h1>KYC Submissions</h1>
                        <p>Review pending identity verification requests and notify users immediately.</p>
                    </div>
                </div>

                {error && <div className="admin-alert error">{error}</div>}

                <div className="broadcast-card">
                    <div className="broadcast-card-header">
                        <div>
                            <h2>Broadcast Message</h2>
                            <p>Send an announcement, promotion, or account message to clients.</p>
                        </div>
                    </div>
                    {broadcastMessage && <div className="admin-alert success">{broadcastMessage}</div>}
                    <div className="broadcast-form-grid">
                        <label>
                            Recipient
                            <select
                                className="broadcast-field"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                <option value="all">All users</option>
                                {users.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.full_name} - {client.email}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Subject
                            <input
                                type="text"
                                className="broadcast-field"
                                value={broadcastSubject}
                                onChange={(e) => setBroadcastSubject(e.target.value)}
                                placeholder="Enter broadcast subject"
                            />
                        </label>
                        <label>
                            Message
                            <textarea
                                className="broadcast-field"
                                rows="4"
                                value={broadcastBody}
                                onChange={(e) => setBroadcastBody(e.target.value)}
                                placeholder={selectedUserId === 'all' ? 'Enter the message for all users' : 'Enter the message for this user'}
                            />
                        </label>
                        <div className="broadcast-actions">
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleBroadcast}
                                disabled={broadcastLoading}
                            >
                                {broadcastLoading ? 'Sending...' : selectedUserId === 'all' ? 'Send Broadcast' : 'Send Message'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="admin-filter-tabs">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            type="button"
                            className={`filter-tab ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' ? 'All' : STATUS_LABELS[status]}
                            <span className="filter-count">{status === 'all' ? submissions.length : counts[status] || 0}</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="dash-loading"><LoadingSpinner size={36} /></div>
                ) : (
                    <div className="kyc-list">
                        {filtered.length === 0 ? (
                            <div className="notification-empty">
                                <h3>No matching submissions</h3>
                                <p>Try another filter or wait for new user submissions.</p>
                            </div>
                        ) : filtered.map((submission) => (
                            <div key={submission.id} className="kyc-card">
                                <div className="kyc-card-row">
                                    <div className="kyc-user">
                                        <div className="ar-avatar">{submission.full_name?.[0] || 'U'}</div>
                                        <div>
                                            <div className="ar-name">{submission.full_name}</div>
                                            <div className="ar-email">{submission.email}</div>
                                        </div>
                                    </div>
                                    <div className="kyc-meta">
                                        <span className={`ar-status ${submission.status}`}>{STATUS_LABELS[submission.status]}</span>
                                        <span className="ar-date">Submitted {formatDate(submission.submitted_at)}</span>
                                        {submission.reviewed_at && <span className="ar-date">Reviewed {formatDate(submission.reviewed_at)}</span>}
                                    </div>
                                </div>

                                <div className="kyc-details-grid">
                                    <div>
                                        <div className="mcb-label">Document</div>
                                        <div className="ar-hash">{submission.document_name || 'Not provided'}</div>
                                    </div>
                                    <div>
                                        <div className="mcb-label">Admin Note</div>
                                        <div className="ar-hash">{submission.admin_note || 'None'}</div>
                                    </div>
                                </div>

                                {submission.status === 'pending' ? (
                                    <div className="kyc-actions">
                                        <textarea
                                            className="kyc-note-area"
                                            rows="3"
                                            placeholder="Add a review note (optional)"
                                            value={notes[submission.id] || ''}
                                            onChange={(e) => setNotes((prev) => ({ ...prev, [submission.id]: e.target.value }))}
                                        />
                                        <div className="kyc-button-group">
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                                                disabled={actionLoading === submission.id}
                                            >
                                                Reject
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-primary"
                                                onClick={() => handleStatusUpdate(submission.id, 'approved')}
                                                disabled={actionLoading === submission.id}
                                            >
                                                {actionLoading === submission.id ? 'Saving…' : 'Approve'}
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
