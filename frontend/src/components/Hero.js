import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero-content"
      >
        <h1>Innovate, Promote, and Deliver the Future</h1>
        <p>AI-Solutions leverages AI to proactively address issues that can impact the digital employee experience.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hero-button"
        >
          Learn More
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Hero;