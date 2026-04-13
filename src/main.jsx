import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import './customcss/table.css';
import './customcss/form.css';
import App from './App.jsx';
import { ThemeProvider } from './components/ThemeContext.jsx';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
