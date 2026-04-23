import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import WaiterApp from './pages/WaiterApp.jsx';
import KitchenDashboard from './pages/KitchenDashboard.jsx';
import GuestTablePage from './pages/GuestTablePage.jsx';
import PublicCafePage from './pages/PublicCafePage.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { userData, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles) {
    const userRole = userData?.user?.role || '';
    const normalized = String(userRole).toLowerCase();
    const allowed = roles.map((r) => String(r || '').toLowerCase());
    if (!allowed.includes(normalized)) return <Navigate to="/login" />;
  }
  return children;
};

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/guest/:tableId" element={<GuestTablePage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/waiter"
      element={
        <ProtectedRoute roles={['waiter', 'admin', 'superadmin']}>
          <WaiterApp />
        </ProtectedRoute>
      }
    />
    <Route
      path="/kitchen"
      element={
        <ProtectedRoute roles={['kitchen', 'admin', 'superadmin', 'waiter']}>
          <KitchenDashboard />
        </ProtectedRoute>
      }
    />
    <Route path="/:cafeSlug/table/:tableId" element={<PublicCafePage />} />
    <Route path="/:cafeSlug" element={<PublicCafePage />} />
  </Routes>
);

export default App;
