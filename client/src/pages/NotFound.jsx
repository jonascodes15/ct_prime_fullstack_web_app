import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-bg">
        <div className="auth-grid" />
        <div className="auth-orb auth-orb-1" />
      </div>
      <div className="notfound-inner">
        <div className="notfound-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-actions">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/dashboard" className="btn-outline">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
