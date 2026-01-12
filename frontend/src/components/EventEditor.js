import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import './EventEditor.css';

const EventEditor = ({ eventId, onClose, onSave }) => {
  const { events, updateEvents } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    category: 'conference',
    status: 'upcoming',
    registrationUrl: '',
    program: [''],
    speakers: [''],
    price: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    'conference',
    'workshop',
    'summit',
    'expo',
    'forum',
    'symposium',
    'demo'
  ];

  useEffect(() => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setFormData({
          ...event,
          program: event.program || [''],
          speakers: event.speakers || ['']
        });
      }
    }
  }, [eventId, events]);

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

  const handleProgramChange = (index, value) => {
    const newProgram = [...formData.program];
    newProgram[index] = value;
    setFormData(prev => ({
      ...prev,
      program: newProgram
    }));
  };

  const addProgramItem = () => {
    setFormData(prev => ({
      ...prev,
      program: [...prev.program, '']
    }));
  };

  const removeProgramItem = (index) => {
    if (formData.program.length > 1) {
      const newProgram = formData.program.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        program: newProgram
      }));
    }
  };

  const handleSpeakerChange = (index, value) => {
    const newSpeakers = [...formData.speakers];
    newSpeakers[index] = value;
    setFormData(prev => ({
      ...prev,
      speakers: newSpeakers
    }));
  };

  const addSpeaker = () => {
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, '']
    }));
  };

  const removeSpeaker = (index) => {
    if (formData.speakers.length > 1) {
      const newSpeakers = formData.speakers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        speakers: newSpeakers
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    } else {
      // Check if date is in the future
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        newErrors.date = 'Event date must be in the future';
      }
    }
    
    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    
    if (formData.registrationUrl && !isValidUrl(formData.registrationUrl)) {
      newErrors.registrationUrl = 'Please enter a valid registration URL';
    }
    
    return newErrors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedEvents = [...events];
      
      // Filter out empty program items and speakers
      const cleanedProgram = formData.program.filter(item => item.trim() !== '');
      const cleanedSpeakers = formData.speakers.filter(speaker => speaker.trim() !== '');
      
      const eventData = {
        ...formData,
        program: cleanedProgram,
        speakers: cleanedSpeakers
      };
      
      if (eventId) {
        // Edit existing event
        const index = updatedEvents.findIndex(e => e.id === eventId);
        if (index !== -1) {
          updatedEvents[index] = { ...eventData, id: eventId };
        }
      } else {
        // Create new event
        const newEvent = {
          ...eventData,
          id: Date.now()
        };
        updatedEvents.push(newEvent);
      }
      
      updateEvents(updatedEvents);
      onSave && onSave();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-editor-overlay">
      <motion.div 
        className="event-editor-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="event-editor-header">
          <div className="header-left">
            <h2>{eventId ? 'Edit Event' : 'Create New Event'}</h2>
            <span className="event-date">{formData.date || 'No date set'}</span>
          </div>
          <div className="header-right">
            <button 
              type="button"
              className={`preview-btn ${previewMode ? 'active' : ''}`}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button 
              type="button" 
              className="close-btn"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="event-editor-content">
          {!previewMode ? (
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Event Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title..."
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Event Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.date ? 'error' : ''}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    className={errors.time ? 'error' : ''}
                  />
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Event location..."
                    className={errors.location ? 'error' : ''}
                  />
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Pricing</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., $299 Professional / $199 Student"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="image">Featured Image URL</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    className={errors.image ? 'error' : ''}
                  />
                  {errors.image && <span className="error-message">{errors.image}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="registrationUrl">Registration URL</label>
                  <input
                    type="url"
                    id="registrationUrl"
                    name="registrationUrl"
                    value={formData.registrationUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/register"
                    className={errors.registrationUrl ? 'error' : ''}
                  />
                  {errors.registrationUrl && <span className="error-message">{errors.registrationUrl}</span>}
                </div>
              </div>

              {formData.image && isValidUrl(formData.image) && (
                <div className="image-preview">
                  <img src={formData.image} alt="Event Preview" />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Event description..."
                  rows="4"
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              {/* Program Section */}
              <div className="program-section">
                <div className="section-header">
                  <label>Event Program</label>
                  <button 
                    type="button" 
                    className="add-item-btn"
                    onClick={addProgramItem}
                  >
                    + Add Program Item
                  </button>
                </div>
                
                <div className="program-inputs">
                  {formData.program.map((item, index) => (
                    <div key={index} className="program-input-row">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleProgramChange(index, e.target.value)}
                        placeholder={`Program item ${index + 1} (e.g., 9:00 AM - Registration & Welcome)`}
                        className="program-input"
                      />
                      {formData.program.length > 1 && (
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeProgramItem(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers Section */}
              <div className="speakers-section">
                <div className="section-header">
                  <label>Featured Speakers</label>
                  <button 
                    type="button" 
                    className="add-item-btn"
                    onClick={addSpeaker}
                  >
                    + Add Speaker
                  </button>
                </div>
                
                <div className="speakers-inputs">
                  {formData.speakers.map((speaker, index) => (
                    <div key={index} className="speaker-input-row">
                      <input
                        type="text"
                        value={speaker}
                        onChange={(e) => handleSpeakerChange(index, e.target.value)}
                        placeholder={`Speaker ${index + 1} name...`}
                        className="speaker-input"
                      />
                      {formData.speakers.length > 1 && (
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeSpeaker(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (eventId ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </form>
          ) : (
            <div className="event-preview">
              <div className="preview-header">
                <h1>{formData.title || 'Event Title'}</h1>
                <div className="preview-meta">
                  <span>📅 {formData.date}</span>
                  <span>🕐 {formData.time}</span>
                  <span>📍 {formData.location}</span>
                  <span className="category-badge">{formData.category}</span>
                </div>
              </div>
              
              {formData.image && (
                <div className="preview-image">
                  <img src={formData.image} alt={formData.title} />
                </div>
              )}
              
              <div className="preview-description">
                <p>{formData.description}</p>
              </div>
              
              {formData.program.filter(item => item).length > 0 && (
                <div className="preview-program">
                  <h3>📋 Event Program</h3>
                  <ul>
                    {formData.program.filter(item => item).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {formData.speakers.filter(speaker => speaker).length > 0 && (
                <div className="preview-speakers">
                  <h3>🎤 Featured Speakers</h3>
                  <p>{formData.speakers.filter(speaker => speaker).join(', ')}</p>
                </div>
              )}
              
              {formData.price && (
                <div className="preview-pricing">
                  <h3>💰 Pricing</h3>
                  <p>{formData.price}</p>
                </div>
              )}
              
              {formData.registrationUrl && (
                <div className="preview-registration">
                  <a 
                    href={formData.registrationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="register-btn"
                  >
                    Register Now
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EventEditor;