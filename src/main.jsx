import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import './customcss/table.css';
import './customcss/form.css';

// Admin Core Styles
import './common/css/admin/common/adminLayout.css';
import './common/css/admin/common/adminResponsive.css';
import './common/css/admin/sidebar/adminSidebar.css';

// Admin Section Styles
import './common/css/admin/orders/kotCards.css';
import './common/css/admin/orders/kotTicketCard.css';
import './common/css/admin/orders/recentOrderCard.css';
import './common/css/admin/orders/orderDetail.css';
import './common/css/admin/orders/Additemsmodal.css';
import './common/css/admin/orders/AdminDeliveryOrderModal.css';
import './common/css/admin/orders/CustomizeDishModal.css';
import './common/css/admin/orders/MenuSection.css';
import './common/css/admin/orders/OrdersHeader.css';
import './common/css/admin/tables/tables.css';
import './common/css/admin/users/users.css';
import App from './App.jsx';
import { ThemeProvider } from './components/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));

      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }
    } catch (error) {
      console.error('Failed to reset stale caches:', error);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
