import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import BottomNav from '../../components/common/BottomNav';
import AccountMenu from '../../components/common/AccountMenu';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import './Account.css';

const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [marking, setMarking] = useState(null);

    useEffect(() => {
        api.get('/account/notifications')
            .then(({ data }) => setNotifications(data || []))
            .catch(() => setError('Unable to load notifications.'))
            .finally(() => setLoading(false));
    }, []);

    const markRead = async (id) => {
        setMarking(id);
        try {
            await api.patch(`/account/notifications/${id}/read`);
            setNotifications((prev) => prev.map((note) => note.id === id ? { ...note, is_read: 1 } : note));
        } catch {
            setError('Failed to mark notification read.');
        } finally {
            setMarking(null);
        }
    };

    const unreadCount = notifications.filter((note) => !note.is_read).length;

    return (
        <div className="app-layout">
            <Sidebar />
            <AccountMenu />
            <main className="app-main acct-main">
                <div className="acct-page-header">
                    <div>
                        <h1>Notifications</h1>

                    </div>
                    <div className="notifications-header-meta">
                        <span>{unreadCount} unread</span>
                        <span>{notifications.length} total</span>
                    </div>
                </div>

                {loading && (
                    <div className="dash-loading"><LoadingSpinner size={32} /></div>
                )}

                {error && <div className="acct-alert error">{error}</div>}

                {!loading && !notifications.length && (
                    <div className="notification-empty">
                        <h3>No notifications yet</h3>
                    </div>
                )}

                <div className="notifications-list">
                    {notifications.map((note) => (
                        <div key={note.id} className={`notification-card ${note.is_read ? 'read' : 'unread'}`}>
                            <div className="notification-card-header">
                                <div>
                                    <h3>{note.subject}</h3>
                                    <span className="notification-date">{formatDate(note.created_at)}</span>
                                </div>
                                <span className={`notification-badge ${note.is_read ? 'read' : 'unread'}`}>
                                    {note.is_read ? 'Read' : 'Unread'}
                                </span>
                            </div>
                            <p className="notification-body">{note.body}</p>
                            {!note.is_read && (
                                <div className="notification-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => markRead(note.id)}
                                        disabled={marking === note.id}
                                    >
                                        {marking === note.id ? 'Marking…' : 'Mark as read'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
