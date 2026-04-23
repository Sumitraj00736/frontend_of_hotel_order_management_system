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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/firebase-login`, { idToken });
    const payload = { ...response.data, token: idToken };
    setUserData(payload);
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

  const logout = () => {
    setUserData(null);
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
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
          setUserData(null);
        }
      } else if (!user) {
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
