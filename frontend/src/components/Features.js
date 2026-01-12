import React from 'react';
import { motion } from 'framer-motion';
import './Features.css';

const featureData = [
  {
    id: 1,
    icon: '🤖',
    title: 'AI-Powered Virtual Assistant',
    description: 'Our intelligent virtual assistant responds to user inquiries and provides real-time solutions to enhance the digital employee experience.'
  },
  {
    id: 2,
    icon: '💡',
    title: 'Rapid Prototyping',
    description: 'Affordable AI-based prototyping solutions that speed up design, engineering, and innovation processes.'
  },
  {
    id: 3,
    icon: '📊',
    title: 'Proactive Issue Resolution',
    description: 'Identify and address potential issues before they impact the digital employee experience.'
  },
  {
    id: 4,
    icon: '🔄',
    title: 'Continuous Innovation',
    description: 'Stay ahead with our constantly evolving AI solutions that adapt to your business needs.'
  }
];

const Features = () => {
  return (
    <section id="solutions" className="features-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Our Solutions
      </motion.h2>
      
      <div className="features-container">
        {featureData.map((feature) => (
          <motion.div
            key={feature.id}
            className="feature-card"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: feature.id * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(255, 153, 0, 0.3)' }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;