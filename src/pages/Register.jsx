import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash, FaHandsHelping, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthProvider';
import Swal from 'sweetalert2';
import { updateProfile } from 'firebase/auth';

const Register = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, googleLogin, updateUserRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value; // 'volunteer' | 'organizer' | 'admin'

    // Password validation
    if (!/[A-Z]/.test(password)) {
      setLoading(false);
      return setError("Password must include at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      setLoading(false);
      return setError("Password must include at least one lowercase letter");
    }
    if (password.length < 6) {
      setLoading(false);
      return setError("Password must be at least 6 characters long");
    }
    if (!/[0-9]/.test(password)) {
      setLoading(false);
      return setError("Password must include at least one number");
    }
    if (password !== confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    try {
      const result = await register(email, password);
      await updateProfile(result.user, { displayName: name });
      // store role locally for demo; ideally save to DB
      localStorage.setItem(`role:${email}`, role);
      updateUserRole(role);

      // Upsert user in DB with selected role
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
            name,
            email,
            role,
          })
        });
      } catch (e) {
        console.error('User upsert during registration failed:', e);
      }

      await Swal.fire({
        title: 'Welcome!',
        text: 'Your account has been created successfully',
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
      navigate('/');
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      setError(errorMessage);
      Swal.fire({
        title: 'Registration Failed',
        text: errorMessage,
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

  const handleSocialRegister = async () => {
    setLoading(true);
    try {
      await googleLogin();
      await Swal.fire({
        title: 'Welcome!',
        text: 'Successfully registered with Google',
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
      navigate('/');
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: 'Google Registration Failed',
        text: err.message || 'Please try again or use email registration',
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

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-300 dark:bg-gray-600';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Enter password';
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return 'Enter password';
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
            className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-center overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/50 to-teal-600/50"></div>
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
              <h1 className="text-3xl font-bold text-white mb-2">Join Our Community</h1>
              <p className="text-green-100 text-lg">Create your account and start making a difference</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={itemVariants}
            className="p-8 space-y-6"
          >
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Full Name Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </motion.div>

              {/* Removed Photo URL field; avatar derives from email */}

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </motion.div>

              {/* Role Field - REMOVED - All users are volunteers by default */}

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white"
                    onChange={(e) => checkPasswordStrength(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                    />
                  </div>
                  <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 font-medium">
                    {getPasswordStrengthText()}
                  </p>
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-4 rounded-xl border-2 transition-all duration-300 dark:bg-gray-700/50 dark:text-white ${
                      confirmPassword && passwordStrength > 0
                        ? confirmPassword === document.querySelector('input[name="password"]')?.value
                          ? 'border-green-500 focus:ring-green-500/20'
                          : 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-green-500 focus:ring-green-500/20'
                    } dark:border-gray-600`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {confirmPassword && passwordStrength > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 text-sm flex items-center ${
                      confirmPassword === document.querySelector('input[name="password"]')?.value
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full mr-2 ${
                      confirmPassword === document.querySelector('input[name="password"]')?.value
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}></span>
                    {confirmPassword === document.querySelector('input[name="password"]')?.value
                      ? 'Passwords match'
                      : 'Passwords do not match'
                    }
                  </motion.p>
                )}
              </motion.div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}

              {/* Register Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
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
                  Or register with
                </span>
              </div>
            </motion.div>

            {/* Google Sign Up */}
            <motion.button
              variants={itemVariants}
              onClick={handleSocialRegister}
              disabled={loading}
              className={`w-full flex items-center justify-center py-4 px-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
            >
              <FaGoogle className="text-red-500 mr-3" size={20} />
              Continue with Google
            </motion.button>

            {/* Sign In Link */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                >
                  Sign in here
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
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;