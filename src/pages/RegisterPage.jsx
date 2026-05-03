import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Mail, Lock, Phone, User, Store, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import "../common/css/Login.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, userData } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && userData) {
      const role = userData?.user?.role?.toLowerCase();
      navigate(role === 'superadmin' || role === 'admin' ? "/admin" : "/");
    }
  }, [isAuthenticated, userData, navigate]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cafeName: "",
    branchName: ""
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        setError("Please fill in all personal details");
        triggerShake();
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        triggerShake();
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.cafeName) {
      setError("Please provide your Cafe Name");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const extraData = {
        name: formData.name,
        phone: formData.phone,
        cafeName: formData.cafeName,
        branchName: formData.branchName || formData.cafeName,
        role: 'admin'
      };

      const data = await register(formData.email, formData.password, extraData);
      
      // Success Redirect
      const role = data.user?.role?.toLowerCase() || 'admin';
      navigate(role === 'superadmin' || role === 'admin' ? "/admin" : "/");
      
    } catch (err) {
      console.error("Registration error:", err);
      let msg = err.response?.data?.message || err.message || "Registration failed";
      
      if (msg.includes("auth/email-already-in-use")) {
        msg = "This email is already registered. Please go back to the login page.";
      }
      
      setError(msg);
      triggerShake();
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
        className="login-card-v2"
        style={{ maxWidth: '460px' }}
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
          <p className="subtitle">
            {step === 1 ? "Create your owner account" : "Set up your restaurant empire"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator" style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ 
              flex: 1, 
              height: '4px', 
              borderRadius: '2px', 
              background: step >= i ? 'var(--primary-gradient)' : 'var(--slate-200)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleRegister}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="input-group-v2">
                  <User size={18} className="icon" />
                  <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="input-group-v2">
                  <Mail size={18} className="icon" />
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group-v2">
                  <Phone size={18} className="icon" />
                  <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="input-group-v2">
                  <Lock size={18} className="icon" />
                  <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} required />
                </div>
                
                <button type="button" className="submit-btn" onClick={nextStep} style={{ marginTop: '12px' }}>
                  Next Details <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="input-group-v2">
                  <Store size={18} className="icon" />
                  <input name="cafeName" placeholder="Restaurant Name" value={formData.cafeName} onChange={handleChange} required />
                </div>
                <div className="input-group-v2">
                  <Store size={18} className="icon" style={{ opacity: 0.5 }} />
                  <input name="branchName" placeholder="Branch Name (Optional)" value={formData.branchName} onChange={handleChange} />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" className="google-btn" style={{ flex: 1 }} onClick={() => setStep(1)} disabled={loading}>
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="submit" className="submit-btn" style={{ flex: 2 }} disabled={loading}>
                    {loading ? <Loader2 className="spinner" size={20} /> : (
                      <>Complete Setup <CheckCircle2 size={18} /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="footer-note">
          Already have an account? <Link to="/login"><span>Login here</span></Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
