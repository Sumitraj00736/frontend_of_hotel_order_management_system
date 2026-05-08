import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import './customcss/table.css';
import './customcss/form.css';
import App from './App.jsx';
import { ThemeProvider } from './components/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

const APP_CACHE_BUSTER = 'frontend-cache-reset-v2';

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      if (localStorage.getItem(APP_CACHE_BUSTER) !== 'done') {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ('caches' in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        }

        localStorage.setItem(APP_CACHE_BUSTER, 'done');
      }
    } catch (error) {
      console.error('Failed to reset stale caches:', error);
    }
  });
}



if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((reg) => console.log('Firebase SW registered:', reg))
    .catch((err) => console.error('Firebase SW error:', err));
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
