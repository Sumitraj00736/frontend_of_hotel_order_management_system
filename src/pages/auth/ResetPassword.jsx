import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        token,
        password
      });

      setMessage(response.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-slate-50 p-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="card border-0 shadow-xl overflow-hidden" style={{ width: '100%', maxWidth: '450px', borderRadius: '24px' }}>
        <div className="p-5">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle shadow-lg mb-4" style={{ width: '64px', height: '64px' }}>
              <Lock size={32} />
            </div>
            <h2 className="fw-bold text-slate-900 mb-2" style={{ fontSize: '1.75rem' }}>Reset Password</h2>
            <p className="text-muted">Enter your new secure password below.</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-4 d-flex align-items-center gap-2 mb-4">
              <div className="bg-danger text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                <span style={{ fontSize: '12px' }}>×</span>
              </div>
              {error}
            </div>
          )}

          {message ? (
            <div className="text-center py-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-4" style={{ width: '48px', height: '48px' }}>
                <CheckCircle2 size={24} />
              </div>
              <p className="text-slate-700 fw-medium mb-4">{message}</p>
              <p className="text-muted small">Redirecting you to login in a few seconds...</p>
              <Link to="/login" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm py-3 mt-2">
                Go to Login Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-slate-700 fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>New Password</label>
                <div className="position-relative">
                  <span className="position-absolute translate-middle-y top-50 start-0 ps-3 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    className="form-control form-control-lg border-2 shadow-none rounded-4 ps-5 py-3"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-slate-700 fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>Confirm Password</label>
                <div className="position-relative">
                  <span className="position-absolute translate-middle-y top-50 start-0 ps-3 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    className="form-control form-control-lg border-2 shadow-none rounded-4 ps-5 py-3"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ borderColor: '#e2e8f0', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-lg py-3 d-flex align-items-center justify-content-center gap-2 mb-4 hover-lift"
                style={{ transition: 'all 0.2s' }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Reset Password'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-decoration-none text-slate-600 font-medium d-inline-flex align-items-center gap-2 hover-text-primary transition-colors">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <style>{`
        .hover-lift:hover { transform: translateY(-2px); }
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-400 { color: #94a3b8; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ResetPassword;
