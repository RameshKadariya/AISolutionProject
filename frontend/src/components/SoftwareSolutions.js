import React from 'react';
import { motion } from 'framer-motion';
import './SoftwareSolutions.css';

const SoftwareSolutions = () => {
  const solutions = [
    {
      id: 1,
      title: 'AI-Powered Analytics',
      icon: '📊',
      description: 'Our AI analytics platform transforms raw data into actionable insights. Using advanced machine learning algorithms, we help businesses identify patterns, predict trends, and make data-driven decisions.',
      features: [
        'Real-time data processing',
        'Predictive analytics',
        'Custom dashboards',
        'Anomaly detection',
        'Automated reporting'
      ],
      industries: ['Finance', 'Healthcare', 'Retail', 'Manufacturing']
    },
    {
      id: 2,
      title: 'Intelligent Automation',
      icon: '⚙️',
      description: 'Streamline your business processes with our intelligent automation solutions. We combine RPA (Robotic Process Automation) with AI to create systems that learn and adapt to your business needs.',
      features: [
        'Workflow automation',
        'Document processing',
        'Cognitive decision-making',
        'Integration with existing systems',
        'Scalable architecture'
      ],
      industries: ['Insurance', 'Banking', 'Supply Chain', 'Human Resources']
    },
    {
      id: 3,
      title: 'Computer Vision Systems',
      icon: '👁️',
      description: 'Our computer vision solutions enable machines to interpret and understand visual information from the world. From quality control to security systems, we help businesses see more.',
      features: [
        'Object detection and recognition',
        'Image classification',
        'Visual inspection',
        'Facial recognition',
        'Video analytics'
      ],
      industries: ['Security', 'Manufacturing', 'Retail', 'Healthcare']
    },
    {
      id: 4,
      title: 'Natural Language Processing',
      icon: '💬',
      description: 'Our NLP solutions help businesses understand and interact with human language. From chatbots to sentiment analysis, we make communication between humans and machines seamless.',
      features: [
        'Sentiment analysis',
        'Text classification',
        'Named entity recognition',
        'Language translation',
        'Conversational AI'
      ],
      industries: ['Customer Service', 'Marketing', 'Healthcare', 'Legal']
    },
    {
      id: 5,
      title: 'Custom AI Solutions',
      icon: '🧠',
      description: 'We develop bespoke AI solutions tailored to your specific business challenges. Our team of experts works closely with you to understand your needs and create innovative solutions.',
      features: [
        'Personalized consultation',
        'Custom model development',
        'Integration with existing systems',
        'Ongoing support and maintenance',
        'Continuous improvement'
      ],
      industries: ['All Industries']
    }
  ];

  const pastProjects = [
    {
      id: 1,
      title: 'Healthcare Diagnostic Assistant',
      client: 'MediTech Innovations',
      description: 'Developed an AI-powered diagnostic assistant that helps doctors identify potential diseases from patient symptoms and medical history. The system achieved 94% accuracy in preliminary diagnoses.',
      technologies: ['Machine Learning', 'Natural Language Processing', 'Healthcare APIs'],
      outcome: 'Reduced diagnostic time by 35% and improved early detection rates by 28%.'
    },
    {
      id: 2,
      title: 'Retail Inventory Optimization',
      client: 'Global Retail Chain',
      description: 'Created a predictive inventory management system that forecasts demand, optimizes stock levels, and reduces waste for a major retail chain with over 500 locations.',
      technologies: ['Predictive Analytics', 'Computer Vision', 'IoT Integration'],
      outcome: 'Decreased inventory costs by 22% while maintaining 99.5% product availability.'
    },
    {
      id: 3,
      title: 'Financial Fraud Detection System',
      client: 'SecureBank International',
      description: 'Implemented an advanced fraud detection system that analyzes transaction patterns in real-time to identify potentially fraudulent activities before they complete.',
      technologies: ['Deep Learning', 'Anomaly Detection', 'Real-time Processing'],
      outcome: 'Prevented an estimated $4.2M in fraudulent transactions in the first year of deployment.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <section id="solutions" className="solutions-section">
      <div className="solutions-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Our Software Solutions
        </motion.h2>
        
        <motion.p 
          className="solutions-intro"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          We develop cutting-edge AI solutions that transform businesses across industries. 
          Our team of experts combines deep technical knowledge with industry expertise to 
          create innovative software that solves real-world problems.
        </motion.p>

        <motion.div 
          className="solutions-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {solutions.map((solution) => (
            <motion.div 
              key={solution.id} 
              className="solution-card"
              variants={itemVariants}
            >
              <div className="solution-icon">{solution.icon}</div>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
              
              <div className="solution-features">
                <h4>Key Features</h4>
                <ul>
                  {solution.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="solution-industries">
                <h4>Industries</h4>
                <div className="industry-tags">
                  {solution.industries.map((industry, index) => (
                    <span key={index} className="industry-tag">{industry}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="past-projects-title"
        >
          Past Solutions Highlights
        </motion.h2>

        <motion.div 
          className="past-projects-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pastProjects.map((project) => (
            <motion.div 
              key={project.id} 
              className="project-card"
              variants={itemVariants}
            >
              <h3>{project.title}</h3>
              <p className="project-client">Client: {project.client}</p>
              <p className="project-description">{project.description}</p>
              
              <div className="project-technologies">
                <h4>Technologies Used</h4>
                <div className="technology-tags">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="technology-tag">{tech}</span>
                  ))}
                </div>
              </div>
              
              <div className="project-outcome">
                <h4>Outcome</h4>
                <p>{project.outcome}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SoftwareSolutions;