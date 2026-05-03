import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import axios from 'axios';
import {
  clearSession,
  getAuthProvider,
  getBranches,
  getCurrentUser,
  getToken,
  saveSession,
  getRefreshToken
} from '../api/session.js';

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // MongoDB data (branches, roles)
  const isRegistering = useRef(false);

  const login = async (email, password) => {
    // Production-friendly: support BOTH legacy (Mongo/JWT) and Firebase auth.
    // 1) Try backend login first (works for all Mongo users, including pre-Firebase accounts).
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        identifier: email,
        password
      });
      const payload = response.data;
      setUserData(payload);
      saveSession(payload.token, payload.user, payload.branches, 'backend', payload.refreshToken);
      return payload;
    } catch (err) {
      // Only fall back to Firebase if it's an auth failure; otherwise rethrow.
      const status = err?.response?.status;
      if (status && status !== 401) throw err;
    }

    // 2) Firebase login (email/password or Google) + backend session hydration via firebase-login.
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const response = await axios.post(`${API_BASE_URL}/api/auth/firebase-login`, { idToken });
    const payload = { ...response.data, token: idToken };
    setUserData(payload);
    saveSession(idToken, payload.user, payload.branches, 'firebase');
    return payload;
  };

  const register = async (email, password, extraData) => {
    try {
      isRegistering.current = true;
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await firebaseUser.getIdToken();
      
      // Create staff/user in MongoDB via our API
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        ...extraData,
        email,
        password, // Added this field
        firebaseUid: firebaseUser.uid
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      const payload = { ...response.data, token: idToken };
      setUserData(payload);
      saveSession(idToken, payload.user, payload.branches, 'firebase');
      return payload;
    } finally {
      isRegistering.current = false;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const idToken = await userCredential.user.getIdToken();
    const response = await axios.post(`${API_BASE_URL}/api/auth/firebase-login`, { idToken });
    const payload = { ...response.data, token: idToken };
    setUserData(payload);
    saveSession(idToken, payload.user, payload.branches, 'firebase');
    return payload;
  };

  const logout = async () => {
    clearSession();
    setUserData(null);
    return signOut(auth);
  };

  const resetPassword = async (email) => {
    // Support both reset systems:
    // - Firebase reset email for Firebase users
    // - Backend reset link for legacy Mongo-only users
    try {
      await sendPasswordResetEmail(auth, email);
      return { ok: true, provider: 'firebase' };
    } catch (firebaseErr) {
      const code = firebaseErr?.code || '';
      // If Firebase doesn't know this user (or Firebase isn't available), fall back to backend.
      if (code && code !== 'auth/user-not-found' && code !== 'auth/invalid-email') {
        // Some other Firebase error (e.g., network) - still allow backend fallback.
        // eslint-disable-next-line no-console
        console.warn('[Auth] Firebase reset failed, falling back to backend:', code);
      }
      const resp = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      return { ok: true, provider: 'backend', data: resp.data };
    }
  };

  const setupRecaptcha = (containerId) => {
    if (!containerId) return null;
    if (window.recaptchaVerifier) return window.recaptchaVerifier;

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
      return window.recaptchaVerifier;
    } catch (err) {
      console.error('[Auth] Recaptcha setup failed:', err);
      return null;
    }
  };

  const signInWithPhone = async (phoneNumber, verifier) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      return confirmationResult;
    } catch (err) {
      console.error('[Auth] Phone sign-in failed:', err);
      throw err;
    }
  };

  const verifyOtp = async (confirmationResult, code) => {
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      const idToken = await user.getIdToken();
      const response = await axios.post(`${API_BASE_URL}/api/auth/firebase-login`, { idToken });
      const payload = { ...response.data, token: idToken };
      
      setUserData(payload);
      saveSession(idToken, payload.user, payload.branches, 'firebase');
      
      return payload;
    } catch (err) {
      console.error('[Auth] OTP verification failed:', err);
      throw err;
    }
  };

  useEffect(() => {
    // 1. Initial check: Try to restore session from localStorage for legacy users or fast-boot
    const restoreSession = () => {
      const token = getToken();
      const user = getCurrentUser();
      const branches = getBranches();
      const provider = getAuthProvider();

      if (token && user) {
        setUserData({ user, branches, token });
        // Only stop loading if it's NOT a firebase session. 
        // Firebase sessions must wait for the onAuthStateChanged listener to verify/refresh.
        if (provider !== 'firebase') {
          setLoading(false);
        }
      } else {
        // No session at all, we can stop loading (unless we expect a firebase redirect/sync)
        if (provider !== 'firebase') {
          setLoading(false);
        }
      }
    };

    restoreSession();

    // 2. Firebase Listener: Keeps Firebase state in sync
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user && !isRegistering.current) {
        try {
          const idToken = await user.getIdToken();
          // Auto-sync session with backend on reload
          const response = await axios.post(`${API_BASE_URL}/api/auth/firebase-login`, { idToken });
          const payload = { ...response.data, token: idToken };
          setUserData(payload);
          // Sync with localStorage for the API client
          saveSession(idToken, payload.user, payload.branches, 'firebase');
        } catch (err) {
          console.error('[AuthContext] Session sync failed:', err);
          if (getAuthProvider() === 'firebase') {
            clearSession();
            setUserData(null);
          }
        }
      } else if (!user && !getToken()) {
        setUserData(null);
      }
      
      // Always stop loading after the first firebase auth event
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    setupRecaptcha,
    signInWithPhone,
    verifyOtp,
    isAuthenticated: !!userData?.token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
