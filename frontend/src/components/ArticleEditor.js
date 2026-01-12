import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import './ArticleEditor.css';

const ArticleEditor = ({ articleId, onClose, onSave }) => {
  const { articles, updateArticles } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    category: 'technology',
    readTime: '',
    status: 'published',
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    'technology',
    'healthcare', 
    'finance',
    'manufacturing',
    'sustainability',
    'research'
  ];

  useEffect(() => {
    if (articleId) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        setFormData(article);
      }
    }
  }, [articleId, articles]);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
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
      const updatedArticles = [...articles];
      
      if (articleId) {
        // Edit existing article
        const index = updatedArticles.findIndex(a => a.id === articleId);
        if (index !== -1) {
          updatedArticles[index] = { ...formData, id: articleId };
        }
      } else {
        // Create new article
        const newArticle = {
          ...formData,
          id: Date.now()
        };
        updatedArticles.push(newArticle);
      }
      
      updateArticles(updatedArticles);
      onSave && onSave();
      onClose();
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  useEffect(() => {
    if (formData.content) {
      setFormData(prev => ({
        ...prev,
        readTime: estimateReadTime(formData.content)
      }));
    }
  }, [formData.content]);

  return (
    <div className="article-editor-overlay">
      <motion.div 
        className="article-editor-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="article-editor-header">
          <div className="header-left">
            <h2>{articleId ? 'Edit Article' : 'Create New Article'}</h2>
            <span className="read-time">{formData.readTime}</span>
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
        <div className="article-editor-content">
          {!previewMode ? (
            <form onSubmit={handleSubmit} className="article-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter article title..."
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
                  <label htmlFor="author">Author *</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name..."
                    className={errors.author ? 'error' : ''}
                  />
                  {errors.author && <span className="error-message">{errors.author}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
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
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="excerpt">Excerpt *</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the article..."
                  rows="3"
                  className={errors.excerpt ? 'error' : ''}
                />
                {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your article content here..."
                  rows="15"
                  className={errors.content ? 'error' : ''}
                />
                {errors.content && <span className="error-message">{errors.content}</span>}
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
                  {isSubmitting ? 'Saving...' : (articleId ? 'Update Article' : 'Create Article')}
                </button>
              </div>
            </form>
          ) : (
            <div className="article-preview">
              <div className="preview-header">
                <h1>{formData.title || 'Article Title'}</h1>
                <div className="preview-meta">
                  <span>By {formData.author || 'Author'}</span>
                  <span>•</span>
                  <span>{formData.date}</span>
                  <span>•</span>
                  <span>{formData.readTime}</span>
                  <span>•</span>
                  <span className={`status ${formData.status}`}>{formData.status}</span>
                </div>
              </div>
              
              {formData.image && (
                <div className="preview-image">
                  <img src={formData.image} alt={formData.title} />
                </div>
              )}
              
              <div className="preview-excerpt">
                <p><strong>{formData.excerpt}</strong></p>
              </div>
              
              <div className="preview-content">
                <p>{formData.content}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ArticleEditor;