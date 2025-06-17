import { useContext, useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { FaUserCircle, FaHandsHelping } from 'react-icons/fa';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import { MdOutlineLightMode, MdDarkMode } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logOut()
      .then(() => localStorage.removeItem('token'))
      .catch(err => console.error('Logout error:', err));
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const navLinks = (
    <>
      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? 'text-primary font-medium bg-primary/10 rounded-lg px-4 py-2' : 
            'hover:text-primary hover:bg-base-200/30 rounded-lg px-4 py-2'
          }
          end
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/all-posts" 
          className={({ isActive }) => 
            isActive ? 'text-secondary font-medium bg-secondary/10 rounded-lg px-4 py-2' : 
            'hover:text-secondary hover:bg-base-200/30 rounded-lg px-4 py-2'
          }
        >
          Volunteer Needs
        </NavLink>
      </li>

      {user && (
        <li className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="px-4 py-2 w-full text-left hover:text-accent hover:bg-base-200/30 rounded-lg transition-all duration-200 flex justify-between items-center"
            aria-expanded={profileOpen}
            aria-label="Profile menu"
          >
            My Profile
            <motion.span
              animate={{ rotate: profileOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`overflow-hidden ${mobileMenuOpen ? 'ml-4' : 'absolute left-0 top-full mt-1 z-50 w-52'} bg-base-100 border border-base-200 rounded-box shadow-lg`}
              >
                <li>
                  <NavLink
                    to="/add-post"
                    onClick={() => {
                      setProfileOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-4 py-2 ${
                        isActive
                          ? 'text-accent bg-accent/10'
                          : 'hover:text-accent hover:bg-base-200/30'
                      }`
                    }
                  >
                    Add Volunteer Need
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/manage-posts"
                    onClick={() => {
                      setProfileOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-4 py-2 ${
                        isActive
                          ? 'text-accent bg-accent/10'
                          : 'hover:text-accent hover:bg-base-200/30'
                      }`
                    }
                  >
                    Manage My Posts
                  </NavLink>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`navbar sticky top-0 z-40 px-4 md:px-8 transition-all duration-300 ${
        scrolled ? 'bg-base-100/95 backdrop-blur-md shadow-lg' : 'bg-base-100 shadow-sm'
      }`}
    >
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <button
            type="button"
            className="btn btn-ghost lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="menu menu-sm mt-3 z-[60] p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200 fixed top-16 left-4"
                onClick={(e) => {
                  if (!e.target.closest('li.relative')) {
                    setMobileMenuOpen(false);
                  }
                }}
              >
                {navLinks}
                {!user && (
                  <>
                    <li>
                      <Link 
                        to="/login" 
                        className="px-4 py-2 hover:text-primary hover:bg-base-200/30"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/register" 
                        className="px-4 py-2 hover:text-secondary hover:bg-base-200/30"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="flex items-center gap-2"
          >
            <FaHandsHelping className="text-primary text-3xl" />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              VolunteerHub
            </span>
          </motion.div>
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">{navLinks}</ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end gap-2">
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={toggleTheme} 
          className="btn btn-circle btn-ghost hover:bg-base-200/30" 
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <MdOutlineLightMode className="text-xl text-warning" />
          ) : (
            <MdDarkMode className="text-xl text-info" />
          )}
        </motion.button>

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="w-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5"
              >
                <div className="bg-base-100 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User avatar'} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <FaUserCircle className="w-7 h-7 text-primary" />
                  )}
                </div>
              </motion.div>
            </label>
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
            >
              <li className="px-4 py-2 border-b border-base-200">
                <div className="font-medium truncate">{user.displayName || 'User'}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 text-error hover:bg-error/10 hover:text-error transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link 
              to="/login" 
              className="btn btn-outline btn-sm md:btn-md gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
            >
              <FiLogIn className="text-lg" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/register" 
                className="btn btn-primary btn-sm md:btn-md text-white gap-2 hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                <FiUserPlus className="text-lg" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;