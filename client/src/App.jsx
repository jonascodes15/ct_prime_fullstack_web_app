import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home               from './pages/Home';
import About              from './pages/About';
import Markets            from './pages/Markets';
import Login              from './pages/Login';
import Register           from './pages/Register';
import VerificationPage   from './pages/VerificationPage';
import Dashboard          from './pages/Dashboard';
import Deposit            from './pages/Deposit';
import Withdrawal         from './pages/Withdrawal';
import TraderActivation   from './pages/TraderActivation';
import NotFound           from './pages/NotFound';

import AdminOverview      from './pages/admin/AdminOverview';
import AdminMembers       from './pages/admin/AdminMembers';
import AdminDeposits      from './pages/admin/AdminDeposits';
import AdminWithdrawals   from './pages/admin/AdminWithdrawals';
import AdminTraders       from './pages/admin/AdminTraders';
import AdminWallets       from './pages/admin/AdminWallets';

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
          <Route path="/"        element={<Home />} />
          <Route path="/about"   element={<About />} />
          <Route path="/markets" element={<Markets />} />

          {/* Guest only */}
          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Verification — accessible without auth (user has token but not logged in yet) */}
          <Route path="/verify" element={<VerificationPage />} />

          {/* Client only */}
          <Route path="/activate-trader" element={<ClientRoute><TraderActivation /></ClientRoute>} />
          <Route path="/dashboard"       element={<ClientRoute><Dashboard /></ClientRoute>} />
          <Route path="/deposit"         element={<ClientRoute><Deposit /></ClientRoute>} />
          <Route path="/withdrawal"      element={<ClientRoute><Withdrawal /></ClientRoute>} />

          {/* Admin only */}
          <Route path="/admin"                element={<AdminRoute><AdminOverview /></AdminRoute>} />
          <Route path="/admin/users"          element={<AdminRoute><AdminMembers /></AdminRoute>} />
          <Route path="/admin/deposits"       element={<AdminRoute><AdminDeposits /></AdminRoute>} />
          <Route path="/admin/withdrawals"    element={<AdminRoute><AdminWithdrawals /></AdminRoute>} />
          <Route path="/admin/traders"        element={<AdminRoute><AdminTraders /></AdminRoute>} />
          <Route path="/admin/wallets"        element={<AdminRoute><AdminWallets /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
