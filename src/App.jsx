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

// Admin sub-pages
import AdminOverview from './components/admin/dashboard/AdminOverview.jsx';
import AdminOrders from './components/admin/orders/views/AdminOrders.jsx';
import AdminUsers from './components/admin/users/AdminUsers.jsx';
import AdminCustomers from './components/admin/customers/AdminCustomers.jsx';
import Table from './components/admin/tableAndSpace/Tables/Table.jsx';
import Space from './components/admin/tableAndSpace/Spaces/Space.jsx';
import AdminQrCodes from './components/admin/tables/AdminQrCodes.jsx';
import AdminMenus from './components/admin/menu/AdminMenus.jsx';
import AdminCategories from './components/admin/menu/AdminCategories.jsx';
import AdminDishes from './components/admin/menu/AdminDishes.jsx';
import AdminAddOns from './components/admin/menu/AdminAddOns.jsx';
import AdminSubMenus from './components/admin/menu/AdminSubMenus.jsx';
import AdminCombos from './components/admin/menu/AdminCombos.jsx';
import AdminReports from './components/admin/reports/AdminReports.jsx';
import AdminHistory from './components/admin/history/AdminHistory.jsx';
import AdminPromotionTimeline from './components/admin/promotions/AdminPromotionTimeline.jsx';
import AdminInventory from './components/admin/inventory/AdminInventory.jsx';
import AdminFinance from './components/admin/finance/AdminFinance.jsx';
import AdminWebsite from './components/admin/website/AdminWebsite.jsx';
import AdminSettings from './components/admin/settings/AdminSettings.jsx';
import NotificationPage from './components/admin/notifications/NotificationPage.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { userData, isAuthenticated } = useAuth();
  
  // Use a direct check to ensure the token exists in storage
  const hasToken = !!localStorage.getItem('hotel_token');

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/login" />;
  }

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
    {/* Public Routes */}
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
    <Route path="/guest/:tableId" element={<GuestTablePage />} />
    <Route path="/:cafeSlug/table/:tableId" element={<PublicCafePage />} />
    <Route path="/:cafeSlug" element={<PublicCafePage />} />

    {/* Admin Routes - Main Dashboard */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/orders"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/customers"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/tables"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/tables/table"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/tables/space"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/tables/qr"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/menus"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/menus/categories"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/menus/dishes"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/menus/addons"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/menus/submenus"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/menus/combos"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reports"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reports/company"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reports/sales"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reports/items"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reports/staff"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reports/customer"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/history"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/promotions"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/inventory"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/inventory/ingredients"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/inventory/purchases"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/inventory/suppliers"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/finance"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/finance/daybook"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/finance/sales"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/finance/purchase"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/finance/transactions"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/website"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings/restaurant-details"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings/branches"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings/roles"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings/permissions"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings/taxes"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings/payment-methods"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings/printers"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings/webhooks"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/notifications"
      element={
        <ProtectedRoute roles={['admin', 'superadmin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    {/* Waiter Routes */}
    <Route
      path="/waiter"
      element={
        <ProtectedRoute roles={['waiter', 'admin', 'superadmin']}>
          <WaiterApp />
        </ProtectedRoute>
      }
    />

    {/* Kitchen Routes */}
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

export default App;
