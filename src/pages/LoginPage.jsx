import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { saveSession, setBranchId } from '../api/session.js';
import '../common/css/Login.css'; // ✅ CSS FILE

const LoginPage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [cafeName, setCafeName] = useState('');
  const [branchName, setBranchName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.post('/api/auth/login', {
          identifier: identifier.trim().toLowerCase(),
          password
        });

        const { token, user, branches = [] } = res.data;

        saveSession(token, user, branches);

        if (branches.length > 0) {
          setBranchId(branches[0].branchId);
        }

        const role = branches?.[0]?.role;

        if (role === 'admin' || role === 'superadmin') navigate('/admin');
        else if (role === 'waiter') navigate('/waiter');
        else if (role === 'kitchen') navigate('/kitchen');
        else navigate('/');
      } else {
        const res = await api.post('/api/auth/register', {
          name,
          email: identifier,
          password,
          cafeName,
          branchName: branchName || 'Main Branch'
        });

        const { token, user, branch, organization } = res.data;

        const branches = [{
          branchId: branch.id,
          branchName: branch.name,
          code: branch.code,
          orgName: organization.name,
          orgSlug: organization.slug,
          role: 'superadmin',
          permissions: []
        }];

        saveSession(token, user, branches);
        setBranchId(branches[0].branchId);

        navigate('/admin');
      }
    } catch (err) {
      const payload = err.response?.data;
      triggerShake();
      setError(payload?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shake ? [-10, 10, -6, 6, 0] : 0
        }}
        transition={{ duration: 0.4, type: 'spring' }}
        className={`login-card ${error ? 'error' : ''}`}
      >

        {/* Logo */}
        <div className="logo-box">🍽️</div>

        {/* Branding */}
        <h2 className="brand">MeroRestro</h2>
        <p className="subtitle">
          {mode === 'login'
            ? 'Sign in to manage your restaurant'
            : 'Create and launch your restaurant'}
        </p>

        {/* Toggle */}
        <div className="toggle">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {error && <div className="error-text">{error}</div>}

        <form onSubmit={handleSubmit}>

          {mode === 'register' && (
            <>
              <input className="input" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="input" placeholder="Cafe Name" value={cafeName} onChange={(e) => setCafeName(e.target.value)} required />
              <input className="input" placeholder="Branch (optional)" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
            </>
          )}

          <input
            className="input"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <div className="password-box">
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Cafe'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;