import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import './GalleryEditor.css';

const GalleryEditor = ({ eventId, onClose, onSave }) => {
  const { gallery, updateGallery } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    category: 'promotional',
    status: 'active',
    image: '',
    gallery: ['']
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    'promotional',
    'conference',
    'workshop',
    'exhibition'
  ];

  useEffect(() => {
    if (eventId) {
      const event = gallery.find(e => e.id === eventId);
      if (event) {
        setFormData({
          ...event,
          gallery: event.gallery || ['']
        });
      }
    }
  }, [eventId, gallery]);

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

  const handleGalleryImageChange = (index, value) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData(prev => ({
      ...prev,
      gallery: newGallery
    }));
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }));
  };

  const removeGalleryImage = (index) => {
    if (formData.gallery.length > 1) {
      const newGallery = formData.gallery.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        gallery: newGallery
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    
    // Validate gallery images
    const invalidGalleryImages = formData.gallery.filter(url => url && !isValidUrl(url));
    if (invalidGalleryImages.length > 0) {
      newErrors.gallery = 'Please enter valid URLs for all gallery images';
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
      const updatedGallery = [...gallery];
      
      // Filter out empty gallery URLs
      const cleanedGallery = formData.gallery.filter(url => url.trim() !== '');
      
      const eventData = {
        ...formData,
        gallery: cleanedGallery
      };
      
      if (eventId) {
        // Edit existing event
        const index = updatedGallery.findIndex(e => e.id === eventId);
        if (index !== -1) {
          updatedGallery[index] = { ...eventData, id: eventId };
        }
      } else {
        // Create new event
        const newEvent = {
          ...eventData,
          id: Date.now()
        };
        updatedGallery.push(newEvent);
      }
      
      updateGallery(updatedGallery);
      onSave && onSave();
      onClose();
    } catch (error) {
      console.error('Error saving gallery event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gallery-editor-overlay">
      <motion.div 
        className="gallery-editor-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="gallery-editor-header">
          <div className="header-left">
            <h2>{eventId ? 'Edit Gallery Event' : 'Create New Gallery Event'}</h2>
            <span className="gallery-count">{formData.gallery.filter(url => url).length} images</span>
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
        <div className="gallery-editor-content">
          {!previewMode ? (
            <form onSubmit={handleSubmit} className="gallery-form">
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
                    className={errors.date ? 'error' : ''}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

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
                {formData.image && isValidUrl(formData.image) && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Featured Preview" />
                  </div>
                )}
              </div>

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

              {/* Gallery Images Section */}
              <div className="gallery-images-section">
                <div className="gallery-header">
                  <label>Gallery Images</label>
                  <button 
                    type="button" 
                    className="add-image-btn"
                    onClick={addGalleryImage}
                  >
                    + Add Image
                  </button>
                </div>
                
                {errors.gallery && <span className="error-message">{errors.gallery}</span>}
                
                <div className="gallery-inputs">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="gallery-input-row">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                        placeholder={`Gallery image ${index + 1} URL...`}
                        className="gallery-url-input"
                      />
                      {formData.gallery.length > 1 && (
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeGalleryImage(index)}
                        >
                          ✕
                        </button>
                      )}
                      {url && isValidUrl(url) && (
                        <div className="gallery-image-preview">
                          <img src={url} alt={`Gallery ${index + 1}`} />
                        </div>
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
            <div className="gallery-preview">
              <div className="preview-header">
                <h1>{formData.title || 'Event Title'}</h1>
                <div className="preview-meta">
                  <span>📅 {formData.date}</span>
                  <span>📍 {formData.location}</span>
                  <span className={`status ${formData.status}`}>{formData.status}</span>
                </div>
              </div>
              
              {formData.image && (
                <div className="preview-featured-image">
                  <img src={formData.image} alt={formData.title} />
                </div>
              )}
              
              <div className="preview-description">
                <p>{formData.description}</p>
              </div>
              
              {formData.gallery.filter(url => url).length > 0 && (
                <div className="preview-gallery">
                  <h3>📸 Event Gallery ({formData.gallery.filter(url => url).length} photos)</h3>
                  <div className="preview-gallery-grid">
                    {formData.gallery.filter(url => url && isValidUrl(url)).map((url, index) => (
                      <div key={index} className="preview-gallery-item">
                        <img src={url} alt={`Gallery ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GalleryEditor;