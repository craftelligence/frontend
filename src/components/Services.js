import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Services.css';

const Services = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Force load after a delay for mobile
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const [ref, inView] = useInView({
    threshold: 0.05, // Even lower threshold
    triggerOnce: true,
    rootMargin: '0px 0px -50px 0px', // Smaller margin
    fallbackInView: true // Fallback for older browsers
  });

  const services = [
    {
      icon: 'fas fa-robot',
      title: 'Agentic Platforms',
      description: 'Build multi-agent LLM-powered systems that work together to solve complex problems.',
      features: ['Multi-agent coordination', 'LLM integration', 'Intelligent task execution', 'Scalable architecture'],
      color: '#A259FF'
    },
    {
      icon: 'fas fa-cube',
      title: 'Digital Twin Solutions',
      description: 'Real-time system modeling & insights for operational optimization.',
      features: ['Real-time monitoring', 'Predictive analytics', 'System simulation', 'Performance optimization'],
      color: '#8B5CF6'
    },
    {
      icon: 'fas fa-cloud',
      title: 'SaaS Product Development',
      description: 'Full cloud-native applications built for scale and performance.',
      features: ['Cloud-native architecture', 'Microservices', 'Auto-scaling', 'High availability'],
      color: '#7C3AED'
    },
    {
      icon: 'fas fa-code',
      title: 'Software & Web Applications',
      description: 'Custom backend, APIs, admin panels, and web applications.',
      features: ['Custom APIs', 'Admin dashboards', 'Web applications', 'Database design'],
      color: '#6D28D9'
    }
  ];

  // Simplified animations for mobile
  const mobileAnimations = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  };

  const desktopAnimations = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const shouldAnimate = inView || isLoaded || isMobile;

  return (
    <section id="services" className="services section" ref={ref}>
      <div className="services-background">
        <div className="services-grid-pattern"></div>
      </div>
      
      <div className="container">
        <AnimatePresence>
          {shouldAnimate && (
            <motion.h2 
              className="section-title"
              {...(isMobile ? mobileAnimations : desktopAnimations)}
            >
              What We Do
            </motion.h2>
          )}
        </AnimatePresence>

        <div className="services-grid">
          {services.map((service, index) => (
            <AnimatePresence key={index}>
              {shouldAnimate && (
                <motion.div
                  className="service-card"
                  {...(isMobile ? mobileAnimations : {
                    ...desktopAnimations,
                    transition: { duration: 0.6, delay: index * 0.05 }
                  })}
                  whileHover={!isMobile ? { 
                    y: -5,
                    boxShadow: '0 20px 40px rgba(162, 89, 255, 0.15)'
                  } : {}}
                >
                  <div className="service-header">
                    <div className="service-icon" style={{ backgroundColor: service.color }}>
                      <i className={service.icon}></i>
                    </div>
                    <h3>{service.title}</h3>
                  </div>
                  
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-features">
                    <h4>Key Features:</h4>
                    <ul>
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>
                          <i className="fas fa-check"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="service-cta">
                    <button className="cta-button secondary">
                      Learn More
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        <AnimatePresence>
          {shouldAnimate && (
            <motion.div 
              className="services-cta"
              {...(isMobile ? mobileAnimations : {
                ...desktopAnimations,
                transition: { duration: 0.6, delay: 0.3 }
              })}
            >
              <h3>Ready to Build Something Amazing?</h3>
              <p>Let's discuss your project and see how we can help you scale.</p>
              <button 
                className="cta-button"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Project
                <i className="fas fa-rocket"></i>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Services; 