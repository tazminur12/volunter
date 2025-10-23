import { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import auth from '../../core/config/firebase/firebase.config';

import Swal from 'sweetalert2';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

// Role storage utilities
const ROLE_STORAGE_KEY = 'volunteer_app_role';
const ROLE_TIMESTAMP_KEY = 'volunteer_app_role_timestamp';
const ROLE_REFRESH_THRESHOLD = 30 * 60 * 1000; // 30 minutes in milliseconds

const getStoredRole = () => {
  try {
    const roleData = localStorage.getItem(ROLE_STORAGE_KEY);
    const timestamp = localStorage.getItem(ROLE_TIMESTAMP_KEY);
    
    if (!roleData || !timestamp) return null;
    
    const age = Date.now() - parseInt(timestamp);
    if (age > ROLE_REFRESH_THRESHOLD) {
      // Role is too old, remove it
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(ROLE_TIMESTAMP_KEY);
      return null;
    }
    
    return roleData;
  } catch (error) {
    return null;
  }
};

const setStoredRole = (role) => {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    localStorage.setItem(ROLE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    // Silently handle error
  }
};

const clearStoredRole = () => {
  try {
    localStorage.removeItem(ROLE_STORAGE_KEY);
    localStorage.removeItem(ROLE_TIMESTAMP_KEY);
  } catch (error) {
    // Silently handle error
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

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
    localStorage.removeItem('token');
    clearStoredRole(); // Clear stored role on logout
    return signOut(auth);
  };

  // Fetch user role from server - DISABLED since endpoint doesn't exist
  const fetchUserRole = async (userEmail, token) => {
    // Return default role since backend endpoint doesn't exist
    return 'volunteer';
  };

  // Manual role refresh function - DISABLED to prevent role changes
  // const refreshUserRole = async () => {
  //   if (!user?.email) return;
  //   
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) return;
  //     
  //     const freshRole = await fetchUserRole(user.email, token);
  //     
  //     if (freshRole && freshRole !== role) {
  //       setRole(freshRole);
  //       setStoredRole(freshRole);
  //     }
  //   } catch (error) {
  //     // Silently handle errors
  //   }
  // };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        try {
          // Check if we have a valid stored role
          const storedRole = getStoredRole();
          
          if (storedRole) {
            // Use stored role immediately - NEVER CHANGE IT
            setRole(storedRole);
            setRoleLoading(false);
          } else {
            // No stored role, set default role
            setRoleLoading(true);
            const defaultRole = 'volunteer';
            setRole(defaultRole);
            setStoredRole(defaultRole); // LOCK THIS ROLE FOREVER
            setRoleLoading(false);
          }
        } catch (error) {
          setRoleLoading(false);
        }
      } else {
        setRole(null);
        setRoleLoading(false);
        clearStoredRole();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Update user role - ONLY WAY TO CHANGE ROLE
  const updateUserRole = (nextRole) => {
    setRole(nextRole);
    setStoredRole(nextRole);
  };

  const authInfo = {
    user,
    loading,
    role,
    roleLoading,
    register,
    login,
    googleLogin,
    logOut,
    updateUserRole,
    // refreshUserRole, // DISABLED to prevent role changes
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
