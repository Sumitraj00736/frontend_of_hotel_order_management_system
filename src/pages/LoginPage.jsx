import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { saveSession, setBranchId } from '../api/session.js';
import '../common/css/admin/common/adminLayout.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | register
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cafeName, setCafeName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        const res = await api.post('/api/auth/login', { identifier, password });
        const branches = res.data.branches || [];
        saveSession(res.data.token, res.data.user, branches);
        if (branches.length === 1) setBranchId(branches[0].branchId || branches[0]._id);
        if (branches.length > 1) setBranchId(branches[branches.length - 1].branchId || branches[branches.length - 1]._id);
        if (res.data.user.role === 'admin') navigate('/admin');
        if (res.data.user.role === 'waiter') navigate('/waiter');
        if (res.data.user.role === 'kitchen') navigate('/kitchen');
      } else {
        const res = await api.post('/api/auth/register', {
          name,
          email: identifier,
          password,
          cafeName,
          branchName
        });
        const branches = res.data.branches || [];
        saveSession(res.data.token, res.data.user, branches);
        if (branches.length === 1) setBranchId(branches[0].branchId || branches[0]._id);
        if (branches.length > 1) setBranchId(branches[branches.length - 1].branchId || branches[branches.length - 1]._id);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="admin-shell">
      <div className="card glass-card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <div className="d-flex gap-2 mb-3">
          <button className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setMode('login')}>
            Already have an account
          </button>
          <button className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setMode('register')}>
            New cafe (register)
          </button>
        </div>
        <h2 className="mb-2">{mode === 'login' ? 'Sign in' : 'Create your cafe'}</h2>
        <p className="text-muted">{mode === 'login' ? 'Access your existing cafe' : 'Create a new cafe/branch with admin access'}</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Cafe / Restaurant Name</label>
                <input className="form-control" value={cafeName} onChange={(e) => setCafeName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Branch Name (optional)</label>
                <input className="form-control" value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="Main Branch" />
              </div>
            </>
          )}
          <div className="mb-3">
            <label className="form-label">{mode === 'login' ? 'Email or Phone' : 'Email'}</label>
            <input
              className="form-control"
              placeholder="admin@example.com or 9800000001"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary w-100" type="submit">
            {mode === 'login' ? 'Login' : 'Create cafe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
