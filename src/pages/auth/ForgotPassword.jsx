import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions');
    } catch (err) {
      setError('Failed to reset password. Please check your email address.');
      console.error(err);
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
              <Mail size={32} />
            </div>
            <h2 className="fw-bold text-slate-900 mb-2" style={{ fontSize: '1.75rem' }}>Forgot Password?</h2>
            <p className="text-muted">Enter your email and we'll send you instructions to reset your password.</p>
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
              <Link to="/login" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm py-3">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-slate-700 fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>Email Address</label>
                <div className="position-relative">
                  <span className="position-absolute translate-middle-y top-50 start-0 ps-3 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-control form-control-lg border-2 shadow-none rounded-4 ps-5 py-3"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Instructions'}
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
        .bg-slate-50 { background-color: #f8fafc; }
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

export default ForgotPassword;
