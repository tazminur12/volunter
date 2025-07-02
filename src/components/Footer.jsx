import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhoneAlt, 
  FaEnvelope, FaHandsHelping, FaHeart, FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        duration: 0.5
      }
    }
  };

  const socialLinks = [
    { icon: FaFacebookF, href: '#', color: 'hover:text-blue-600', bgColor: 'bg-blue-600' },
    { icon: FaTwitter, href: '#', color: 'hover:text-blue-400', bgColor: 'bg-blue-400' },
    { icon: FaInstagram, href: '#', color: 'hover:text-pink-600', bgColor: 'bg-pink-600' },
    { icon: FaLinkedin, href: '#', color: 'hover:text-blue-700', bgColor: 'bg-blue-700' },
    { icon: FaYoutube, href: '#', color: 'hover:text-red-600', bgColor: 'bg-red-600' }
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Volunteer Opportunities', href: '/all-posts' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ];



  return (
    <footer className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 text-gray-800 dark:text-gray-200 relative overflow-hidden border-t border-gray-200 dark:border-gray-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-x-32 translate-y-32"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10"
      >
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="relative">
                  <FaHandsHelping className="text-2xl text-primary" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-primary/30 rounded-full"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  VolunteerHub
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Empowering communities through meaningful volunteer opportunities.
              </p>
              
              {/* Social Media Links */}
              <div className="flex gap-2 justify-center md:justify-start">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:${social.bgColor} flex items-center justify-center transition-all duration-300 ${social.color} border border-gray-300 dark:border-gray-600 hover:border-transparent`}
                  >
                    <social.icon className="text-sm" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.slice(0, 4).map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Contact</h3>
              <div className="space-y-2">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors duration-300 text-sm"
                >
                  <FaEnvelope className="text-accent text-sm" />
                  <span>contact@volunteerhub.com</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors duration-300 text-sm"
                >
                  <FaPhoneAlt className="text-accent text-sm" />
                  <span>+1 (555) 123-4567</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>



        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-200 dark:border-gray-700 py-4"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <span>&copy; {year} VolunteerHub. All rights reserved.</span>
                <FaHeart className="text-red-500 animate-pulse" />
              </div>
              
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center text-primary shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Scroll to top"
              >
                <FaArrowUp className="text-sm" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
