import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import './PhotoGallery.css';

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [activeTab, setActiveTab] = useState('promotional');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { activeGallery, upcomingEvents } = useContent();

  // Organize gallery data by category
  const galleryData = {
    promotional: activeGallery,
    upcoming: upcomingEvents
  };

  const openModal = (item) => {
    setSelectedImage(item);
    setCurrentImageIndex(0);
    // Only set gallery for promotional events (past events with actual photos)
    if (activeTab === 'promotional' && item.gallery && item.gallery.length > 0) {
      setSelectedGallery(item.gallery);
    } else {
      setSelectedGallery(null);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedGallery(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedGallery && selectedGallery.length > 1) {
      const nextIndex = (currentImageIndex + 1) % selectedGallery.length;
      setCurrentImageIndex(nextIndex);
      setSelectedImage({...selectedImage, image: selectedGallery[nextIndex]});
    }
  };

  const prevImage = () => {
    if (selectedGallery && selectedGallery.length > 1) {
      const prevIndex = currentImageIndex === 0 ? selectedGallery.length - 1 : currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setSelectedImage({...selectedImage, image: selectedGallery[prevIndex]});
    }
  };

  const selectThumbnail = (img, index) => {
    setCurrentImageIndex(index);
    setSelectedImage({...selectedImage, image: img});
  };

  return (
    <section id="gallery" className="gallery-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Photo Gallery
      </motion.h2>

      <div className="gallery-tabs">
        <button
          className={`gallery-tab ${activeTab === 'promotional' ? 'active' : ''}`}
          onClick={() => setActiveTab('promotional')}
        >
          Promotional Events
        </button>
        <button
          className={`gallery-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
      </div>

      <motion.div 
        className="gallery-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="gallery-items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {galleryData[activeTab].map((item) => (
              <motion.div
                key={item.id}
                className="gallery-item"
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => openModal(item)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="gallery-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="gallery-info">
                  <h3>{item.title}</h3>
                  <p className="gallery-date">{item.date}</p>
                  <p className="gallery-location">{item.location}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={closeModal}>&times;</button>
              
              {/* Navigation Arrows */}
              {selectedGallery && selectedGallery.length > 1 && (
                <>
                  <button className="nav-btn prev-btn" onClick={prevImage}>‹</button>
                  <button className="nav-btn next-btn" onClick={nextImage}>›</button>
                </>
              )}
              
              {/* Main Image */}
              <img src={selectedImage.image} alt={selectedImage.title} className="modal-main-image" />
              
              {/* Image Counter */}
              {selectedGallery && selectedGallery.length > 1 && (
                <div className="image-counter">
                  {currentImageIndex + 1} / {selectedGallery.length}
                </div>
              )}
              
              {/* Gallery Grid for Promotional Events */}
              {activeTab === 'promotional' && selectedGallery && selectedGallery.length > 1 && (
                <div className="modal-gallery-grid">
                  <h4>📸 Event Gallery ({selectedGallery.length} photos)</h4>
                  <div className="gallery-thumbnails">
                    {selectedGallery.map((img, index) => (
                      <img 
                        key={index}
                        src={img} 
                        alt={`${selectedImage.title} ${index + 1}`}
                        className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => selectThumbnail(img, index)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="modal-info">
                <h3>{selectedImage.title}</h3>
                <p className="modal-date">📅 {selectedImage.date}</p>
                <p className="modal-location">📍 {selectedImage.location}</p>
                {selectedImage.time && <p className="modal-time">🕐 {selectedImage.time}</p>}
                <p className="modal-description">{selectedImage.description}</p>
                
                {/* Show event program for upcoming events */}
                {activeTab === 'upcoming' && selectedImage.program && (
                  <div className="event-program">
                    <h4>📋 Event Program</h4>
                    <ul>
                      {selectedImage.program.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Show speakers for upcoming events */}
                {activeTab === 'upcoming' && selectedImage.speakers && (
                  <div className="event-speakers">
                    <h4>🎤 Featured Speakers</h4>
                    <p>{selectedImage.speakers.join(', ')}</p>
                  </div>
                )}
                
                {/* Show pricing for upcoming events */}
                {activeTab === 'upcoming' && selectedImage.price && (
                  <div className="event-pricing">
                    <h4>💰 Pricing</h4>
                    <p>{selectedImage.price}</p>
                  </div>
                )}
                
                {/* Registration button for upcoming events */}
                {activeTab === 'upcoming' && selectedImage.registrationUrl && (
                  <div className="event-registration">
                    <a 
                      href={selectedImage.registrationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="register-btn"
                    >
                      Register Now
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoGallery;