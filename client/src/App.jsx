import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import About from './pages/About';
import Markets from './pages/Markets';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdrawal from './pages/Withdrawal';
import TraderActivation from './pages/TraderActivation';
import NotFound from './pages/NotFound';
import NewsFeed from './pages/NewsFeed';
import LiveMarkets from './pages/LiveMarkets';
import AccountSettings from './pages/account/AccountSettings';
import KYCPage from './pages/account/KYCPage';
import ReferralPage from './pages/account/ReferralPage';

import AdminOverview from './pages/admin/AdminOverview';
import AdminMembers from './pages/admin/AdminMembers';
import AdminKYC from './pages/admin/AdminKYC';
import AdminDeposits from './pages/admin/AdminDeposits';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminTraders from './pages/admin/AdminTraders';
import AdminWallets from './pages/admin/AdminWallets';
import NotificationsPage from './pages/account/Notifications';
import VerificationPage from './pages/VerificationPage';
import './index.css';

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

function ClientRoute({ children }) {
  const { isAuth, user } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuth, user } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuth, user } = useAuth();
  if (!isAuth) return children;
  return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/verify" element={<GuestRoute><VerificationPage /></GuestRoute>} />

          {/* Client only */}
          <Route path="/activate-trader" element={<ClientRoute><TraderActivation /></ClientRoute>} />
          <Route path="/dashboard" element={<ClientRoute><Dashboard /></ClientRoute>} />
          <Route path="/deposit" element={<ClientRoute><Deposit /></ClientRoute>} />
          <Route path="/withdrawal" element={<ClientRoute><Withdrawal /></ClientRoute>} />
          <Route path="/news" element={<ClientRoute><NewsFeed /></ClientRoute>} />
          <Route path="/live-markets" element={<ClientRoute><LiveMarkets /></ClientRoute>} />
          <Route path="/account/settings" element={<ClientRoute><AccountSettings /></ClientRoute>} />
          <Route path="/account/kyc" element={<ClientRoute><KYCPage /></ClientRoute>} />
          <Route path="/account/notifications" element={<ClientRoute><NotificationsPage /></ClientRoute>} />
          <Route path="/account/referral" element={<ClientRoute><ReferralPage /></ClientRoute>} />

          {/* Admin only */}
          <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminMembers /></AdminRoute>} />
          <Route path="/admin/kyc" element={<AdminRoute><AdminKYC /></AdminRoute>} />
          <Route path="/admin/deposits" element={<AdminRoute><AdminDeposits /></AdminRoute>} />
          <Route path="/admin/withdrawals" element={<AdminRoute><AdminWithdrawals /></AdminRoute>} />
          <Route path="/admin/traders" element={<AdminRoute><AdminTraders /></AdminRoute>} />
          <Route path="/admin/wallets" element={<AdminRoute><AdminWallets /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
