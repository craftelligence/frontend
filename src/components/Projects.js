import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Projects.css';

const Projects = () => {
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

  const projects = [
    {
      icon: 'fas fa-brain',
      title: 'Multi-Agent Platform',
      description: 'Built a sophisticated multi-agent platform with planners, retrievers, and coders, backed by optimized vector search for intelligent task execution.',
      technologies: ['Python', 'LangChain', 'Vector DB', 'OpenAI'],
      impact: 'Reduced task completion time by 60%',
      color: '#A259FF'
    },
    {
      icon: 'fas fa-heartbeat',
      title: 'Health-Tech Platform',
      description: 'Delivered a comprehensive health-tech platform including lab bookings, doctor dashboards, and AI medical agent with citation-backed answers.',
      technologies: ['React', 'Node.js', 'AI/ML', 'Healthcare APIs'],
      impact: 'Improved patient engagement by 40%',
      color: '#8B5CF6'
    },
    {
      icon: 'fas fa-network-wired',
      title: 'Digital Twin Systems',
      description: 'Designed and deployed digital twin systems to track and simulate real-world operational systems for predictive analytics.',
      technologies: ['IoT', 'Real-time Analytics', 'Predictive ML', 'Cloud'],
      impact: 'Increased operational efficiency by 35%',
      color: '#7C3AED'
    },
    {
      icon: 'fas fa-microchip',
      title: 'Microservices Migration',
      description: 'Migrated legacy monoliths to async microservices using queues, caching, and modular APIs for improved scalability.',
      technologies: ['Microservices', 'Message Queues', 'Redis', 'Docker'],
      impact: 'Enhanced system performance by 50%',
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
    <section id="projects" className="projects section" ref={ref}>
      <div className="projects-background">
        <div className="projects-pattern"></div>
      </div>
      
      <div className="container">
        <AnimatePresence>
          {shouldAnimate && (
            <motion.h2 
              className="section-title"
              {...(isMobile ? mobileAnimations : desktopAnimations)}
            >
              Work That Speaks for Itself
            </motion.h2>
          )}
        </AnimatePresence>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <AnimatePresence key={index}>
              {shouldAnimate && (
                <motion.div
                  className="project-card"
                  {...(isMobile ? mobileAnimations : {
                    ...desktopAnimations,
                    transition: { duration: 0.6, delay: index * 0.05 }
                  })}
                  whileHover={!isMobile ? { 
                    y: -5,
                    boxShadow: '0 20px 40px rgba(162, 89, 255, 0.15)'
                  } : {}}
                >
                  <div className="project-header">
                    <div className="project-icon" style={{ backgroundColor: project.color }}>
                      <i className={project.icon}></i>
                    </div>
                    <div className="project-title">
                      <h3>{project.title}</h3>
                      <div className="project-impact">
                        <i className="fas fa-chart-line"></i>
                        <span>{project.impact}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-technologies">
                    <h4>Technologies Used:</h4>
                    <div className="tech-tags">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="project-cta">
                    <button className="cta-button secondary">
                      View Details
                      <i className="fas fa-external-link-alt"></i>
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
              className="projects-cta"
              {...(isMobile ? mobileAnimations : {
                ...desktopAnimations,
                transition: { duration: 0.6, delay: 0.3 }
              })}
            >
              <h3>Want to See More?</h3>
              <p>Explore our full portfolio and discover how we've helped businesses scale their operations.</p>
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

export default Projects; 