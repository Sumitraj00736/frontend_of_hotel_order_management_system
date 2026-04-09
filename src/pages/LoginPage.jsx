import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/client.js";
import { saveSession, setBranchId } from "../api/session.js";
import "../common/css/Login.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [identifier, setIdentifier] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [cafeName, setCafeName] = useState("");
  const [branchName, setBranchName] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await api.post("/api/auth/login", {
          identifier: identifier.trim(),
          password,
        });

        const { token, user, branches = [] } = res.data;

        saveSession(token, user, branches);

        if (branches.length > 0) {
          setBranchId(branches[0].branchId);
        }

        const role = user?.role?.toLowerCase();
        navigate(roleRedirectMap[role] || "/");
      } else {
        const res = await api.post("/api/auth/register", {
          name,
          email: identifier,
          phone,
          password,
          cafeName,
          branchName: branchName || "Main Branch",
        });

        const { token, user, branches = [] } = res.data;

        saveSession(token, user, branches);

        if (branches.length > 0) {
          setBranchId(branches[0].branchId);
        }

        const role = (branches?.[0]?.role || user.role || "").toLowerCase();
        navigate(roleRedirectMap[role] || "/");
      }
    } catch (err) {
      const payload = err.response?.data;
      console.error("Auth error:", payload || err);

      triggerShake();

      // ✅ Proper error handling
      if (payload?.errors?.length) {
        setError(payload.errors[0].message);
      } else {
        setError(
          mode === "login"
            ? // console.log('Login error details:', payload)
              payload?.message || "Invalid email or password"
            : payload?.message || "Registration failed",
        );
      }
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
          x: shake ? [-10, 10, -6, 6, 0] : 0,
        }}
        transition={{ duration: 0.4, type: "spring" }}
        className={`login-card ${error ? "error" : ""}`}
      >
        {/* Logo */}
        <div className="logo-box">🍽️</div>

        {/* Branding */}
        <h2 className="brand">MeroRestro</h2>
        <p className="subtitle">
          {mode === "login"
            ? "Sign in to manage your restaurant"
            : "Create and launch your restaurant"}
        </p>

        {/* Toggle */}
        <div className="toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Register
          </button>
        </div>

        {error && <div className="error-text">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* REGISTER ONLY */}
          {mode === "register" && (
            <>
              <input
                className="input"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="input"
                placeholder="Cafe Name"
                value={cafeName}
                onChange={(e) => setCafeName(e.target.value)}
                required
              />
              <input
                className="input"
                placeholder="Branch (optional)"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            </>
          )}

          {/* LOGIN vs REGISTER FIELD */}
          {mode === "login" ? (
            <input
              className="input"
              placeholder="Email or Phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          ) : (
            <>
              <input
                className="input"
                placeholder="Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <input
                className="input"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
          )}

          {/* PASSWORD */}
          <div className="password-box">
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : mode === "login"
                ? "Login"
                : "Create Cafe"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
