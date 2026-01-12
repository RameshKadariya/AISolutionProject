import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import './Articles.css';

const Articles = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { publishedArticles } = useContent();
  
  // Use articles from ContentContext
  const articles = publishedArticles;

  // Get unique categories
  const categories = ['all', ...new Set(articles.map(article => article.category))];

  // Filter articles based on active category
  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  return (
    <section id="articles" className="articles-section">
      <div className="articles-container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Latest Articles
        </motion.h2>
        
        <motion.p 
          className="articles-intro"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Stay updated with our latest insights, success stories, and industry trends.
        </motion.p>

        <div className="article-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <motion.div 
          className="articles-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredArticles.map(article => (
            <motion.article 
              key={article.id} 
              className="article-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="article-image">
                <img src={article.image} alt={article.title} />
                <div className="article-category">{article.category}</div>
              </div>
              
              <div className="article-content">
                <div className="article-meta">
                  <span className="article-date">{article.date}</span>
                  <span className="article-read-time">{article.readTime}</span>
                </div>
                
                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                
                <div className="article-footer">
                  <div className="article-author">By {article.author}</div>
                  <button className="read-more-button">Read More</button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Articles;