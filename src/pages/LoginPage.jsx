import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext.jsx";
import { saveSession, setBranchId } from "../api/session.js";
import { Mail, Lock, Phone, User, Store, Eye, EyeOff, Loader2 } from "lucide-react";
import "../common/css/Login.css";

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" />
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const roleRedirectMap = {
    superadmin: "/admin",
    admin: "/admin",
    waiter: "/waiter",
    kitchen: "/kitchen",
  };

  const finalizeLogin = (data) => {
    const { user, branches = [], token } = data;
    saveSession(token, user, branches);

    if (branches.length > 0) {
      setBranchId(branches[0].branchId);
    }

    const role = user?.role?.toLowerCase();
    navigate(roleRedirectMap[role] || "/");
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await loginWithGoogle();
      finalizeLogin(data);
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.response?.data?.message || "Google login failed");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(identifier.trim(), password);
      finalizeLogin(data);
    } catch (err) {
      console.error("Auth error:", err);
      triggerShake();
      const message = err.response?.data?.message || err.message || "Invalid credentials";
      setError(message === "auth/invalid-credential" ? "Invalid email or password" : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: shake ? [-10, 10, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
        className="login-card-v2"
      >
        <div className="login-header">
          <div className="logo-box" style={{ 
            background: 'var(--primary-orange)', 
            color: 'white', 
            fontWeight: '900',
            fontSize: '36px',
            border: '4px solid rgba(255,255,255,0.1)'
          }}>M</div>
          <h2 className="brand">MeroRestro</h2>
          <p className="subtitle">Welcome back to your kitchen</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-v2">
            <Mail size={18} className="icon" />
            <input 
              placeholder="Email or Phone" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group-v2">
            <Lock size={18} className="icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading ? <Loader2 size={20} className="spinner" /> : "Login"}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
          <GoogleIcon />
          <span>Google</span>
        </button>

        <p className="footer-note">
          New here? <Link to="/register"><span>Create your account</span></Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

