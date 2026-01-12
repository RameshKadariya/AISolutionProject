import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="toggle-track">
        <motion.div
          className="toggle-thumb"
          animate={{
            x: isDarkMode ? 0 : 24,
            rotate: isDarkMode ? 0 : 180
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          <motion.div
            className="toggle-icon"
            animate={{
              rotate: isDarkMode ? 0 : 180,
              scale: isDarkMode ? 1 : 0.8
            }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </motion.div>
        </motion.div>
      </div>
      
      <motion.span 
        className="toggle-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isDarkMode ? 'Dark' : 'Light'}
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;