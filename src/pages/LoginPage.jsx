import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { saveSession } from '../api/session.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/auth/login', { identifier, password });
      saveSession(res.data.token, res.data.user);
      if (res.data.user.role === 'admin') navigate('/admin');
      if (res.data.user.role === 'waiter') navigate('/waiter');
      if (res.data.user.role === 'kitchen') navigate('/kitchen');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="admin-shell">
      <div className="card glass-card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 className="mb-2">Hotel Order System</h2>
        <p className="text-muted">Sign in to manage tables, orders, and kitchen flow.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email or Phone</label>
            <input
              className="form-control"
              placeholder="admin@example.com or 9800000001"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary w-100" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
