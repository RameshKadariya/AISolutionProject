import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);

  // Default Articles Data (from the actual Articles component)
  const getDefaultArticles = () => [
    {
      id: 1,
      title: 'How AI is Transforming Customer Service',
      excerpt: 'Discover how our AI solutions are helping businesses provide better customer experiences with intelligent automation and personalized interactions.',
      content: 'Artificial Intelligence is revolutionizing the way businesses interact with their customers. Our advanced AI solutions provide intelligent automation and personalized interactions that enhance customer satisfaction while reducing operational costs.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      date: 'December 10, 2023',
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
      date: 'November 28, 2023',
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
      date: 'November 15, 2023',
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
      date: 'October 30, 2023',
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
      date: 'October 18, 2023',
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
      date: 'October 5, 2023',
      author: 'Maria Rodriguez',
      category: 'sustainability',
      readTime: '6 min read',
      status: 'published'
    }
  ];

  // Default Gallery Data (Enhanced with more images and events)
  const getDefaultGallery = () => [
    {
      id: 1,
      title: 'AI Summit 2024',
      date: 'March 15, 2024',
      location: 'London Tech Hub',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Our team showcasing the latest AI innovations at the annual AI Summit with over 5,000 attendees.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 2,
      title: 'Industry Partnership Launch',
      date: 'May 22, 2024',
      location: 'Global Innovation Center',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Celebrating our strategic partnership with Fortune 500 companies and tech giants.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 3,
      title: 'Tech Expo 2024',
      date: 'July 10, 2024',
      location: 'Convention Center',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Showcasing our AI solutions at the largest tech expo with live demonstrations and interactive booths.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1581092921461-39b9d08a9b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 4,
      title: 'AI in Healthcare Symposium',
      date: 'September 5, 2024',
      location: 'Medical Research Center',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Presenting breakthrough healthcare AI solutions to medical professionals and researchers.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 5,
      title: 'Innovation Awards 2024',
      date: 'October 18, 2024',
      location: 'Grand Hotel',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Receiving multiple awards including "Most Innovative AI Solution" and "Best Tech Startup".',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 6,
      title: 'Community Tech Workshop',
      date: 'November 12, 2024',
      location: 'Community Center',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Hosting educational workshops to introduce AI concepts to students and local community.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 7,
      title: 'Global AI Conference 2024',
      date: 'December 8, 2024',
      location: 'Silicon Valley Convention Center',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Keynote presentation on the future of AI and machine learning technologies.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 8,
      title: 'Startup Pitch Competition',
      date: 'August 25, 2024',
      location: 'Innovation Hub',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Winning first place in the national startup pitch competition with our AI platform.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 9,
      title: 'AI Research Symposium',
      date: 'June 14, 2024',
      location: 'University Research Center',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Presenting our latest research findings on neural networks and deep learning algorithms.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1581092921461-39b9d08a9b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 10,
      title: 'Corporate Training Sessions',
      date: 'April 20, 2024',
      location: 'Corporate Training Center',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Conducting AI training sessions for enterprise clients and corporate partners.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 23,
      title: 'AI Product Launch Event',
      date: 'February 8, 2024',
      location: 'Tech Launch Venue',
      image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Grand launch of our revolutionary AI platform with live demonstrations and customer testimonials.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 24,
      title: 'International AI Collaboration',
      date: 'January 15, 2024',
      location: 'Global Partnership Center',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Signing strategic partnerships with international AI research institutions and tech companies.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 25,
      title: 'AI Research Breakthrough Announcement',
      date: 'March 3, 2024',
      location: 'Research Institute Auditorium',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Announcing our groundbreaking research in quantum-enhanced machine learning algorithms.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    },
    {
      id: 26,
      title: 'Green AI Initiative Launch',
      date: 'May 10, 2024',
      location: 'Sustainability Center',
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Launching our commitment to sustainable AI development and carbon-neutral computing.',
      category: 'promotional',
      status: 'active',
      gallery: [
        'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1497436072909-f5e4be1dffea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
      ]
    }
  ];

  // Default Events Data (Future events with proper dates and event programs)
  const getDefaultEvents = () => [
    {
      id: 11,
      title: 'AI Future Conference 2025',
      description: 'Join us at the AI Future Conference where we will unveil our next-generation AI solutions and breakthrough technologies.',
      date: 'October 15, 2025',
      time: '09:00 AM - 6:00 PM',
      location: 'Future Tech Campus, San Francisco',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'conference',
      status: 'upcoming',
      registrationUrl: 'https://example.com/ai-future-conference',
      program: [
        '9:00 AM - Registration & Welcome Coffee',
        '10:00 AM - Keynote: The Future of AI',
        '11:30 AM - Panel: AI in Healthcare',
        '1:00 PM - Lunch & Networking',
        '2:30 PM - Workshop: Building AI Solutions',
        '4:00 PM - Demo: Our Latest AI Platform',
        '5:30 PM - Q&A and Closing Remarks'
      ],
      speakers: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Alex Rodriguez'],
      price: '$299 Early Bird / $399 Regular'
    },
    {
      id: 12,
      title: 'Global AI Summit 2025',
      description: 'We will be keynote speakers at the Global AI Summit, discussing the future of AI in business and society.',
      date: 'November 22, 2025',
      time: '8:00 AM - 7:00 PM',
      location: 'International Convention Center, New York',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'conference',
      status: 'upcoming',
      registrationUrl: 'https://example.com/global-ai-summit',
      program: [
        '8:00 AM - Registration & Breakfast',
        '9:00 AM - Opening Keynote: AI Revolution',
        '10:30 AM - Track A: AI in Business',
        '10:30 AM - Track B: AI Ethics & Society',
        '12:00 PM - Networking Lunch',
        '1:30 PM - Panel: Global AI Policies',
        '3:00 PM - Workshops & Demos',
        '5:00 PM - Awards Ceremony',
        '6:00 PM - Closing Reception'
      ],
      speakers: ['Elon Musk', 'Sundar Pichai', 'Fei-Fei Li', 'Andrew Ng'],
      price: '$599 VIP / $399 Standard / $199 Student'
    },
    {
      id: 13,
      title: 'Industry 4.0 Manufacturing Expo',
      description: 'Showcasing our revolutionary manufacturing AI solutions and smart factory technologies at the premier industry expo.',
      date: 'December 10-12, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'Manufacturing Innovation Hub, Detroit',
      image: 'https://images.unsplash.com/photo-1581092921461-39b9d08a9b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'expo',
      status: 'upcoming',
      registrationUrl: 'https://example.com/industry-4-expo',
      program: [
        'Day 1: Smart Factory Solutions',
        'Day 2: AI-Powered Quality Control',
        'Day 3: Robotics & Automation',
        'Live Demos: Our AI Manufacturing Platform',
        'Workshops: Implementing Industry 4.0',
        'Networking: Meet Industry Leaders'
      ],
      speakers: ['Manufacturing CEOs', 'AI Engineers', 'Robotics Experts'],
      price: '$199 per day / $499 full expo pass'
    },
    {
      id: 14,
      title: 'AI in Finance Summit 2026',
      description: 'Presenting our cutting-edge financial AI solutions, fraud detection systems, and algorithmic trading platforms.',
      date: 'January 25, 2026',
      time: '10:00 AM - 5:00 PM',
      location: 'Financial District Conference Center, London',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'summit',
      status: 'upcoming',
      registrationUrl: 'https://example.com/ai-finance-summit',
      program: [
        '10:00 AM - Welcome & Registration',
        '10:30 AM - Keynote: AI Transforming Finance',
        '11:30 AM - Panel: Fraud Detection with AI',
        '1:00 PM - Lunch & Networking',
        '2:00 PM - Workshop: Algorithmic Trading',
        '3:30 PM - Demo: Our FinTech AI Platform',
        '4:30 PM - Q&A and Future Outlook'
      ],
      speakers: ['Bank CEOs', 'FinTech Leaders', 'AI Researchers'],
      price: '$449 Professional / $299 Early Bird'
    },
    {
      id: 15,
      title: 'Advanced ML Workshop Series',
      description: 'Comprehensive hands-on workshops covering advanced machine learning techniques and practical applications.',
      date: 'February 18-20, 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'Tech Education Center, Seattle',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'workshop',
      status: 'upcoming',
      registrationUrl: 'https://example.com/ml-workshop-series',
      program: [
        'Day 1: Deep Learning Fundamentals',
        'Day 2: Neural Network Architectures',
        'Day 3: Real-world ML Applications',
        'Hands-on Labs with Python & TensorFlow',
        'Project: Build Your Own AI Model',
        'Certificate of Completion'
      ],
      speakers: ['ML Engineers', 'Data Scientists', 'AI Researchers'],
      price: '$799 full series / $299 per day'
    },
    {
      id: 16,
      title: 'AI Ethics & Governance Forum',
      description: 'Leading discussions on responsible AI development, ethics, and governance frameworks for the future.',
      date: 'March 15, 2026',
      time: '1:00 PM - 6:00 PM',
      location: 'Ethics Institute, Boston',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'forum',
      status: 'upcoming',
      registrationUrl: 'https://example.com/ai-ethics-forum',
      program: [
        '1:00 PM - Registration & Welcome',
        '1:30 PM - Keynote: Responsible AI Development',
        '2:30 PM - Panel: AI Bias and Fairness',
        '3:30 PM - Break & Networking',
        '4:00 PM - Workshop: Ethical AI Guidelines',
        '5:00 PM - Discussion: Future AI Governance',
        '5:45 PM - Closing Remarks'
      ],
      speakers: ['Ethics Professors', 'Policy Makers', 'AI Ethicists'],
      price: 'Free (Registration Required)'
    },
    {
      id: 17,
      title: 'Quantum AI Research Symposium',
      description: 'Exploring the intersection of quantum computing and artificial intelligence for next-generation solutions.',
      date: 'April 18, 2026',
      time: '11:00 AM - 5:00 PM',
      location: 'Quantum Research Facility, MIT',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'symposium',
      status: 'upcoming',
      registrationUrl: 'https://example.com/quantum-ai-symposium',
      program: [
        '11:00 AM - Welcome & Introduction',
        '11:30 AM - Keynote: Quantum Computing Basics',
        '12:30 PM - Panel: Quantum AI Applications',
        '1:30 PM - Lunch Break',
        '2:30 PM - Workshop: Quantum Algorithms',
        '4:00 PM - Demo: Quantum AI Platform',
        '4:45 PM - Future Research Directions'
      ],
      speakers: ['Quantum Physicists', 'AI Researchers', 'Tech Leaders'],
      price: '$199 Academic / $399 Industry'
    },
    {
      id: 18,
      title: 'Robotics & AI Integration Expo',
      description: 'Showcasing the latest in robotics powered by artificial intelligence and machine learning.',
      date: 'May 22, 2026',
      time: '10:00 AM - 6:00 PM',
      location: 'Robotics Innovation Center, Tokyo',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'expo',
      status: 'upcoming',
      registrationUrl: 'https://example.com/robotics-ai-expo',
      program: [
        'Live Robot Demonstrations',
        'AI-Powered Automation Showcase',
        'Industrial Robotics Solutions',
        'Service Robot Applications',
        'Hands-on Robot Programming',
        'Future of Human-Robot Collaboration'
      ],
      speakers: ['Robotics Engineers', 'AI Specialists', 'Industry Leaders'],
      price: '$149 General / $99 Student'
    },
    {
      id: 19,
      title: 'AI for Climate Solutions Summit',
      description: 'Demonstrating how AI technologies can help solve climate change and environmental challenges.',
      date: 'June 15, 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'Green Tech Convention Center, Copenhagen',
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'summit',
      status: 'upcoming',
      registrationUrl: 'https://example.com/ai-climate-summit',
      program: [
        '9:00 AM - Opening: AI for Sustainability',
        '10:00 AM - Case Study: Smart Energy Grids',
        '11:00 AM - Panel: Climate Prediction Models',
        '12:00 PM - Lunch & Networking',
        '1:00 PM - Workshop: Carbon Footprint AI',
        '2:30 PM - Demo: Environmental Monitoring',
        '3:30 PM - Action Plan for the Future'
      ],
      speakers: ['Climate Scientists', 'Environmental Engineers', 'Policy Makers'],
      price: '$299 Professional / Free for NGOs'
    },
    {
      id: 20,
      title: 'AI Startup Accelerator Demo Day',
      description: 'Presenting our portfolio companies and latest AI startup investments to venture capitalists.',
      date: 'July 20, 2026',
      time: '2:00 PM - 7:00 PM',
      location: 'Venture Capital Hub, Silicon Valley',
      image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'demo',
      status: 'upcoming',
      registrationUrl: 'https://example.com/startup-demo-day',
      program: [
        '2:00 PM - Welcome & Networking',
        '2:30 PM - Startup Pitch Session 1',
        '3:30 PM - Break & Investor Meetings',
        '4:00 PM - Startup Pitch Session 2',
        '5:00 PM - Panel: Future of AI Startups',
        '6:00 PM - Awards & Recognition',
        '6:30 PM - Closing Reception'
      ],
      speakers: ['Startup Founders', 'VCs', 'Angel Investors'],
      price: 'Invitation Only'
    },
    {
      id: 21,
      title: 'Advanced Neural Networks Conference',
      description: 'Deep dive into cutting-edge neural network architectures and breakthrough research.',
      date: 'August 25, 2026',
      time: '9:00 AM - 6:00 PM',
      location: 'AI Research Institute, Stanford',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'conference',
      status: 'upcoming',
      registrationUrl: 'https://example.com/neural-networks-conference',
      program: [
        '9:00 AM - Registration & Coffee',
        '9:30 AM - Keynote: Future of Neural Networks',
        '10:30 AM - Track A: Transformer Architectures',
        '10:30 AM - Track B: Computer Vision Networks',
        '12:00 PM - Lunch & Poster Session',
        '1:30 PM - Workshop: Building Custom Networks',
        '3:00 PM - Panel: Research Breakthroughs',
        '4:30 PM - Demo: Latest AI Models',
        '5:30 PM - Networking Reception'
      ],
      speakers: ['AI Researchers', 'ML Engineers', 'Tech Leaders'],
      price: '$399 Professional / $199 Academic'
    },
    {
      id: 22,
      title: 'Next-Gen AI Applications Workshop',
      description: 'Hands-on workshop exploring emerging AI applications across various industries and sectors.',
      date: 'September 18, 2026',
      time: '10:00 AM - 4:00 PM',
      location: 'Innovation Lab Complex, Austin',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      category: 'workshop',
      status: 'upcoming',
      registrationUrl: 'https://example.com/nextgen-ai-workshop',
      program: [
        '10:00 AM - Welcome & Setup',
        '10:30 AM - Lab 1: Computer Vision Apps',
        '12:00 PM - Lunch Break',
        '1:00 PM - Lab 2: NLP Applications',
        '2:30 PM - Lab 3: Recommendation Systems',
        '3:30 PM - Project Presentations',
        '4:00 PM - Wrap-up & Certificates'
      ],
      speakers: ['Hands-on Instructors', 'Industry Practitioners'],
      price: '$199 (includes materials and lunch)'
    }
  ];

  // Load data from localStorage or use defaults
  useEffect(() => {
    const loadedArticles = JSON.parse(localStorage.getItem('ai-solution-articles') || 'null');
    const loadedGallery = JSON.parse(localStorage.getItem('ai-solution-gallery') || 'null');
    const loadedEvents = JSON.parse(localStorage.getItem('ai-solution-events') || 'null');

    const defaultArticles = getDefaultArticles();
    const defaultGallery = getDefaultGallery();
    const defaultEvents = getDefaultEvents();

    // Only use defaults if no data exists in localStorage
    setArticles(loadedArticles || defaultArticles);
    setGallery(loadedGallery || defaultGallery);
    setEvents(loadedEvents || defaultEvents);

    // Only save defaults if no data exists in localStorage
    if (!loadedArticles) {
      localStorage.setItem('ai-solution-articles', JSON.stringify(defaultArticles));
    }
    if (!loadedGallery) {
      localStorage.setItem('ai-solution-gallery', JSON.stringify(defaultGallery));
    }
    if (!loadedEvents) {
      localStorage.setItem('ai-solution-events', JSON.stringify(defaultEvents));
    }
  }, []);

  // Update functions
  const updateArticles = (newArticles) => {
    setArticles(newArticles);
    localStorage.setItem('ai-solution-articles', JSON.stringify(newArticles));
  };

  const updateGallery = (newGallery) => {
    setGallery(newGallery);
    localStorage.setItem('ai-solution-gallery', JSON.stringify(newGallery));
  };

  const updateEvents = (newEvents) => {
    setEvents(newEvents);
    localStorage.setItem('ai-solution-events', JSON.stringify(newEvents));
  };

  // Get published/active content only for public display (computed values)
  const publishedArticles = articles.filter(article => article.status === 'published');
  const activeGallery = gallery.filter(item => item.status === 'active');
  const upcomingEvents = events.filter(event => event.status === 'upcoming');

  const value = {
    // All data (for admin)
    articles,
    gallery,
    events,

    // Update functions
    updateArticles,
    updateGallery,
    updateEvents,

    // Filtered data (for public display) - now reactive
    publishedArticles,
    activeGallery,
    upcomingEvents
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentContext;