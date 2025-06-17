import { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import auth from '../firebase/firebase.config';
import axios from 'axios';
import Swal from 'sweetalert2';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register
  const register = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem('token'); // ✅ Token remove
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      console.log("User:", currentUser); // ✅ দেখো কি আসে
  
      setUser(currentUser);
  
      if (currentUser?.email) {
        const userData = { email: currentUser.email };
        axios.post("https://volunteerhub-server.vercel.app/jwt", userData)
          .then(res => {
            console.log("JWT Response:", res.data); // ✅ Must include token
            localStorage.setItem("token", res.data.token);
          })
          .catch(error => console.log("JWT error:", error))
          .finally(() => setLoading(false));
      } else {
        console.log("No user, skipping JWT");
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const authInfo = {
    user,
    loading,
    register,
    login,
    googleLogin,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
