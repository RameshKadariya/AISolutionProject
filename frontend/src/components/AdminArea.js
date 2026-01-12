import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import AnalyticsDashboard from './AnalyticsDashboard';
import DataSyncStatus from './DataSyncStatus';
import ArticleEditor from './ArticleEditor';
import GalleryEditor from './GalleryEditor';
import EventEditor from './EventEditor';
import smartDataManager from '../utils/smartDataManager';
import { useContent } from '../contexts/ContentContext';
import './AdminArea.css';
import './FeedbackTable.css';
import './ContentManagement.css';

const AdminArea = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [adminProfile, setAdminProfile] = useState({ name: 'Ramesh', role: 'Administrator' });
  const [syncStatus, setSyncStatus] = useState({ synced: true, lastSync: new Date() });
  const [syncMessage, setSyncMessage] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const { articles, gallery, events, updateArticles, updateGallery, updateEvents } = useContent();
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    byCountry: {},
    byIndustry: {}
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  
  // Full-screen editor states
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [showGalleryEditor, setShowGalleryEditor] = useState(false);
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);

  // In a real app, authentication would be handled securely (e.g., token-based) on the server
  // const ADMIN_PASSWORD = 'admin123';

  // Enhanced stable demo inquiries with recent dates
  const generateDemoInquiries = () => {
    const now = new Date();
    const getRecentDate = (daysAgo) => {
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString();
    };

    return [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@techinnovations.com',
        company: 'Tech Innovations Inc.',
        country: 'United States',
        jobTitle: 'Chief Technology Officer',
        date: getRecentDate(1),
        status: 'New',
        industry: 'Technology',
        details: 'Looking for AI solutions to optimize our customer service operations and reduce response times by 50%.',
        priority: 'High',
        estimatedValue: '$45,000'
      },
      {
        id: 2,
        name: 'Maria Garcia',
        email: 'maria.garcia@healthplus.org',
        company: 'HealthPlus Medical Center',
        country: 'Spain',
        jobTitle: 'Head of Digital Innovation',
        date: getRecentDate(2),
        status: 'In Progress',
        industry: 'Healthcare',
        details: 'Interested in implementing AI diagnostic tools in our hospital network to improve patient outcomes.',
        priority: 'High',
        estimatedValue: '$120,000'
      },
      {
        id: 3,
        name: 'Robert Chen',
        email: 'robert.chen@globalfinance.com',
        company: 'Global Finance Group',
        country: 'Singapore',
        jobTitle: 'Risk Management Director',
        date: getRecentDate(3),
        status: 'Contacted',
        industry: 'Finance',
        details: 'Need a fraud detection system that can analyze transaction patterns in real-time and prevent financial crimes.',
        priority: 'High',
        estimatedValue: '$85,000'
      },
      {
        id: 4,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@retailmart.com',
        company: 'RetailMart Corporation',
        country: 'Canada',
        jobTitle: 'Operations Director',
        date: getRecentDate(4),
        status: 'Closed',
        industry: 'Retail',
        details: 'Successfully implemented inventory management solutions with predictive capabilities. Excellent results!',
        priority: 'Medium',
        estimatedValue: '$32,000'
      },
      {
        id: 5,
        name: 'Ahmed Al-Farsi',
        email: 'ahmed.alfarsi@energysolutions.ae',
        company: 'Energy Solutions International',
        country: 'United Arab Emirates',
        jobTitle: 'Project Manager',
        date: getRecentDate(5),
        status: 'New',
        industry: 'Energy',
        details: 'Interested in AI solutions for optimizing energy consumption in large facilities and reducing costs by 30%.',
        priority: 'Medium',
        estimatedValue: '$67,000'
      },
      {
        id: 6,
        name: 'Emma Wilson',
        email: 'emma.wilson@edutech.co.uk',
        company: 'EduTech Learning Solutions',
        country: 'United Kingdom',
        jobTitle: 'Product Manager',
        date: getRecentDate(6),
        status: 'In Progress',
        industry: 'Education',
        details: 'Seeking AI-powered personalized learning solutions for our online education platform with 100K+ students.',
        priority: 'Medium',
        estimatedValue: '$55,000'
      },
      {
        id: 7,
        name: 'Carlos Mendez',
        email: 'carlos.mendez@automotivetech.mx',
        company: 'Automotive Technologies Mexico',
        country: 'Mexico',
        jobTitle: 'Innovation Lead',
        date: getRecentDate(7),
        status: 'Contacted',
        industry: 'Automotive',
        details: 'Looking for computer vision solutions for quality control in our manufacturing plants to reduce defects.',
        priority: 'High',
        estimatedValue: '$95,000'
      },
      {
        id: 8,
        name: 'Priya Patel',
        email: 'priya.patel@pharmahealth.in',
        company: 'PharmaHealth Research Ltd.',
        country: 'India',
        jobTitle: 'Research Director',
        date: getRecentDate(8),
        status: 'New',
        industry: 'Pharmaceutical',
        details: 'Interested in AI for drug discovery and development processes to accelerate research timelines.',
        priority: 'High',
        estimatedValue: '$150,000'
      },
      {
        id: 9,
        name: 'Lars Andersson',
        email: 'lars.andersson@nordictechab.se',
        company: 'Nordic Tech AB',
        country: 'Sweden',
        jobTitle: 'CEO',
        date: getRecentDate(9),
        status: 'In Progress',
        industry: 'Technology',
        details: 'Looking for AI automation solutions to streamline our software development processes.',
        priority: 'Medium',
        estimatedValue: '$78,000'
      },
      {
        id: 10,
        name: 'Sophie Dubois',
        email: 'sophie.dubois@luxurybrands.fr',
        company: 'Luxury Brands International',
        country: 'France',
        jobTitle: 'Digital Transformation Manager',
        date: getRecentDate(10),
        status: 'New',
        industry: 'Retail',
        details: 'Need AI-powered customer behavior analysis for our luxury retail chain to enhance customer experience.',
        priority: 'Medium',
        estimatedValue: '$42,000'
      },
      {
        id: 11,
        name: 'Michael O\'Connor',
        email: 'michael.oconnor@greenenergyau.com',
        company: 'Green Energy Australia',
        country: 'Australia',
        jobTitle: 'Technical Director',
        date: getRecentDate(11),
        status: 'Contacted',
        industry: 'Energy',
        details: 'Interested in AI solutions for renewable energy optimization and smart grid management.',
        priority: 'High',
        estimatedValue: '$110,000'
      },
      {
        id: 12,
        name: 'Yuki Tanaka',
        email: 'yuki.tanaka@roboticstech.jp',
        company: 'Robotics Technology Japan',
        country: 'Japan',
        jobTitle: 'AI Research Lead',
        date: getRecentDate(12),
        status: 'New',
        industry: 'Manufacturing',
        details: 'Looking for advanced AI algorithms for industrial robotics and autonomous manufacturing systems.',
        priority: 'High',
        estimatedValue: '$200,000'
      }
    ];
  };

  const mockInquiries = generateDemoInquiries();

  // One-time cleanup function for old timestamp IDs
  const cleanupOldData = () => {
    localStorage.removeItem('ai-solution-user-inquiries');
    console.log('Cleared all user inquiries - fresh start with sequential IDs');
    loadData();
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to load from backend first
      let backendData = [];
      try {
        const response = await fetch('http://localhost:5000/api/contact');
        if (response.ok) {
          backendData = await response.json();
        }
      } catch (error) {
        console.log('Backend not available, using demo data only');
      }
      // Load persisted demo data from localStorage
      const persistedDemoData = localStorage.getItem('ai-solution-demo-inquiries');
      let demoInquiries = mockInquiries;

      if (persistedDemoData) {
        try {
          const parsed = JSON.parse(persistedDemoData);
          // Update dates to keep them recent
          demoInquiries = parsed.map(inquiry => ({
            ...inquiry,
            date: mockInquiries.find(m => m.id === inquiry.id)?.date || inquiry.date
          }));
        } catch (error) {
          console.log('Error parsing persisted demo data, using fresh demo data');
        }
      }

      // Load user-submitted inquiries from contact form
      const allUserInquiries = JSON.parse(localStorage.getItem('ai-solution-user-inquiries') || '[]');

      // Clean up any old timestamp IDs (keep only proper sequential IDs 13+)
      const userInquiries = allUserInquiries.filter(inquiry => inquiry.id >= 13 && inquiry.id < 10000);

      // If we cleaned up any old IDs, save the cleaned data back
      if (allUserInquiries.length !== userInquiries.length) {
        localStorage.setItem('ai-solution-user-inquiries', JSON.stringify(userInquiries));
        console.log('Cleaned up', allUserInquiries.length - userInquiries.length, 'old timestamp IDs');
      }

      // Combine all data: demo + user + backend
      const combinedInquiries = [...demoInquiries, ...userInquiries];
      let nextId = Math.max(...combinedInquiries.map(i => i.id), 0) + 1;

      if (backendData.length > 0) {
        const realInquiriesWithIds = backendData.map(item => ({
          ...item,
          id: item.id || nextId++,
          priority: item.priority || 'Medium',
          estimatedValue: item.estimatedValue || '$25,000'
        }));
        combinedInquiries.push(...realInquiriesWithIds);
      }

      // Sort inquiries: newest first (by date), then by ID descending
      const sortedInquiries = combinedInquiries.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB - dateA; // Newest first
        }
        return b.id - a.id; // Higher ID first if same date
      });

      setInquiries(sortedInquiries);

      // Load feedback data
      const feedbackData = JSON.parse(localStorage.getItem('ai-solution-feedback') || '[]');

      // Add dummy feedback if none exists
      if (feedbackData.length === 0) {
        const dummyFeedback = [
          {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah.j@techcorp.com',
            company: 'TechCorp Solutions',
            serviceUsed: 'AI Analytics Solutions',
            overallRating: 5,
            recommendation: 5,
            feedback: 'Outstanding AI analytics platform! Helped us increase efficiency by 40%. The team was professional and delivered exactly what we needed.',
            status: 'Reviewed',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            name: 'Michael Chen',
            email: 'm.chen@innovatetech.com',
            company: 'InnovateTech Ltd',
            serviceUsed: 'Computer Vision',
            overallRating: 4,
            recommendation: 4,
            feedback: 'Great computer vision solution for our manufacturing line. Reduced defects by 60%. Would recommend for quality control applications.',
            status: 'New',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            name: 'Emily Rodriguez',
            email: 'emily.r@healthplus.org',
            company: 'HealthPlus Medical',
            serviceUsed: 'NLP Solutions',
            overallRating: 5,
            recommendation: 5,
            feedback: 'Excellent NLP implementation for patient data analysis. The natural language processing capabilities exceeded our expectations. Highly professional team.',
            status: 'Reviewed',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            name: 'David Wilson',
            email: 'd.wilson@automate.co',
            company: 'AutomateCo Industries',
            serviceUsed: 'Automation Systems',
            overallRating: 4,
            recommendation: 4,
            feedback: 'Solid automation solution that streamlined our workflow processes. Implementation was smooth and support team was responsive.',
            status: 'New',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            name: 'Lisa Thompson',
            email: 'l.thompson@retailmax.com',
            company: 'RetailMax Corporation',
            serviceUsed: 'Custom AI Development',
            overallRating: 5,
            recommendation: 5,
            feedback: 'Amazing custom AI solution for inventory management. The predictive analytics have saved us thousands in inventory costs. Exceptional work!',
            status: 'Reviewed',
            date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 6,
            name: 'Robert Kim',
            email: 'r.kim@financetech.net',
            company: 'FinanceTech Solutions',
            serviceUsed: 'AI Analytics Solutions',
            overallRating: 4,
            recommendation: 4,
            feedback: 'Good analytics platform with comprehensive reporting features. Helped identify key business insights. Minor UI improvements could be made.',
            status: 'New',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 7,
            name: 'Amanda Foster',
            email: 'a.foster@edutech.edu',
            company: 'EduTech University',
            serviceUsed: 'NLP Solutions',
            overallRating: 5,
            recommendation: 5,
            feedback: 'Perfect NLP solution for student feedback analysis. The sentiment analysis features are incredibly accurate. Great collaboration experience.',
            status: 'Reviewed',
            date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 8,
            name: 'James Martinez',
            email: 'j.martinez@logistics.pro',
            company: 'LogisticsPro Inc',
            serviceUsed: 'Computer Vision',
            overallRating: 4,
            recommendation: 4,
            feedback: 'Effective computer vision system for package sorting. Increased our sorting accuracy significantly. Professional implementation and training.',
            status: 'New',
            date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];

        localStorage.setItem('ai-solution-feedback', JSON.stringify(dummyFeedback));
        const sortedFeedback = dummyFeedback.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFeedback(sortedFeedback);
      } else {
        const sortedFeedback = feedbackData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFeedback(sortedFeedback);
      }

      // Load content management data
      loadContentData();

      // Persist demo data to localStorage
      localStorage.setItem('ai-solution-demo-inquiries', JSON.stringify(demoInquiries));

      // Sync with Smart Data Manager for analytics
      smartDataManager.setRealInquiries(combinedInquiries);

      // Calculate statistics based on combined data
      const total = combinedInquiries.length;

      const now = new Date();
      const thisMonth = combinedInquiries.filter(inquiry => {
        const inquiryDate = new Date(inquiry.date);
        return inquiryDate.getMonth() === now.getMonth() &&
          inquiryDate.getFullYear() === now.getFullYear();
      }).length;

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const thisWeek = combinedInquiries.filter(inquiry => {
        const inquiryDate = new Date(inquiry.date);
        return inquiryDate >= startOfWeek;
      }).length;

      // Count by country
      const byCountry = combinedInquiries.reduce((acc, inquiry) => {
        acc[inquiry.country] = (acc[inquiry.country] || 0) + 1;
        return acc;
      }, {});

      // Count by industry
      const byIndustry = combinedInquiries.reduce((acc, inquiry) => {
        acc[inquiry.industry] = (acc[inquiry.industry] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total,
        thisMonth,
        thisWeek,
        byCountry,
        byIndustry
      });
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setError('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced security states
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionTimeLeft, setSessionTimeLeft] = useState(4 * 60 * 60); // 4 hours for real admin work

  // Session management - 4 hours for real admin work
  useEffect(() => {
    if (isAuthenticated) {
      // Set session timeout (4 hours - practical for admin work)
      const timeout = setTimeout(() => {
        handleLogout();
        setError('Session expired after 4 hours. Please login again for security.');
      }, 4 * 60 * 60 * 1000); // 4 hours
      
      setSessionTimeout(timeout);
      
      // Activity listener to extend session
      const handleActivity = () => {
        setLastActivity(Date.now());
        // Reset session timer on activity
        setSessionTimeLeft(4 * 60 * 60);
      };
      
      document.addEventListener('mousedown', handleActivity);
      document.addEventListener('keydown', handleActivity);
      document.addEventListener('scroll', handleActivity);
      
      return () => {
        clearTimeout(timeout);
        document.removeEventListener('mousedown', handleActivity);
        document.removeEventListener('keydown', handleActivity);
        document.removeEventListener('scroll', handleActivity);
      };
    }
  }, [isAuthenticated]);

  // Session countdown timer
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        setSessionTimeLeft(prev => {
          if (prev <= 1) {
            handleLogout();
            setError('Session expired. Please login again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Check for account lockout on component mount
  useEffect(() => {
    const lockoutData = localStorage.getItem('admin-lockout');
    if (lockoutData) {
      const { attempts, lockTime } = JSON.parse(lockoutData);
      const now = Date.now();
      
      if (now - lockTime < 15 * 60 * 1000) { // 15 minutes lockout
        setIsLocked(true);
        setLockoutTime(lockTime);
        setLoginAttempts(attempts);
      } else {
        // Lockout expired, clear it
        localStorage.removeItem('admin-lockout');
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) {
      const now = Date.now();
      const timeRemaining = Math.ceil((15 * 60 * 1000 - (now - lockoutTime)) / 1000 / 60);
      const lockoutMessage = `Account locked. Try again in ${timeRemaining} minutes.`;
      setError(lockoutMessage);
      
      // Enhanced lockout detection for testing
      console.log('🔒 Login attempt blocked - Account is locked');
      document.body.setAttribute('data-account-locked', 'true');
      document.body.setAttribute('data-lockout-message', 'Account locked');
      
      return;
    }
    
    setLoading(true);
    try {
      // Input validation
      if (username.trim() === '' || password.trim() === '') {
        setError('Username and password are required.');
        return;
      }

      // Enhanced credential validation
      const validCredentials = [
        { user: 'Ramesh', pass: 'rameshji' },
        { user: 'admin', pass: 'admin123' },
        { user: 'test', pass: 'test123' }
      ];

      const isValidLogin = validCredentials.some(
        cred => cred.user === username && cred.pass === password
      );

      if (isValidLogin) {
        // Successful login
        setIsAuthenticated(true);
        setError('');
        setLoginAttempts(0);
        setLastActivity(Date.now());
        
        // Clear any lockout data
        localStorage.removeItem('admin-lockout');
        
        // Log successful login
        console.log('✅ Admin login successful for:', username);
        
        // Store login session info
        localStorage.setItem('admin-session', JSON.stringify({
          user: username,
          loginTime: Date.now(),
          lastActivity: Date.now()
        }));
        
      } else {
        // Failed login
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // Log failed attempt for testing
        console.log(`❌ Failed login attempt ${newAttempts} for user: ${username}`);
        
        if (newAttempts >= 3) {
          // Lock account after 3 failed attempts
          const lockTime = Date.now();
          setIsLocked(true);
          setLockoutTime(lockTime);
          
          localStorage.setItem('admin-lockout', JSON.stringify({
            attempts: newAttempts,
            lockTime: lockTime
          }));
          
          // Enhanced lockout message for testing
          const lockoutMessage = 'ACCOUNT LOCKED - Too many failed attempts. Account locked for 15 minutes.';
          setError(lockoutMessage);
          
          // Log lockout for testing
          console.log('🔒 ACCOUNT LOCKED - Brute force protection activated');
          
          // Add lockout indicator to DOM for testing
          document.body.setAttribute('data-account-locked', 'true');
          document.body.setAttribute('data-lockout-message', 'Account locked');
          
        } else {
          setError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
          console.log(`⚠️ ${3 - newAttempts} attempts remaining before lockout`);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear session timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
    
    // Clear session data
    localStorage.removeItem('admin-session');
    
    // Reset all states
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setActiveTab('dashboard');
    setSelectedInquiry(null);
    setShowInquiryModal(false);
    setCurrentPage(1);
    setLoginAttempts(0);
    setLastActivity(Date.now());
    
    console.log('🔐 Admin logged out successfully');
  };

  const handleSyncToggle = () => {
    const newSyncStatus = !syncStatus.synced;
    const now = new Date();
    setSyncStatus({ synced: newSyncStatus, lastSync: now });

    if (newSyncStatus) {
      setSyncMessage(`✅ Analytics synced successfully at ${now.toLocaleTimeString()}`);
    } else {
      setSyncMessage(`⚠️ Analytics unsynced at ${now.toLocaleTimeString()}`);
    }

    // Clear message after 3 seconds
    setTimeout(() => setSyncMessage(''), 3000);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowInquiryModal(true);
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    // Update the inquiry status
    const updatedInquiries = inquiries.map(inquiry =>
      inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
    );

    setInquiries(updatedInquiries);

    // Persist changes to localStorage
    const demoInquiries = updatedInquiries.filter(inquiry => inquiry.id <= 12);
    const userInquiries = updatedInquiries.filter(inquiry => inquiry.id >= 13 && inquiry.id < 10000);

    localStorage.setItem('ai-solution-demo-inquiries', JSON.stringify(demoInquiries));
    localStorage.setItem('ai-solution-user-inquiries', JSON.stringify(userInquiries));

    // Sync with smart data manager for analytics
    smartDataManager.setRealInquiries(updatedInquiries);

    // Update the selected inquiry if it's currently being viewed
    if (selectedInquiry && selectedInquiry.id === inquiryId) {
      setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleFeedbackStatusUpdate = (feedbackId, newStatus) => {
    // Update feedback status
    const updatedFeedback = feedback.map(item =>
      item.id === feedbackId ? { ...item, status: newStatus } : item
    );

    setFeedback(updatedFeedback);

    // Persist changes to localStorage
    localStorage.setItem('ai-solution-feedback', JSON.stringify(updatedFeedback));
  };

  // Content Management Functions
  const loadContentData = () => {
    // Content is now managed by ContentContext
    // No need to load separately as it's already available
  };

  // Article Editor Handlers
  const handleCreateArticle = () => {
    setEditingArticleId(null);
    setShowArticleEditor(true);
  };

  const handleEditArticle = (articleId) => {
    setEditingArticleId(articleId);
    setShowArticleEditor(true);
  };

  const handleCloseArticleEditor = () => {
    setShowArticleEditor(false);
    setEditingArticleId(null);
  };

  // Gallery Editor Handlers
  const handleCreateGalleryEvent = () => {
    setEditingGalleryId(null);
    setShowGalleryEditor(true);
  };

  const handleEditGalleryEvent = (eventId) => {
    setEditingGalleryId(eventId);
    setShowGalleryEditor(true);
  };

  const handleCloseGalleryEditor = () => {
    setShowGalleryEditor(false);
    setEditingGalleryId(null);
  };

  // Event Editor Handlers
  const handleCreateEvent = () => {
    setEditingEventId(null);
    setShowEventEditor(true);
  };

  const handleEditEvent = (eventId) => {
    setEditingEventId(eventId);
    setShowEventEditor(true);
  };

  const handleCloseEventEditor = () => {
    setShowEventEditor(false);
    setEditingEventId(null);
  };

  // Delete Handlers
  const handleDeleteArticle = (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const updatedArticles = articles.filter(article => article.id !== articleId);
      updateArticles(updatedArticles);
    }
  };

  const handleDeleteGalleryEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this gallery event?')) {
      const updatedGallery = gallery.filter(event => event.id !== eventId);
      updateGallery(updatedGallery);
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      updateEvents(updatedEvents);
    }
  };

  const getDefaultArticles = () => [
    {
      id: 1,
      title: 'How AI is Transforming Customer Service',
      excerpt: 'Discover how our AI solutions are helping businesses provide better customer experiences with intelligent automation and personalized interactions.',
      content: 'Artificial Intelligence is revolutionizing the way businesses interact with their customers. Our advanced AI solutions provide intelligent automation and personalized interactions that enhance customer satisfaction while reducing operational costs.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      date: '2023-12-10',
      author: 'Sarah Johnson',
      category: 'technology',
      readTime: '5 min read',
      status: 'published'
    },
    {
      id: 2,
      title: 'The Future of Predictive Analytics in Healthcare',
      excerpt: 'Our healthcare AI solutions are helping medical professionals predict patient outcomes and improve treatment plans with unprecedented accuracy.',
      content: 'Healthcare is being transformed by predictive analytics. Our AI solutions help medical professionals make better decisions by analyzing patient data and predicting outcomes with remarkable accuracy.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      date: '2023-11-28',
      author: 'Dr. Michael Chen',
      category: 'healthcare',
      readTime: '8 min read',
      status: 'published'
    },
    {
      id: 3,
      title: 'AI-Powered Fraud Detection: Protecting Financial Institutions',
      excerpt: 'Learn how our advanced fraud detection systems are helping banks and financial institutions save millions by identifying suspicious activities in real-time.',
      content: 'Financial fraud is a growing concern for institutions worldwide. Our AI-powered fraud detection systems analyze transaction patterns in real-time to identify and prevent suspicious activities.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      date: '2023-11-15',
      author: 'Robert Williams',
      category: 'finance',
      readTime: '6 min read',
      status: 'published'
    },
    {
      id: 4,
      title: 'Computer Vision in Manufacturing: Quality Control Reimagined',
      excerpt: 'Our computer vision solutions are revolutionizing quality control in manufacturing, reducing defects by up to 90% while increasing production speed.',
      content: 'Manufacturing quality control has been transformed by computer vision technology. Our solutions can detect defects with unprecedented accuracy, reducing waste and improving product quality.',
      image: 'https://images.unsplash.com/photo-1581092921461-39b9d08a9b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      date: '2023-10-30',
      author: 'Emily Zhang',
      category: 'manufacturing',
      readTime: '7 min read',
      status: 'published'
    },
    {
      id: 5,
      title: 'Natural Language Processing: Breaking Down Communication Barriers',
      excerpt: 'Discover how our NLP solutions are helping global businesses communicate more effectively across languages and cultures.',
      content: 'Natural Language Processing is breaking down communication barriers in global business. Our NLP solutions enable seamless communication across languages and cultures.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      date: '2023-10-18',
      author: 'James Wilson',
      category: 'technology',
      readTime: '5 min read',
      status: 'published'
    },
    {
      id: 6,
      title: 'AI Solutions for Sustainable Energy Management',
      excerpt: 'Our AI-powered energy management systems are helping businesses reduce their carbon footprint while optimizing energy consumption and costs.',
      content: 'Sustainable energy management is crucial for modern businesses. Our AI solutions help optimize energy consumption while reducing environmental impact and operational costs.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      date: '2023-10-05',
      author: 'Maria Rodriguez',
      category: 'sustainability',
      readTime: '6 min read',
      status: 'published'
    }
  ];

  const getDefaultGallery = () => [
    {
      id: 1,
      title: 'AI Summit 2023',
      date: '2023-03-15',
      location: 'London Tech Hub',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Our team showcasing the latest AI innovations at the annual AI Summit.',
      category: 'promotional',
      status: 'active'
    },
    {
      id: 2,
      title: 'Industry Partnership Launch',
      date: '2023-05-22',
      location: 'Global Innovation Center',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Celebrating our new strategic partnership with leading industry players.',
      category: 'promotional',
      status: 'active'
    },
    {
      id: 3,
      title: 'Tech Expo 2023',
      date: '2023-07-10',
      location: 'Convention Center',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Demonstrating our AI solutions at the largest tech expo of the year.',
      category: 'promotional',
      status: 'active'
    },
    {
      id: 4,
      title: 'AI in Healthcare Symposium',
      date: '2023-09-05',
      location: 'Medical Research Center',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Presenting our healthcare AI solutions to medical professionals.',
      category: 'promotional',
      status: 'active'
    },
    {
      id: 5,
      title: 'Innovation Awards 2023',
      date: '2023-10-18',
      location: 'Grand Hotel',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Receiving the "Most Innovative AI Solution" award at the annual Innovation Awards.',
      category: 'promotional',
      status: 'active'
    },
    {
      id: 6,
      title: 'Community Tech Workshop',
      date: '2023-11-12',
      location: 'Community Center',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Hosting a workshop to introduce AI concepts to the local community.',
      category: 'promotional',
      status: 'active'
    }
  ];

  const getDefaultEvents = () => [
    {
      id: 7,
      title: 'AI Future Conference',
      description: 'Join us at the AI Future Conference where we will unveil our next-generation AI solutions.',
      date: '2024-01-20',
      time: '09:00',
      location: 'Future Tech Campus',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'conference',
      status: 'upcoming',
      registrationUrl: 'https://example.com/ai-future-conference'
    },
    {
      id: 8,
      title: 'Global AI Summit',
      description: 'We will be keynote speakers at the Global AI Summit, discussing the future of AI in business.',
      date: '2024-02-15',
      time: '10:00',
      location: 'International Convention Center',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'conference',
      status: 'upcoming',
      registrationUrl: 'https://example.com/global-ai-summit'
    },
    {
      id: 9,
      title: 'Industry 4.0 Expo',
      description: 'Showcasing our manufacturing AI solutions at the Industry 4.0 Expo.',
      date: '2024-04-05',
      time: '09:30',
      location: 'Manufacturing Innovation Hub',
      image: 'https://images.unsplash.com/photo-1581092921461-39b9d08a9b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'expo',
      status: 'upcoming',
      registrationUrl: 'https://example.com/industry-4-expo'
    },
    {
      id: 10,
      title: 'AI in Finance Summit',
      description: 'Presenting our financial AI solutions and fraud detection systems.',
      date: '2024-05-18',
      time: '14:00',
      location: 'Financial District Conference Center',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'summit',
      status: 'upcoming',
      registrationUrl: 'https://example.com/ai-finance-summit'
    }
  ];

  // CRUD Operations for Articles
  const handleArticleCreate = (articleData) => {
    const newArticle = {
      ...articleData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    const updatedArticles = [...articles, newArticle];
    updateArticles(updatedArticles);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleArticleUpdate = (articleData) => {
    const updatedArticles = articles.map(article =>
      article.id === editingItem.id ? { ...articleData, id: editingItem.id } : article
    );
    updateArticles(updatedArticles);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleArticleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const updatedArticles = articles.filter(article => article.id !== id);
      updateArticles(updatedArticles);
    }
  };

  // CRUD Operations for Gallery
  const handleGalleryCreate = (galleryData) => {
    const newGalleryItem = {
      ...galleryData,
      id: Date.now()
    };
    const updatedGallery = [...gallery, newGalleryItem];
    updateGallery(updatedGallery);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleGalleryUpdate = (galleryData) => {
    const updatedGallery = gallery.map(item =>
      item.id === editingItem.id ? { ...galleryData, id: editingItem.id } : item
    );
    updateGallery(updatedGallery);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleGalleryDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      const updatedGallery = gallery.filter(item => item.id !== id);
      updateGallery(updatedGallery);
    }
  };

  // CRUD Operations for Events
  const handleEventCreate = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now()
    };
    const updatedEvents = [...events, newEvent];
    updateEvents(updatedEvents);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleEventUpdate = (eventData) => {
    const updatedEvents = events.map(event =>
      event.id === editingItem.id ? { ...eventData, id: editingItem.id } : event
    );
    updateEvents(updatedEvents);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleEventDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(event => event.id !== id);
      updateEvents(updatedEvents);
    }
  };

  // Modal handlers
  const openCreateModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setModalType('');
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Company', 'Country', 'Job Title', 'Industry', 'Status', 'Details'];
    const csvContent = [
      headers.join(','),
      ...filteredInquiries.map(inquiry => [
        inquiry.id,
        formatDate(inquiry.date),
        `"${inquiry.name || 'N/A'}"`,
        `"${inquiry.email || 'N/A'}"`,
        `"${inquiry.company || 'N/A'}"`,
        `"${inquiry.country || 'N/A'}"`,
        `"${inquiry.jobTitle || 'N/A'}"`,
        `"${inquiry.industry || 'N/A'}"`,
        `"${inquiry.status || 'N/A'}"`,
        `"${(inquiry.details || 'N/A').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    if (!status) return ''; // Handle undefined or null status
    switch (status.toLowerCase()) {
      case 'new':
        return 'status-new';
      case 'in progress':
        return 'status-progress';
      case 'contacted':
        return 'status-contacted';
      case 'closed':
        return 'status-closed';
      default:
        return '';
    }
  };

  const filteredInquiries = React.useMemo(() => {
    let filtered = inquiries;

    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status?.toLowerCase() === filterStatus.toLowerCase());
    }

    if (filterCountry !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.country?.toLowerCase() === filterCountry.toLowerCase());
    }

    if (filterIndustry !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.industry?.toLowerCase() === filterIndustry.toLowerCase());
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [inquiries, searchTerm, filterStatus, filterCountry, filterIndustry, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Inquiry Detail Modal
  const renderInquiryModal = () => (
    <AnimatePresence>
      {showInquiryModal && selectedInquiry && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowInquiryModal(false)}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Inquiry Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowInquiryModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="inquiry-details">
                <div className="detail-row">
                  <div className="detail-group">
                    <label>Name:</label>
                    <span>{selectedInquiry.name || 'N/A'}</span>
                  </div>
                  <div className="detail-group">
                    <label>Email:</label>
                    <span>{selectedInquiry.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-group">
                    <label>Company:</label>
                    <span>{selectedInquiry.company || 'N/A'}</span>
                  </div>
                  <div className="detail-group">
                    <label>Job Title:</label>
                    <span>{selectedInquiry.jobTitle || 'N/A'}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-group">
                    <label>Country:</label>
                    <span>{selectedInquiry.country || 'N/A'}</span>
                  </div>
                  <div className="detail-group">
                    <label>Industry:</label>
                    <span>{selectedInquiry.industry || 'N/A'}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-group">
                    <label>Date:</label>
                    <span>{formatDate(selectedInquiry.date)}</span>
                  </div>
                  <div className="detail-group">
                    <label>Status:</label>
                    <select
                      value={selectedInquiry.status || 'New'}
                      onChange={(e) => handleStatusUpdate(selectedInquiry.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="detail-full">
                  <label>Job Details:</label>
                  <div className="details-text">
                    {selectedInquiry.details || 'No details provided'}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowInquiryModal(false)}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => window.open(`mailto:${selectedInquiry.email}?subject=Re: Your AI-Solution Inquiry`)}
              >
                Send Email
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Content Management Modal
  const renderContentModal = () => {
    if (!showModal) return null;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              {editingItem ? 'Edit' : 'Create'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            <button className="modal-close" onClick={closeModal}>×</button>
          </div>

          <ContentForm
            type={modalType}
            item={editingItem}
            onSubmit={editingItem ?
              (modalType === 'article' ? handleArticleUpdate :
                modalType === 'gallery' ? handleGalleryUpdate :
                  handleEventUpdate) :
              (modalType === 'article' ? handleArticleCreate :
                modalType === 'gallery' ? handleGalleryCreate :
                  handleEventCreate)
            }
            onCancel={closeModal}
          />
        </div>
      </div>
    );
  };

  // Content Form Component
  const ContentForm = ({ type, item, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(
      item || (type === 'article' ? {
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: '',
        category: 'technology',
        readTime: '',
        status: 'draft'
      } : type === 'gallery' ? {
        title: '',
        description: '',
        image: '',
        date: '',
        location: '',
        category: 'promotional',
        status: 'active'
      } : {
        title: '',
        description: '',
        image: '',
        date: '',
        time: '',
        location: '',
        category: 'conference',
        status: 'upcoming',
        registrationUrl: ''
      })
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    return (
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          {type === 'article' && (
            <>
              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Read Time</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="5 min read"
                />
              </div>
            </>
          )}

          {type === 'gallery' && (
            <>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {type === 'event' && (
            <>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Registration URL</label>
                <input
                  type="url"
                  name="registrationUrl"
                  value={formData.registrationUrl}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {type === 'article' && (
                <>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="manufacturing">Manufacturing</option>
                </>
              )}
              {type === 'gallery' && (
                <>
                  <option value="promotional">Promotional</option>
                  <option value="events">Events</option>
                  <option value="team">Team</option>
                  <option value="office">Office</option>
                </>
              )}
              {type === 'event' && (
                <>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                  <option value="meetup">Meetup</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {type === 'article' && (
                <>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </>
              )}
              {type === 'gallery' && (
                <>
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                </>
              )}
              {type === 'event' && (
                <>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>{type === 'article' ? 'Excerpt' : 'Description'} *</label>
          <textarea
            name={type === 'article' ? 'excerpt' : 'description'}
            value={type === 'article' ? formData.excerpt : formData.description}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        {type === 'article' && (
          <div className="form-group full-width">
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              placeholder="Full article content..."
            />
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {item ? 'Update' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </form>
    );
  };



  // Dashboard Content
  const renderDashboard = () => (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h3>Dashboard Overview</h3>
        <div className="dashboard-actions">
          <button className="smart-sync-indicator" onClick={handleSyncToggle}>
            <span className="sync-icon">{syncStatus.synced ? '🔗' : '🔓'}</span>
            <span className="sync-text">{syncStatus.synced ? 'Analytics Synced' : 'Analytics Unsynced'}</span>
          </button>
          {syncMessage && (
            <div className="sync-message">
              {syncMessage}
            </div>
          )}
          <button className="btn-secondary" onClick={loadData}>
            <span className="btn-icon">🔄</span>
            Refresh Data
          </button>
          <button className="btn-primary" onClick={exportToCSV}>
            <span className="btn-icon">📊</span>
            Export CSV
          </button>
          <button className="btn-secondary" onClick={cleanupOldData} style={{ backgroundColor: '#ff4444', color: 'white' }}>
            <span className="btn-icon">🧹</span>
            Clean IDs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <DataSyncStatus />
          <div className="stat-cards">
            <div className="stat-card total">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h4>Total Inquiries</h4>
                <p className="stat-number">{stats.total}</p>
                <span className="stat-label">All time</span>
              </div>
            </div>

            <div className="stat-card month">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h4>This Month</h4>
                <p className="stat-number">{stats.thisMonth}</p>
                <span className="stat-label">Current month</span>
              </div>
            </div>

            <div className="stat-card week">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <h4>This Week</h4>
                <p className="stat-number">{stats.thisWeek}</p>
                <span className="stat-label">Last 7 days</span>
              </div>
            </div>

            <div className="stat-card conversion">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h4>Response Rate</h4>
                <p className="stat-number">
                  {stats.total > 0 ? Math.round(((stats.total - inquiries.filter(i => i.status === 'New').length) / stats.total) * 100) : 0}%
                </p>
                <span className="stat-label">Inquiries processed</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="stat-chart">
              <div className="chart-header">
                <h4>Inquiries by Country</h4>
                <span className="chart-subtitle">Geographic distribution</span>
              </div>
              <div className="chart-bars">
                {Object.entries(stats.byCountry).slice(0, 8).map(([country, count]) => (
                  <div className="chart-bar-item" key={country}>
                    <div className="chart-label">{country}</div>
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="chart-value">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-chart">
              <div className="chart-header">
                <h4>Inquiries by Industry</h4>
                <span className="chart-subtitle">Sector breakdown</span>
              </div>
              <div className="chart-bars">
                {Object.entries(stats.byIndustry).slice(0, 8).map(([industry, count]) => (
                  <div className="chart-bar-item" key={industry}>
                    <div className="chart-label">{industry}</div>
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="chart-value">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-inquiries">
              <div className="chart-header">
                <h4>Recent Inquiries</h4>
                <span className="chart-subtitle">Latest submissions</span>
              </div>
              <div className="recent-list">
                {inquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="recent-item">
                    <div className="recent-info">
                      <div className="recent-name">{inquiry.name || 'N/A'}</div>
                      <div className="recent-company">{inquiry.company || 'N/A'}</div>
                    </div>
                    <div className="recent-meta">
                      <span className={`status-badge ${getStatusClass(inquiry.status)}`}>
                        {inquiry.status || 'New'}
                      </span>
                      <div className="recent-date">{formatDate(inquiry.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Feedback Management
  const renderFeedback = () => (
    <div className="admin-feedback">
      <div className="feedback-header">
        <h3>Customer Feedback Management</h3>
        <div className="feedback-stats">
          <span className="feedback-count">
            {feedback.length} total feedback submissions
          </span>
        </div>
      </div>

      {/* Feedback Insights */}
      <div className="feedback-insights">
        <h4>📊 Feedback Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">⭐</div>
            <div className="insight-content">
              <div className="insight-value">4.6/5</div>
              <div className="insight-label">Average Rating</div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">👍</div>
            <div className="insight-content">
              <div className="insight-value">92%</div>
              <div className="insight-label">Recommendation Rate</div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <div className="insight-value">AI Analytics</div>
              <div className="insight-label">Most Popular Service</div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <div className="insight-value">+15%</div>
              <div className="insight-label">Satisfaction Growth</div>
            </div>
          </div>
        </div>
        <div className="feedback-trends">
          <div className="trend-item">
            <span className="trend-label">🔥 Top Feedback:</span>
            <span className="trend-value">"Excellent AI solutions, very professional team!"</span>
          </div>
          <div className="trend-item">
            <span className="trend-label">💡 Common Request:</span>
            <span className="trend-value">More automation features and faster implementation</span>
          </div>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="no-feedback">
          <div className="no-feedback-icon">💬</div>
          <h4>No Feedback Yet</h4>
          <p>Customer feedback will appear here once submitted through the feedback form.</p>
        </div>
      ) : (
        <div className="feedback-table-container">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Overall Rating</th>
                <th>Recommendation</th>
                <th>Feedback</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map(item => (
                <tr key={item.id} className="feedback-row">
                  <td className="feedback-id">#{item.id}</td>
                  <td className="feedback-date">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="feedback-customer">
                    <div className="customer-info">
                      <div className="customer-name">{item.name}</div>
                      <div className="customer-email">{item.email}</div>
                      {item.company && <div className="customer-company">{item.company}</div>}
                    </div>
                  </td>
                  <td className="feedback-service">
                    <span className="service-badge">{item.serviceUsed}</span>
                  </td>
                  <td className="feedback-rating">
                    <div className="rating-display">
                      <div className="stars-compact">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={star <= item.overallRating ? 'star filled' : 'star'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="rating-number">{item.overallRating}/5</span>
                    </div>
                  </td>
                  <td className="feedback-recommendation">
                    {item.recommendation > 0 ? (
                      <div className="rating-display">
                        <div className="stars-compact">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={star <= item.recommendation ? 'star filled' : 'star'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="rating-number">{item.recommendation}/5</span>
                      </div>
                    ) : (
                      <span className="no-rating">-</span>
                    )}
                  </td>
                  <td className="feedback-text">
                    <div className="feedback-preview">
                      {item.feedback.length > 100
                        ? `${item.feedback.substring(0, 100)}...`
                        : item.feedback
                      }
                    </div>
                  </td>
                  <td className="feedback-status">
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {item.status || 'New'}
                    </span>
                  </td>
                  <td className="feedback-actions">
                    <select
                      value={item.status || 'New'}
                      onChange={(e) => handleFeedbackStatusUpdate(item.id, e.target.value)}
                      className="status-select-compact"
                    >
                      <option value="New">New</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Responded">Responded</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Articles Management
  const renderArticlesManagement = () => (
    <div className="content-management">
      <div className="content-header">
        <h3>📰 Articles Management</h3>
        <button
          className="btn-primary"
          onClick={handleCreateArticle}
        >
          <span className="btn-icon">➕</span>
          Add New Article
        </button>
      </div>

      <div className="content-table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id}>
                <td>#{article.id}</td>
                <td className="content-title">
                  <div className="title-with-image">
                    <img src={article.image} alt={article.title} className="content-thumbnail" />
                    <div>
                      <div className="content-name">{article.title}</div>
                      <div className="content-excerpt">{article.excerpt?.substring(0, 80)}...</div>
                    </div>
                  </div>
                </td>
                <td>{article.author}</td>
                <td>
                  <span className="category-badge">{article.category}</span>
                </td>
                <td>{new Date(article.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${article.status}`}>{article.status}</span>
                </td>
                <td className="content-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditArticle(article.id)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteArticle(article.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Gallery Management
  const renderGalleryManagement = () => (
    <div className="content-management">
      <div className="content-header">
        <h3>📸 Photo Gallery Management</h3>
        <button
          className="btn-primary"
          onClick={handleCreateGalleryEvent}
        >
          <span className="btn-icon">➕</span>
          Add New Gallery Event
        </button>
      </div>

      <div className="content-table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gallery.map(item => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td className="content-title">
                  <div className="title-with-image">
                    <img src={item.image} alt={item.title} className="content-thumbnail" />
                    <div>
                      <div className="content-name">{item.title}</div>
                      <div className="content-excerpt">{item.description?.substring(0, 60)}...</div>
                    </div>
                  </div>
                </td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.location}</td>
                <td>
                  <span className="category-badge">{item.category}</span>
                </td>
                <td>
                  <span className={`status-badge ${item.status}`}>{item.status}</span>
                </td>
                <td className="content-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditGalleryEvent(item.id)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteGalleryEvent(item.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Events Management
  const renderEventsManagement = () => (
    <div className="content-management">
      <div className="content-header">
        <h3>📅 Events Management</h3>
        <button
          className="btn-primary"
          onClick={handleCreateEvent}
        >
          <span className="btn-icon">➕</span>
          Add New Event
        </button>
      </div>

      <div className="content-table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Event</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>#{event.id}</td>
                <td className="content-title">
                  <div className="title-with-image">
                    <img src={event.image} alt={event.title} className="content-thumbnail" />
                    <div>
                      <div className="content-name">{event.title}</div>
                      <div className="content-excerpt">{event.description?.substring(0, 60)}...</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="event-datetime">
                    <div>{new Date(event.date).toLocaleDateString()}</div>
                    <div className="event-time">{event.time}</div>
                  </div>
                </td>
                <td>{event.location}</td>
                <td>
                  <span className="category-badge">{event.category}</span>
                </td>
                <td>
                  <span className={`status-badge ${event.status}`}>{event.status}</span>
                </td>
                <td className="content-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditEvent(event.id)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Inquiries List
  const renderInquiries = () => (
    <div className="admin-inquiries">
      <div className="inquiries-header">
        <h3>Customer Inquiries</h3>
        <div className="inquiries-actions">
          <span className="results-count">
            {filteredInquiries.length} of {inquiries.length} inquiries
          </span>
          <button className="btn-secondary" onClick={exportToCSV}>
            <span className="btn-icon">📊</span>
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading inquiries...</p>
        </div>
      ) : (
        <>
          <div className="inquiries-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="🔍 Search by name, email, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input search-input"
              />
            </div>

            <div className="filter-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in progress">In Progress</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Countries</option>
                {[...new Set(inquiries.map(i => i.country).filter(Boolean))].sort().map(country => (
                  <option key={country} value={country.toLowerCase()}>{country}</option>
                ))}
              </select>

              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Industries</option>
                {[...new Set(inquiries.map(i => i.industry).filter(Boolean))].sort().map(industry => (
                  <option key={industry} value={industry.toLowerCase()}>{industry}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="inquiries-table-container">
            <table className="inquiries-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable">
                    ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('date')} className="sortable">
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Contact {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('company')} className="sortable">
                    Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('country')} className="sortable">
                    Country {sortField === 'country' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('industry')} className="sortable">
                    Industry {sortField === 'industry' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('status')} className="sortable">
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>#{inquiry.id}</td>
                    <td>{formatDate(inquiry.date)}</td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-name">{inquiry.name || 'N/A'}</div>
                        <div className="contact-email">{inquiry.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="company-info">
                        <div className="company-name">{inquiry.company || 'N/A'}</div>
                        <div className="job-title">{inquiry.jobTitle || 'N/A'}</div>
                      </div>
                    </td>
                    <td>{inquiry.country || 'N/A'}</td>
                    <td>{inquiry.industry || 'N/A'}</td>
                    <td>
                      <select
                        value={inquiry.status || 'New'}
                        onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                        className={`status-select ${getStatusClass(inquiry.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-view"
                          onClick={() => handleViewInquiry(inquiry)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          className="btn-email"
                          onClick={() => window.open(`mailto:${inquiry.email}?subject=Re: Your AI-Solution Inquiry`)}
                          title="Send Email"
                        >
                          ✉️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Enhanced Login Form with Security Features
  const renderLoginForm = () => {
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      } else {
        return `${secs}s`;
      }
    };

    const getRemainingLockoutTime = () => {
      if (!isLocked || !lockoutTime) return 0;
      const now = Date.now();
      const remaining = 15 * 60 * 1000 - (now - lockoutTime);
      return Math.max(0, Math.ceil(remaining / 1000 / 60));
    };

    return (
      <div className="admin-login-container">
        <form className={`admin-login-form ${isLocked ? 'locked' : ''}`} onSubmit={handleLogin}>
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h2>Admin Access</h2>
            <p>Secure login to administration panel</p>
          </div>

          {/* Enhanced Security Status Display */}
          {isLocked && (
            <div className="lockout-indicator">
              <h3>🔒 ACCOUNT LOCKED</h3>
              <div className="lockout-countdown" style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
                {getRemainingLockoutTime()} minutes remaining
              </div>
              <p style={{ fontSize: '0.9rem', margin: '0' }}>
                Too many failed login attempts detected.<br/>
                Brute force protection activated.
              </p>
            </div>
          )}

          {!isLocked && loginAttempts > 0 && (
            <div className={`security-status ${loginAttempts >= 2 ? 'warning' : 'info'}`}>
              <span>⚠️</span>
              <span>
                {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}. 
                {' '}{3 - loginAttempts} remaining before lockout.
              </span>
            </div>
          )}

          {error && (
            <div className="error-message" style={{ 
              background: 'rgba(255, 77, 77, 0.1)', 
              border: '1px solid rgba(255, 77, 77, 0.3)',
              color: '#ff4d4d',
              padding: '0.8rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}



          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLocked}
              className={error && !isLocked ? 'error' : ''}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isLocked}
                className={error && !isLocked ? 'error' : ''}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                disabled={isLocked}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || isLocked}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Authenticating...
              </>
            ) : (
              <>
                <span>🔓</span>
                Login to Admin Panel
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="login-theme-toggle">
            <ThemeToggle className="login-theme-toggle-btn" />
          </div>
          <p>AI-Solution Admin Portal</p>
        </div>
      </div>
    );
  };

  // Admin Dashboard
  const renderAdminDashboard = () => (
    <motion.div
      className="admin-dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-header">
        <div className="header-left">
          <div className="admin-logo">
            <span className="logo-icon">🤖</span>
            <div className="logo-text">
              <h2>AI-Solution</h2>
              <span className="logo-subtitle">Admin Dashboard</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="admin-profile">
            <div className="profile-avatar">
              <span className="avatar-icon">👨‍💼</span>
            </div>
            <div className="profile-info">
              <span className="profile-name">{adminProfile.name}</span>
              <span className="profile-role">{adminProfile.role}</span>
            </div>
          </div>
          <ThemeToggle className="admin-theme-toggle" />
          <button className="logout-button" onClick={handleLogout}>
            <span className="btn-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Separate Session Timer - Top Right Corner */}
      <div className="session-timer-container">
        <div className="session-timer-display">
          <div className="timer-icon">⏱️</div>
          <div className="timer-text">
            <div className="timer-label">Session</div>
            <div className="timer-value">
              {Math.floor(sessionTimeLeft / 3600)}h {Math.floor((sessionTimeLeft % 3600) / 60)}m
            </div>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="tab-icon">📊</span>
          Dashboard
        </button>
        <button
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span className="tab-icon">📈</span>
          Real-time Analytics
          <span className="tab-badge live">LIVE</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          <span className="tab-icon">📋</span>
          Inquiries
          {inquiries.filter(i => i.status === 'New').length > 0 && (
            <span className="tab-badge">{inquiries.filter(i => i.status === 'New').length}</span>
          )}
        </button>
        <button
          className={`admin-tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          <span className="tab-icon">💬</span>
          Feedback
          {JSON.parse(localStorage.getItem('ai-solution-feedback') || '[]').filter(f => f.status === 'New').length > 0 && (
            <span className="tab-badge">{JSON.parse(localStorage.getItem('ai-solution-feedback') || '[]').filter(f => f.status === 'New').length}</span>
          )}
        </button>
        <button
          className={`admin-tab ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          <span className="tab-icon">📰</span>
          Articles
        </button>
        <button
          className={`admin-tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <span className="tab-icon">📸</span>
          Gallery
        </button>
        <button
          className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <span className="tab-icon">📅</span>
          Events
        </button>
      </div>

      <div className="admin-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' ? renderDashboard() :
              activeTab === 'analytics' ? <AnalyticsDashboard /> :
                activeTab === 'feedback' ? renderFeedback() :
                  activeTab === 'articles' ? renderArticlesManagement() :
                    activeTab === 'gallery' ? renderGalleryManagement() :
                      activeTab === 'events' ? renderEventsManagement() :
                        renderInquiries()}
          </motion.div>
        </AnimatePresence>
      </div>

      {renderInquiryModal()}
      {renderContentModal()}
    </motion.div>
  );

  return (
    <>
      <section id="admin" className="admin-section">
        <div className="admin-container">
          {isAuthenticated ? renderAdminDashboard() : renderLoginForm()}
        </div>
      </section>
      
      {/* Full-screen editors */}
      {showArticleEditor && (
        <ArticleEditor
          articleId={editingArticleId}
          onClose={handleCloseArticleEditor}
          onSave={() => {
            console.log('Article saved successfully');
          }}
        />
      )}

      {showGalleryEditor && (
        <GalleryEditor
          eventId={editingGalleryId}
          onClose={handleCloseGalleryEditor}
          onSave={() => {
            console.log('Gallery event saved successfully');
          }}
        />
      )}

      {showEventEditor && (
        <EventEditor
          eventId={editingEventId}
          onClose={handleCloseEventEditor}
          onSave={() => {
            console.log('Event saved successfully');
          }}
        />
      )}
    </>
  );
};

export default AdminArea;