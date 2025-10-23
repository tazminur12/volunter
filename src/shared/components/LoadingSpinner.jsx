import React from 'react';
import { motion } from 'framer-motion';
import { FaHandsHelping } from 'react-icons/fa';

const LoadingSpinner = ({ 
  size = 'md', 
  type = 'spinner', 
  text = 'Loading...',
  showText = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotsVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                variants={dotsVariants}
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className={`w-2 h-2 bg-primary rounded-full ${sizeClasses[size]}`}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className={`${sizeClasses[size]} bg-gradient-to-r from-primary to-secondary rounded-full`}
          />
        );

      case 'brand':
        return (
          <div className="relative">
            <motion.div
              variants={spinnerVariants}
              animate="animate"
              className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaHandsHelping className={`${sizeClasses[size]} text-primary`} />
            </div>
          </div>
        );

      case 'bars':
        return (
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                animate={{
                  height: [20, 40, 20],
                  transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeInOut"
                  }
                }}
                className={`w-1 bg-gradient-to-t from-primary to-secondary rounded-full ${sizeClasses[size]}`}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className="relative">
            <motion.div
              variants={spinnerVariants}
              animate="animate"
              className={`${sizeClasses[size]} border-4 border-transparent border-t-primary border-r-secondary rounded-full`}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={`absolute inset-1 border-2 border-transparent border-b-accent rounded-full`}
            />
          </div>
        );

      default: // spinner
        return (
          <motion.div
            variants={spinnerVariants}
            animate="animate"
            className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full`}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {renderSpinner()}
      {showText && text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-gray-600 dark:text-gray-400 font-medium ${textSizes[size]}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Full Page Loading Component
export const FullPageLoader = ({ text = 'Loading VolunteerHub...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          type="brand" 
          size="xl" 
          text={text}
          className="mb-8"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 dark:text-gray-400"
        >
          <p className="text-lg font-medium">Connecting to our community...</p>
          <p className="text-sm mt-2">Please wait while we load the latest opportunities</p>
        </motion.div>
      </div>
    </div>
  );
};

// Inline Loading Component
export const InlineLoader = ({ text = 'Loading...', size = 'sm' }) => {
  return (
    <LoadingSpinner 
      type="dots" 
      size={size} 
      text={text}
      className="py-4"
    />
  );
};

// Button Loading Component
export const ButtonLoader = ({ size = 'sm' }) => {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner 
        type="spinner" 
        size={size} 
        showText={false}
      />
      <span>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
  