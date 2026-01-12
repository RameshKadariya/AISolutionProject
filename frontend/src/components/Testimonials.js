import React from 'react';
import './Testimonials.css';
import { motion } from 'framer-motion';

const Testimonials = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'John Smith',
      company: 'Tech Innovations Ltd',
      position: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 5,
      text: 'AI-Solution transformed our business with their custom AI analytics platform. Their team was professional, responsive, and delivered beyond our expectations.',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Global Manufacturing Inc',
      position: 'Operations Director',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 4.5,
      text: 'The predictive maintenance system developed by AI-Solution has been a game-changer for our manufacturing plant. We\'ve seen a 60% reduction in unexpected downtime and maintenance costs.',
    },
    {
      id: 3,
      name: 'Michael Chen',
      company: 'HealthTech Solutions',
      position: 'Head of Innovation',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      rating: 4,
      text: 'Their healthcare data analysis solution helped us identify patterns we never would have seen otherwise. The insights gained have directly improved patient outcomes.',
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      company: 'Retail Dynamics',
      position: 'Marketing Director',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      rating: 5,
      text: 'The customer behavior prediction model AI-Solution built for us increased our conversion rates by 35%. Their understanding of both technology and business needs is impressive.',
    },
    {
      id: 5,
      name: 'David Wilson',
      company: 'Financial Services Group',
      position: 'Risk Assessment Manager',
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
      rating: 4.5,
      text: 'AI-Solution delivered a fraud detection system that has saved us millions. Their attention to security and compliance requirements was exceptional.',
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      company: 'E-Commerce Solutions',
      position: 'CEO',
      image: 'https://randomuser.me/api/portraits/women/6.jpg',
      rating: 5,
      text: 'The AI chatbot and recommendation engine transformed our customer experience. Sales increased by 45% within the first quarter of implementation.',
    },
    {
      id: 7,
      name: 'Robert Taylor',
      company: 'Logistics Pro',
      position: 'Supply Chain Director',
      image: 'https://randomuser.me/api/portraits/men/7.jpg',
      rating: 4.5,
      text: 'Their route optimization AI reduced our delivery times by 30% and fuel costs by 25%. The ROI was evident within the first month.',
    },
    {
      id: 8,
      name: 'Jennifer Lee',
      company: 'Education Tech',
      position: 'Product Manager',
      image: 'https://randomuser.me/api/portraits/women/8.jpg',
      rating: 5,
      text: 'AI-Solution created a personalized learning platform that adapts to each student. Teacher satisfaction and student performance both improved significantly.',
    },
    {
      id: 9,
      name: 'James Martinez',
      company: 'Energy Solutions',
      position: 'Operations Manager',
      image: 'https://randomuser.me/api/portraits/men/9.jpg',
      rating: 4,
      text: 'The predictive energy consumption model helps us optimize our grid management. We have reduced waste by 40% and improved service reliability.',
    },
  ];

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star full">★</span>);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half">★</span>);
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          What Our Clients Say
        </motion.h2>
        
        <div className="testimonials-container">
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id} 
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(255, 136, 0, 0.2)' }}
            >
              <div className="testimonial-header">
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-info">
                  <h3>{testimonial.name}</h3>
                  <p className="position">{testimonial.position}</p>
                  <p className="company">{testimonial.company}</p>
                  <div className="rating">{renderStars(testimonial.rating)}</div>
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;