import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import WaiterApp from './pages/WaiterApp.jsx';
import KitchenDashboard from './pages/KitchenDashboard.jsx';
import GuestTablePage from './pages/GuestTablePage.jsx';
import { getCurrentUser } from './api/session.js';

const ProtectedRoute = ({ children, roles }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/guest/:tableId" element={<GuestTablePage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/waiter"
      element={
        <ProtectedRoute roles={['waiter', 'admin']}>
          <WaiterApp />
        </ProtectedRoute>
      }
    />
    <Route
      path="/kitchen"
      element={
        <ProtectedRoute roles={['kitchen', 'admin']}>
          <KitchenDashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
