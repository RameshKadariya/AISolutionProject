import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ContentProvider } from './contexts/ContentContext';
import ThemeToggle from './components/ThemeToggle';
import VideoBackground from './components/VideoBackground';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import SoftwareSolutions from './components/SoftwareSolutions';
import PhotoGallery from './components/PhotoGallery';
import Articles from './components/Articles';
import ContactForm from './components/ContactForm';
import AdminArea from './components/AdminArea';
import AIChatbot from './components/AIChatbot';
import FeedbackForm from './components/FeedbackForm';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      // Update active section based on scroll position
      const sections = ['home', 'solutions', 'portfolio', 'testimonials', 'gallery', 'articles', 'contact', 'feedback', 'admin'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <ThemeProvider>
      <ContentProvider>
        <Router>
        <Routes>
          <Route path="/" element={
          <div className="App">
            <VideoBackground />
            
            {/* Floating Navbar */}
            <nav className={`floating-navbar ${scrolled ? 'scrolled' : ''}`}>
              <div className="navbar-left">
                <div className="logo">AI-Solution</div>
                <div className="nav-links left-links">
                  <a 
                    href="#home" 
                    className={activeSection === 'home' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                  >
                    Home
                  </a>
                  <a 
                    href="#solutions" 
                    className={activeSection === 'solutions' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }}
                  >
                    Solutions
                  </a>
                  <a 
                    href="#portfolio" 
                    className={activeSection === 'portfolio' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToSection('portfolio'); }}
                  >
                    Portfolio
                  </a>
                  <a 
                    href="#testimonials" 
                    className={activeSection === 'testimonials' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}
                  >
                    Testimonials
                  </a>
                </div>
              </div>
              
              <div className="navbar-right">
                <div className="nav-links right-links">
                  <a 
                    href="#gallery" 
                    className={activeSection === 'gallery' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}
                  >
                    Gallery
                  </a>
                  <a 
                    href="#articles" 
                    className={activeSection === 'articles' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToSection('articles'); }}
                  >
                    Articles
                  </a>
                  <a 
                    href="#contact" 
                    className={activeSection === 'contact' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                  >
                    Contact
                  </a>
                  <a 
                    href="#feedback" 
                    className={activeSection === 'feedback' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToSection('feedback'); }}
                  >
                    Feedback
                  </a>
                  <a 
                    href="/admin" 
                    className={activeSection === 'admin' ? 'active' : ''}
                  >
                    Admin
                  </a>
                </div>
                <ThemeToggle className="navbar-theme-toggle" />
              </div>
              
              {/* Mobile Menu Button */}
              <div className="mobile-menu-button" onClick={toggleMenu}>
                <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              
              {/* Mobile Menu */}
              <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <a 
                  href="#home" 
                  className={activeSection === 'home' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                >
                  Home
                </a>
                <a 
                  href="#solutions" 
                  className={activeSection === 'solutions' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }}
                >
                  Solutions
                </a>
                <a 
                  href="#portfolio" 
                  className={activeSection === 'portfolio' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('portfolio'); }}
                >
                  Portfolio
                </a>
                <a 
                  href="#testimonials" 
                  className={activeSection === 'testimonials' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}
                >
                  Testimonials
                </a>
                <a 
                  href="#gallery" 
                  className={activeSection === 'gallery' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}
                >
                  Gallery
                </a>
                <a 
                  href="#articles" 
                  className={activeSection === 'articles' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('articles'); }}
                >
                  Articles
                </a>
                <a 
                  href="#contact" 
                  className={activeSection === 'contact' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                >
                  Contact
                </a>
                <a 
                  href="#feedback" 
                  className={activeSection === 'feedback' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('feedback'); }}
                >
                  Feedback
                </a>
                <a 
                  href="/admin" 
                  className={activeSection === 'admin' ? 'active' : ''}
                >
                  Admin
                </a>
                <div className="mobile-theme-toggle-container">
                  <ThemeToggle className="mobile-theme-toggle" />
                </div>
              </div>
            </nav>

            {/* Home Section */}
            <section id="home" className="hero-section">
              <div className="hero-overlay">
                <button className="cta-button">Learn More</button>
              </div>
            </section>

            {/* Software Solutions Section */}
            <SoftwareSolutions />
            
            {/* Portfolio Section */}
            <Portfolio />
            
            {/* Testimonials Section */}
            <Testimonials />
            
            {/* Photo Gallery Section */}
            <PhotoGallery />
            
            {/* Articles Section */}
            <Articles />
            
            {/* Contact Form Section */}
            <ContactForm />
            
            {/* Feedback Form Section */}
            <FeedbackForm />
            
            {/* Footer */}
            <footer className="footer">
              <div className="footer-content">
                <div className="footer-logo">AI-Solution</div>
                <div className="footer-links">
                  <a href="#home">Home</a>
                  <a href="#solutions">Solutions</a>
                  <a href="#portfolio">Portfolio</a>
                  <a href="#contact">Contact</a>
                </div>
                <div className="footer-social">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">📘</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">🐦</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">📷</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">💼</a>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2024 AI-Solution. All rights reserved.</p>
              </div>
            </footer>
            
            {/* AI Chatbot - Available on all pages */}
            <AIChatbot />
          </div>
        } />
        
        <Route path="/admin" element={
          <div className="admin-app">
            <AdminArea />
            {/* AI Chatbot also available in admin */}
            <AIChatbot />
          </div>
        } />
        </Routes>
      </Router>
      </ContentProvider>
    </ThemeProvider>
  );
}

export default App;
