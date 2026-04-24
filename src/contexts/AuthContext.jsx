import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import axios from 'axios';

const AuthContext = createContext();

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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        identifier: email,
        password
      });
      const payload = response.data;
      setUserData(payload);
      const { saveSession } = await import('../api/session.js');
      saveSession(payload.token, payload.user, payload.branches);
      return payload;
    } catch (err) {
      // Only fall back to Firebase if it's an auth failure; otherwise rethrow.
      const status = err?.response?.status;
      if (status && status !== 401) throw err;
    }

    // 2) Firebase login (email/password or Google) + backend session hydration via firebase-login.
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/firebase-login`, { idToken });
    const payload = { ...response.data, token: idToken };
    setUserData(payload);
    const { saveSession } = await import('../api/session.js');
    saveSession(idToken, payload.user, payload.branches);
    return payload;
  };

  const register = async (email, password, extraData) => {
    try {
      isRegistering.current = true;
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await firebaseUser.getIdToken();
      
      // Create staff/user in MongoDB via our API
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        ...extraData,
        email,
        password, // Added this field
        firebaseUid: firebaseUser.uid
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      const payload = { ...response.data, token: idToken };
      setUserData(payload);
      return payload;
    } finally {
      isRegistering.current = false;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const idToken = await userCredential.user.getIdToken();
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/firebase-login`, { idToken });
    const payload = { ...response.data, token: idToken };
    setUserData(payload);
    return payload;
  };

  const logout = async () => {
    const { clearSession } = await import('../api/session.js');
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
      const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      return { ok: true, provider: 'backend', data: resp.data };
    }
  };

  useEffect(() => {
    // 1. Initial check: Try to restore session from localStorage for legacy users or fast-boot
    const restoreSession = async () => {
      const { getToken, getCurrentUser, getBranches } = await import('../api/session.js');
      const token = getToken();
      const user = getCurrentUser();
      const branches = getBranches();

      if (token && user) {
        setUserData({ user, branches, token });
      }
      setLoading(false);
    };

    restoreSession();

    // 2. Firebase Listener: Keeps Firebase state in sync
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Prevent auto-login race condition during registration
      if (user && !isRegistering.current) {
        try {
          const idToken = await user.getIdToken();
          // Auto-sync session with backend on reload
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/firebase-login`, { idToken });
          const payload = { ...response.data, token: idToken };
          setUserData(payload);
          // Sync with localStorage for the API client
          const { saveSession } = await import('../api/session.js');
          saveSession(idToken, payload.user, payload.branches);
        } catch (err) {
          console.error('[AuthContext] Session sync failed:', err);
          // Only clear if it was meant to be a firebase session
          if (user) setUserData(null);
        }
      } else if (!user && !localStorage.getItem('hotel_token')) {
        // Only clear if there's no legacy token either
        setUserData(null);
      }
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
    isAuthenticated: !!userData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
