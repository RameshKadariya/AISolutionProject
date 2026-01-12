import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    serviceUsed: '',
    overallRating: 0,
    recommendation: 0,
    feedback: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState({});

  const services = [
    'AI Analytics Solutions',
    'Automation Systems',
    'Computer Vision',
    'NLP Solutions',
    'Custom AI Development',
    'AI Consulting',
    'Other'
  ];

  const ratingCategories = [
    { key: 'overallRating', label: 'Overall Experience', icon: '⭐' },
    { key: 'recommendation', label: 'Would you recommend us?', icon: '👍' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingClick = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      [category]: rating
    }));
    
    if (errors[category]) {
      setErrors(prev => ({
        ...prev,
        [category]: ''
      }));
    }
  };

  const handleRatingHover = (category, rating) => {
    setHoveredRating(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleRatingLeave = (category) => {
    setHoveredRating(prev => ({
      ...prev,
      [category]: 0
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.serviceUsed) {
      newErrors.serviceUsed = 'Please select a service';
    }
    
    if (formData.overallRating === 0) {
      newErrors.overallRating = 'Overall rating is required';
    }
    
    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Try to submit to backend first
        let backendSuccess = false;
        try {
          const response = await fetch('http://localhost:5000/api/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            await response.json();
            backendSuccess = true;
          }
        } catch (backendError) {
          console.log('Backend not available, saving locally');
        }

        // Always save locally as backup/demo system
        const existingFeedback = JSON.parse(localStorage.getItem('ai-solution-feedback') || '[]');
        const nextId = existingFeedback.length > 0 ? Math.max(...existingFeedback.map(f => f.id)) + 1 : 1;
        
        const newFeedback = {
          id: nextId,
          ...formData,
          date: new Date().toISOString(),
          status: 'New'
        };

        existingFeedback.push(newFeedback);
        localStorage.setItem('ai-solution-feedback', JSON.stringify(existingFeedback));

        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          serviceUsed: '',
          overallRating: 0,
          recommendation: 0,
          feedback: ''
        });
        
        setSubmitSuccess(true);
        
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);

        console.log('Feedback saved successfully:', backendSuccess ? 'Backend + Local' : 'Local only');
        
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('There was an error submitting your feedback. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStarRating = (category, currentRating) => {
    const displayRating = hoveredRating[category] || currentRating;
    
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star ${star <= displayRating ? 'filled' : ''}`}
            onClick={() => handleRatingClick(category, star)}
            onMouseEnter={() => handleRatingHover(category, star)}
            onMouseLeave={() => handleRatingLeave(category)}
          >
            ⭐
          </button>
        ))}
        <span className="rating-text">
          {displayRating > 0 && (
            <>
              {displayRating}/5 
              {displayRating === 5 && ' - Excellent!'}
              {displayRating === 4 && ' - Very Good'}
              {displayRating === 3 && ' - Good'}
              {displayRating === 2 && ' - Fair'}
              {displayRating === 1 && ' - Poor'}
            </>
          )}
        </span>
      </div>
    );
  };

  return (
    <section id="feedback" className={`feedback-section ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="feedback-container">
        <motion.div
          className="feedback-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>💬 Share Your Feedback</h2>
          <p>Help us improve our AI solutions by sharing your experience</p>
        </motion.div>

        <motion.div
          className="feedback-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {submitSuccess ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Thank You for Your Feedback!</h3>
              <p>Your feedback has been submitted successfully. We appreciate your input and will use it to improve our services.</p>
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="form-section">
                <h3>📋 Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Your full name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="your.email@company.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="serviceUsed">Service Used *</label>
                    <select
                      id="serviceUsed"
                      name="serviceUsed"
                      value={formData.serviceUsed}
                      onChange={handleInputChange}
                      className={errors.serviceUsed ? 'error' : ''}
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                    {errors.serviceUsed && <span className="error-message">{errors.serviceUsed}</span>}
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="form-section">
                <h3>⭐ Rate Your Experience</h3>
                <div className="compact-ratings">
                  {ratingCategories.map(category => (
                    <div key={category.key} className="rating-row">
                      <label className="rating-label">
                        <span className="rating-icon">{category.icon}</span>
                        {category.label} {category.key === 'overallRating' && '*'}
                      </label>
                      {renderStarRating(category.key, formData[category.key])}
                      {errors[category.key] && <span className="error-message">{errors[category.key]}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="form-section">
                <h3>💭 Your Feedback</h3>
                <div className="form-group">
                  <label htmlFor="feedback">Tell us about your experience *</label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    className={errors.feedback ? 'error' : ''}
                    placeholder="What did you like? What could be improved? Share your thoughts..."
                    rows="4"
                  />
                  {errors.feedback && <span className="error-message">{errors.feedback}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">📤</span>
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FeedbackForm;