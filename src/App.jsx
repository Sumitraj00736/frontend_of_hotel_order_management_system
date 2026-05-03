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
import ResetPassword from './pages/auth/ResetPassword.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { getToken, hasPermission } from './api/session.js';

const ProtectedRoute = ({ children, roles, permissions }) => {
  const { userData, isAuthenticated } = useAuth();
  const hasToken = !!getToken();

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length) {
    const userRole = userData?.user?.role || '';
    const normalizedRole = String(userRole).toLowerCase();
    const allowedRoles = roles.map((role) => String(role || '').toLowerCase());
    if (!allowedRoles.includes(normalizedRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  if (permissions?.length) {
    const allowed = permissions.some((permission) => hasPermission(permission));
    if (!allowed) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

const adminPaths = [
  '/admin',
  '/admin/dashboard',
  '/admin/orders',
  '/admin/orders/delivery',
  '/admin/users',
  '/admin/customers',
  '/admin/tables',
  '/admin/tables/table',
  '/admin/tables/space',
  '/admin/tables/qr',
  '/admin/menus',
  '/admin/menus/categories',
  '/admin/menus/dishes',
  '/admin/menus/addons',
  '/admin/menus/submenus',
  '/admin/menus/combos',
  '/admin/reports',
  '/admin/reports/company',
  '/admin/reports/sales',
  '/admin/reports/items',
  '/admin/reports/staff',
  '/admin/reports/customer',
  '/admin/history',
  '/admin/promotions',
  '/admin/inventory',
  '/admin/inventory/ingredients',
  '/admin/inventory/purchases',
  '/admin/inventory/suppliers',
  '/admin/finance',
  '/admin/finance/daybook',
  '/admin/finance/sales',
  '/admin/finance/purchase',
  '/admin/finance/transactions',
  '/admin/website',
  '/admin/profile',
  '/admin/settings',
  '/admin/settings/restaurant-details',
  '/admin/settings/branches',
  '/admin/settings/roles',
  '/admin/settings/permissions',
  '/admin/settings/taxes',
  '/admin/settings/payment-methods',
  '/admin/settings/printers',
  '/admin/settings/webhooks',
  '/admin/notifications'
];

const App = () => {
  const { userData, isAuthenticated } = useAuth();
  const role = userData?.user?.role?.toLowerCase();

  const adminRouteElement = (
    <ProtectedRoute permissions={['dashboard:view']}>
      <AdminDashboard />
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to={role === 'waiter' ? '/waiter' : (role === 'kitchen' ? '/kitchen' : '/admin')} replace /> 
            : <Navigate to="/login" replace />
        } 
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/guest/:tableId" element={<GuestTablePage />} />
      <Route path="/:cafeSlug/table/:tableId" element={<PublicCafePage />} />
      <Route path="/:cafeSlug" element={<PublicCafePage />} />

      {adminPaths.map((path) => (
        <Route key={path} path={path} element={adminRouteElement} />
      ))}

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
    </Routes>
  );
};

export default App;
