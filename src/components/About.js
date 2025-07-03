import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './About.css';

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '0px 0px -100px 0px'
  });

  const features = [
    {
      icon: 'fas fa-users',
      title: 'Flexible Engagement',
      description: 'Full project ownership or embedded devs',
      color: '#A259FF'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '100% Client-Owned IP',
      description: 'All code and intellectual property belongs to you',
      color: '#8B5CF6'
    },
    {
      icon: 'fas fa-file-contract',
      title: 'NDA Ready',
      description: 'Comfortable signing non-disclosure agreements',
      color: '#7C3AED'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Fast Delivery',
      description: 'Transparent, fast delivery cycles',
      color: '#6D28D9'
    }
  ];

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="about-background">
        <div className="about-pattern"></div>
      </div>
      
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h2>

        <div className="about-content">
          <motion.div 
            className="about-text-section"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="about-text">
              <h3>Remote-First Engineering Excellence</h3>
              <p>
                Craftelligence is a remote-first engineering team helping startups and enterprises 
                design and deliver scalable backend systems, agentic platforms, SaaS products, 
                and AI-powered solutions. We offer end-to-end project execution or dedicated 
                developer support depending on client needs.
              </p>
              <p>
                Our team operates globally, bringing together diverse expertise to create 
                innovative solutions that drive business growth and technological advancement.
              </p>
            </div>
            
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Projects Delivered</span>
              </div>
              <div className="stat">
                <span className="stat-number">3+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="about-features"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 15px 30px rgba(162, 89, 255, 0.15)'
                }}
              >
                <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                  <i className={feature.icon}></i>
                </div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 