import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Portfolio.css';

const portfolioData = [
  {
    id: 1,
    title: 'AI-Powered Employee Support System',
    category: 'Enterprise',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'Implemented an AI virtual assistant that reduced support ticket volume by 45% and improved employee satisfaction scores.'
  },
  {
    id: 2,
    title: 'Predictive Maintenance Solution',
    category: 'Manufacturing',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'Developed an AI system that predicts equipment failures before they occur, reducing downtime by 60%.'
  },
  {
    id: 3,
    title: 'Automated Customer Service Platform',
    category: 'Retail',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'Created an intelligent customer service platform that handles 80% of routine inquiries without human intervention.'
  },
  {
    id: 4,
    title: 'Healthcare Diagnostic Assistant',
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'Built an AI diagnostic tool that helps medical professionals identify patterns and potential issues in patient data.'
  },
  {
    id: 5,
    title: 'Financial Fraud Detection System',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'Implemented an AI-based fraud detection system that increased fraud prevention by 75% for a major financial institution.'
  },
  {
    id: 6,
    title: 'Smart City Infrastructure Management',
    category: 'Government',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'Developed an AI system to optimize city resource allocation and infrastructure maintenance, reducing costs by 30%.'
  }
];

const categories = ['All', 'Enterprise', 'Manufacturing', 'Retail', 'Healthcare', 'Finance', 'Government'];

const Portfolio = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = filter === 'All' 
    ? portfolioData 
    : portfolioData.filter(project => project.category === filter);

  return (
    <section id="portfolio" className="portfolio-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Our Portfolio
      </motion.h2>
      
      <div className="filter-buttons">
        {categories.map((category, index) => (
          <motion.button
            key={index}
            className={`filter-btn ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
      
      <div className="portfolio-grid">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            className="portfolio-item"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            onClick={() => setSelectedProject(project)}
          >
            <div className="portfolio-image">
              <img src={project.image} alt={project.title} />
              <div className="portfolio-overlay">
                <h3>{project.title}</h3>
                <p>{project.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProject(null)}>×</button>
            <img src={selectedProject.image} alt={selectedProject.title} />
            <h3>{selectedProject.title}</h3>
            <p className="category">{selectedProject.category}</p>
            <p className="description">{selectedProject.description}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;