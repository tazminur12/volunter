import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { FaUserCircle, FaHandsHelping, FaChevronDown, FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import { MdOutlineLightMode, MdDarkMode } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const profileRef = useRef(null);

  // Theme control
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logOut()
      .then(() => localStorage.removeItem('token'))
      .catch(err => console.error('Logout error:', err));
  };

  // Nav link variants for animation
  const navLinkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const navLinks = (
    <>
      <motion.li variants={navLinkVariants}>
        <NavLink 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) => 
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive 
                ? 'text-primary bg-primary/10 border border-primary/20' 
                : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
            }`
          }
        >
          Home
        </NavLink>
      </motion.li>
      <motion.li variants={navLinkVariants}>
        <NavLink 
          to="/all-posts" 
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) => 
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive 
                ? 'text-secondary bg-secondary/10 border border-secondary/20' 
                : 'text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5'
            }`
          }
        >
          Volunteer Needs
        </NavLink>
      </motion.li>
      <motion.li variants={navLinkVariants}>
        <NavLink 
          to="/about" 
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) => 
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive 
                ? 'text-accent bg-accent/10 border border-accent/20' 
                : 'text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-accent/5'
            }`
          }
        >
          About
        </NavLink>
      </motion.li>
      <motion.li variants={navLinkVariants}>
        <NavLink 
          to="/contact" 
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) => 
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive 
                ? 'text-info bg-info/10 border border-info/20' 
                : 'text-gray-700 dark:text-gray-300 hover:text-info hover:bg-info/5'
            }`
          }
        >
          Contact
        </NavLink>
      </motion.li>
      <motion.li variants={navLinkVariants}>
        <NavLink 
          to="/blog" 
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) => 
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive 
                ? 'text-success bg-success/10 border border-success/20' 
                : 'text-gray-700 dark:text-gray-300 hover:text-success hover:bg-success/5'
            }`
          }
        >
          Blog
        </NavLink>
      </motion.li>
    </>
  );

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`navbar fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
        }`}
        style={{ height: '4rem' }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <FaHandsHelping className="text-2xl text-primary" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-primary/20 rounded-full"
                />
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-extrabold">
                VolunteerHub
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex h-full">
            <motion.ul 
              className="menu menu-horizontal px-1 gap-1 h-full items-center"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {navLinks}
              {user && (
                <>
                  <motion.li variants={navLinkVariants}>
                    <NavLink 
                      to="/add-post"
                      className={({ isActive }) => 
                        `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isActive 
                            ? 'text-primary bg-primary/10 border border-primary/20' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                        }`
                      }
                    >
                      Add Need
                    </NavLink>
                  </motion.li>
                  <motion.li variants={navLinkVariants}>
                    <NavLink 
                      to="/manage-posts"
                      className={({ isActive }) => 
                        `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isActive 
                            ? 'text-secondary bg-secondary/10 border border-secondary/20' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5'
                        }`
                      }
                    >
                      Manage Posts
                    </NavLink>
                  </motion.li>
                </>
              )}
            </motion.ul>
          </div>

          {/* Right End Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme} 
              className="btn btn-ghost btn-circle relative overflow-hidden group"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <MdOutlineLightMode className="text-xl text-yellow-500" />
                ) : (
                  <MdDarkMode className="text-xl text-blue-600" />
                )}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Auth buttons */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="btn btn-ghost btn-circle avatar relative group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 relative overflow-hidden">
                    <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      ) : (
                        <FaUserCircle className="w-7 h-7 text-primary" />
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-secondary/5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                            <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                              {user.photoURL ? (
                                <img 
                                  src={user.photoURL} 
                                  alt={user.displayName || 'User'} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <FaUserCircle className="w-8 h-8 text-primary" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <motion.button
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FaUser className="text-primary" />
                          <span>Profile</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FaCog className="text-secondary" />
                          <span>Settings</span>
                        </motion.button>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                        
                        <motion.button
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/login" 
                    className="btn btn-outline btn-sm md:btn-md gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <FiLogIn className="text-lg" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="btn btn-primary btn-sm md:btn-md text-white gap-2 hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <FiUserPlus className="text-lg" />
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile Toggle */}
            <div className="lg:hidden" ref={mobileMenuRef}>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="btn btn-ghost p-2 relative"
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={mobileMenuOpen ? "open" : "closed"}
                  className="flex flex-col gap-1"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 }
                    }}
                    className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full"
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 }
                    }}
                    className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 }
                    }}
                    className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full"
                  />
                </motion.div>
              </motion.button>

              {/* Mobile Menu Drawer */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 top-16 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl p-4 z-[99]"
                  >
                    <motion.div
                      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                      initial="hidden"
                      animate="visible"
                      className="space-y-2"
                    >
                      {navLinks}
                      {user ? (
                        <>
                          <motion.li variants={navLinkVariants}>
                            <NavLink 
                              to="/add-post" 
                              onClick={() => setMobileMenuOpen(false)}
                              className={({ isActive }) => 
                                `block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                                  isActive 
                                    ? 'text-primary bg-primary/10 border border-primary/20' 
                                    : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                                }`
                              }
                            >
                              Add Need
                            </NavLink>
                          </motion.li>
                          <motion.li variants={navLinkVariants}>
                            <NavLink 
                              to="/manage-posts" 
                              onClick={() => setMobileMenuOpen(false)}
                              className={({ isActive }) => 
                                `block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                                  isActive 
                                    ? 'text-secondary bg-secondary/10 border border-secondary/20' 
                                    : 'text-gray-700 dark:text-gray-300 hover:text-secondary hover:bg-secondary/5'
                                }`
                              }
                            >
                              Manage Posts
                            </NavLink>
                          </motion.li>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                          <motion.li variants={navLinkVariants}>
                            <button 
                              onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                              }} 
                              className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                            >
                              <FaSignOutAlt />
                              Logout
                            </button>
                          </motion.li>
                        </>
                      ) : (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                          <motion.li variants={navLinkVariants}>
                            <Link 
                              to="/login" 
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                            >
                              Login
                            </Link>
                          </motion.li>
                          <motion.li variants={navLinkVariants}>
                            <Link 
                              to="/register" 
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300"
                            >
                              Register
                            </Link>
                          </motion.li>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Navbar spacer - prevents content from being hidden behind navbar */}
      <div style={{ height: '4rem' }}></div>
    </>
  );
};

export default Navbar;