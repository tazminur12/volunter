import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash, FaHandsHelping } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { AuthContext } from '../../shared/context/AuthProvider';

const Login = () => {
  const { login, googleLogin, updateUserRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Load stored role (demo)
      const storedRole = localStorage.getItem(`role:${email}`) || 'volunteer';
      updateUserRole(storedRole);

      // Ensure user exists in DB with role on login
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        await fetch(`${baseURL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            email,
            role: storedRole,
            lastLogin: new Date().toISOString(),
          })
        });
      } catch (e) {
        console.error('Login upsert failed:', e);
      }
      await Swal.fire({
        title: 'Welcome Back!',
        text: 'Successfully logged in to your account',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        background: '#1f2937',
        color: '#fff',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-2xl font-bold'
        }
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Please check your credentials and try again',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
        background: '#1f2937',
        color: '#fff',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-xl font-bold'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    setLoading(true);
    try {
      const googleRes = await googleLogin();
      // Set default role since backend endpoint doesn't exist
      const gEmail = googleRes?.user?.email;
      updateUserRole('volunteer');

      // Upsert basic user (do not override role)
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        await fetch(`${baseURL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ email: gEmail, lastLogin: new Date().toISOString() })
        });
      } catch (_) {}
      await Swal.fire({
        title: 'Welcome!',
        text: 'Successfully signed in with Google',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        background: '#1f2937',
        color: '#fff',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-2xl font-bold'
        }
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        title: 'Google Sign-in Failed',
        text: error.message || 'Please try again or use email login',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
        background: '#1f2937',
        color: '#fff',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-xl font-bold'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md z-10"
      >
        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-center overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4"
              >
                <FaHandsHelping className="text-3xl text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-blue-100 text-lg">Sign in to continue your journey</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={itemVariants}
            className="p-8 space-y-6"
          >
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white ${
                      emailError 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    onChange={() => setEmailError('')}
                  />
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {emailError}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter your password"
                    className={`w-full px-4 py-4 pr-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white ${
                      passwordError 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    onChange={() => setPasswordError('')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {passwordError}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Login Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </motion.div>

            {/* Google Sign In */}
            <motion.button
              variants={itemVariants}
              onClick={handleSocialLogin}
              disabled={loading}
              className={`w-full flex items-center justify-center py-4 px-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
            >
              <FaGoogle className="text-red-500 mr-3" size={20} />
              Sign in with Google
            </motion.button>

            {/* Sign Up Link */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;