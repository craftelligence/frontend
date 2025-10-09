import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Projects.css';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const modalContentRef = useRef(null);

  const projects = [
    {
      icon: 'fas fa-brain',
      title: 'EvidenceMD.ai',
      category: 'Healthcare AI',
      gradient: 'linear-gradient(135deg, rgba(0, 255, 102, 0.25), rgba(0, 200, 255, 0.2))',
      bgColor: 'rgba(0, 255, 102, 0.12)',
      accentColor: '#00ff66',
      glowColor: 'rgba(0, 255, 102, 0.4)',
      shortDescription: 'Full-stack evidence-based AI assistant for healthcare professionals with verified, data-backed medical responses.',
      fullDescription: 'A healthcare-focused AI platform designed to provide clinicians with accurate, evidence-backed medical insights in real-time.',
      challenge: 'Healthcare professionals needed instant access to verified medical information with proper citations and compliance with data security standards.',
      solution: 'Built a comprehensive LLM-powered platform that retrieves evidence-based medical data, ensuring HIPAA-like compliance while delivering real-time contextual answers.',
      technologies: ['React', 'FastAPI', 'PostgreSQL', 'LangChain', 'AWS', 'Redis', 'Docker', 'Python', 'TensorFlow'],
      highlights: [
        'Architected the complete LLM integration pipeline for evidence retrieval with citation tracking',
        'Designed secure backend APIs with role-based access control and user management',
        'Created a responsive, scalable frontend optimized for medical data rendering',
        'Ensured HIPAA-like compliance standards for data security and patient privacy',
        'Implemented caching layer with Redis for faster response times',
        'Deployed on AWS with auto-scaling capabilities for high availability'
      ],
      results: '95% accuracy in medical information retrieval, 40% faster clinical decision-making',
      hasImages: true,
      images: [
        '/EvidenceMD.png',
        '/EvidenceMD2.png',
        '/EvidenceMD3.png',
        '/EvidenceMD4.png'
      ]
    },
    {
      icon: 'fas fa-file-contract',
      title: 'AU Legal Docs Platform',
      category: 'Legal Tech',
      gradient: 'linear-gradient(135deg, rgba(138, 43, 226, 0.25), rgba(75, 0, 130, 0.2))',
      bgColor: 'rgba(138, 43, 226, 0.12)',
      accentColor: '#8a2be2',
      glowColor: 'rgba(138, 43, 226, 0.4)',
      shortDescription: 'Automated legal documentation platform for Australian Wills and Power of Attorney with secure payments and compliance.',
      fullDescription: 'A fully automated legal documentation service for generating compliant Will and Power of Attorney templates for Australian users with built-in compliance checks.',
      challenge: 'Legal document creation was time-consuming and expensive, requiring manual lawyer involvement for standard templates.',
      solution: 'Developed an automated platform that guides users through questionnaires, generates legally compliant documents, and handles secure payments with full audit trails.',
      technologies: ['FastAPI', 'Next.js', 'PostgreSQL', 'AWS Cognito', 'SES', 'S3', 'Stripe API', 'Lambda', 'CloudFront'],
      highlights: [
        'Implemented complete document flow: questionnaire → validation → PDF generation → payment → secure download',
        'Integrated AWS Cognito for regional authentication with Australian data residency requirements',
        'Built Stripe integration for secure payment processing with automatic refund handling',
        'Developed comprehensive admin dashboard with ticketing system, refunds, and audit logs',
        'Ensured Australian legal compliance with data encryption and lifecycle management',
        'Implemented email notification system using AWS SES for document delivery'
      ],
      results: '85% reduction in document creation time, 1000+ documents generated in first 6 months',
      hasImages: false
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Community 365',
      category: 'Safety & Security',
      gradient: 'linear-gradient(135deg, rgba(255, 99, 71, 0.25), rgba(255, 69, 0, 0.2))',
      bgColor: 'rgba(255, 99, 71, 0.12)',
      accentColor: '#ff6347',
      glowColor: 'rgba(255, 99, 71, 0.4)',
      shortDescription: 'React Native safety app with real-time SOS alerts, geofencing, and trusted circle notifications for community safety.',
      fullDescription: 'A mobile-first safety application enabling real-time community alerts, personal safety notifications, and trusted circle communications with geofencing capabilities.',
      challenge: 'Communities needed a reliable way to share safety alerts instantly while maintaining privacy and preventing alert fatigue.',
      solution: 'Built a comprehensive mobile app with real-time alert systems, geofencing, and a "Trusted Circle" feature that notifies close contacts before broadcasting to the wider community.',
      technologies: ['React Native', 'FastAPI', 'PostgreSQL', 'Redis', 'FCM', 'Twilio', 'Google Maps API', 'WebSockets', 'Docker'],
      highlights: [
        'Developed real-time SOS alert system with one-tap emergency broadcasting',
        'Implemented geofencing with map visualization for location-based alerts',
        'Integrated push notifications (FCM) and SMS alerts via Twilio for instant delivery',
        'Designed "Trusted Circle" feature to notify family/friends before community broadcast',
        'Built admin APIs for alert management, filtering, and real-time monitoring dashboard',
        'Implemented WebSocket connections for live alert updates'
      ],
      results: '10,000+ active users, 99.9% alert delivery success rate, average response time under 2 seconds',
      hasImages: false
    },
    {
      icon: 'fas fa-project-diagram',
      title: 'Asper AI',
      category: 'Enterprise AI',
      gradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 165, 0, 0.2))',
      bgColor: 'rgba(255, 165, 0, 0.12)',
      accentColor: '#ffa500',
      glowColor: 'rgba(255, 165, 0, 0.4)',
      shortDescription: 'ML-powered ontology generation and data harmonization platform with knowledge graph automation for enterprises.',
      fullDescription: 'An intelligent ontology generation and data harmonization system designed for enterprise knowledge automation using graph databases and machine learning.',
      challenge: 'Enterprise data silos prevented unified knowledge management, requiring manual data mapping and ontology creation.',
      solution: 'Engineered an ML pipeline that automatically generates ontologies and harmonizes data across systems using knowledge graphs and agentic AI workflows.',
      technologies: ['Python', 'FastAPI', 'Neo4j', 'Azure', 'LLMs', 'Machine Learning', 'Graph Embeddings', 'PyTorch', 'Celery'],
      highlights: [
        'Built ML pipeline for automated ontology layer creation with 90% accuracy',
        'Implemented data harmonization algorithms for cross-system integration',
        'Integrated agentic workflows using LLMs for context-driven AI operations',
        'Deployed knowledge graph-based systems to unify disparate enterprise data sources',
        'Developed scalable backend with FastAPI and Azure cloud integration',
        'Created graph embeddings for semantic similarity and relationship detection'
      ],
      results: '70% reduction in manual data mapping efforts, unified 15+ data sources',
      hasImages: false
    }
  ];

  const openModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    setScrollOpacity(1);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const openImageFullscreen = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeImageFullscreen = () => {
    setSelectedImage(null);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const maxScroll = e.target.scrollHeight - e.target.clientHeight;
    const scrollPercentage = scrollTop / maxScroll;
    
    const newOpacity = Math.max(0.3, 1 - (scrollPercentage * 0.7));
    setScrollOpacity(newOpacity);
  };

  useEffect(() => {
    if (selectedProject && modalContentRef.current) {
      const modalContent = modalContentRef.current;
      modalContent.addEventListener('scroll', handleScroll);
      
      return () => {
        modalContent.removeEventListener('scroll', handleScroll);
      };
    }
  }, [selectedProject]);

  return (
    <section id="projects" className="projects-section">
      <div className="projects-bg-grid"></div>

      {/* Animated Floating Shapes */}
      <div className="floating-shapes">
        <motion.div 
          className="floating-shape shape-1"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-shape shape-2"
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-shape shape-3"
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-shape shape-4"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Floating People Illustrations */}
      <div className="floating-people">
        <motion.div 
          className="person person-1"
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="person-circle">👨‍💻</div>
        </motion.div>
        <motion.div 
          className="person person-2"
          animate={{
            y: [0, 25, 0],
            rotate: [5, -5, 5],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="person-circle">👩‍💼</div>
        </motion.div>
        <motion.div 
          className="person person-3"
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="person-circle">👨‍🔬</div>
        </motion.div>
        <motion.div 
          className="person person-4"
          animate={{
            y: [0, 20, 0],
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="person-circle">👩‍🎨</div>
        </motion.div>
      </div>

      <div className="projects-container">
        <div className="projects-header">
          <span className="projects-label">Our Work</span>
          <h2 className="projects-main-title">Work That Speaks for Itself</h2>
          <p className="projects-intro">
            Real projects, real impact. Explore our portfolio of cutting-edge solutions that drive business growth.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
                <motion.div
              key={index}
                  className="project-card"
              style={{ 
                background: project.gradient,
                borderColor: project.accentColor,
                boxShadow: `0 15px 50px ${project.glowColor}`
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: `0 25px 70px ${project.glowColor}`
              }}
              onClick={() => openModal(project)}
            >
              <div className="card-header">
                <div className="card-icon-wrapper" style={{ 
                  backgroundColor: project.bgColor,
                  borderColor: project.accentColor,
                  boxShadow: `0 0 20px ${project.glowColor}`
                }}>
                  <i className={project.icon} style={{ color: project.accentColor }}></i>
                    </div>
                <span className="card-category" style={{ 
                  backgroundColor: project.bgColor,
                  borderColor: project.accentColor,
                  color: project.accentColor
                }}>{project.category}</span>
                  </div>
                  
              <h3 className="card-title">{project.title}</h3>
              <p className="card-description">{project.shortDescription}</p>

              <div className="card-footer" style={{ borderTopColor: project.accentColor }}>
                <span className="view-details" style={{ color: project.accentColor }}>View Details</span>
                <i className="fas fa-arrow-right" style={{ color: project.accentColor }}></i>
              </div>
            </motion.div>
                      ))}
                    </div>
                  </div>
                  
      {/* Modal with Beautiful Animation */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeModal}
            >
              <motion.div
                ref={modalContentRef}
                className="modal-content"
                style={{
                  borderColor: selectedProject.accentColor,
                  boxShadow: `0 40px 100px ${selectedProject.glowColor}`
                }}
                initial={{ 
                  scale: 0.5, 
                  opacity: 0, 
                  rotateX: -15,
                  y: 100
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotateX: 0,
                  y: 0
                }}
                exit={{ 
                  scale: 0.5, 
                  opacity: 0,
                  rotateX: 15,
                  y: -100
                }}
                transition={{ 
                  type: 'spring',
                  damping: 20,
                  stiffness: 300
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button 
                  className="modal-close" 
                  onClick={closeModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ opacity: scrollOpacity }}
                >
                  <i className="fas fa-times"></i>
                </motion.button>

                <motion.div 
                  className="modal-header"
                  style={{
                    borderBottomColor: selectedProject.accentColor + '40',
                    background: `linear-gradient(135deg, ${selectedProject.accentColor}20, transparent)`
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="modal-icon" style={{ 
                    backgroundColor: selectedProject.bgColor,
                    borderColor: selectedProject.accentColor,
                    boxShadow: `0 0 30px ${selectedProject.glowColor}`
                  }}>
                    <i className={selectedProject.icon} style={{ color: selectedProject.accentColor }}></i>
                  </div>
                  <div className="modal-title-section">
                    <span className="modal-category" style={{ 
                      backgroundColor: selectedProject.bgColor,
                      borderColor: selectedProject.accentColor,
                      color: selectedProject.accentColor
                    }}>{selectedProject.category}</span>
                    <h2>{selectedProject.title}</h2>
                    <p className="modal-overview">{selectedProject.fullDescription}</p>
                  </div>
                </motion.div>

                <div className="modal-body">
                  {/* Project Images Gallery (only for EvidenceMD.ai) */}
                  {selectedProject.hasImages && (
                    <motion.div 
                      className="modal-section project-gallery"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 style={{ color: selectedProject.accentColor }}>
                        <i className="fas fa-images"></i> Project Showcase
                      </h3>
                      <div className="gallery-grid">
                        {selectedProject.images.map((img, idx) => (
                          <motion.div
                            key={idx}
                            className="gallery-item"
                            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ 
                              delay: 0.4 + idx * 0.15,
                              type: 'spring',
                              stiffness: 100
                            }}
                            whileHover={{ 
                              scale: 1.05,
                              zIndex: 10,
                              boxShadow: `0 15px 40px ${selectedProject.glowColor}`
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              borderColor: selectedProject.accentColor,
                              cursor: 'pointer'
                            }}
                            onClick={() => openImageFullscreen(img)}
                          >
                            <img 
                              src={img} 
                              alt={`${selectedProject.title} screenshot ${idx + 1}`}
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/600x400/${selectedProject.accentColor.slice(1)}/ffffff?text=Screenshot+${idx + 1}`;
                              }}
                            />
                            <div 
                              className="gallery-overlay"
                              style={{
                                background: `linear-gradient(135deg, ${selectedProject.accentColor}80, transparent)`
                              }}
                            >
                              <i className="fas fa-search-plus"></i>
                            </div>
                          </motion.div>
                        ))}
                  </div>
                </motion.div>
              )}

                  <motion.div 
                    className="modal-section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: selectedProject.hasImages ? 1.0 : 0.3 }}
                  >
                    <h3 style={{ color: selectedProject.accentColor }}>
                      <i className="fas fa-exclamation-circle"></i> The Challenge
                    </h3>
                    <p>{selectedProject.challenge}</p>
                  </motion.div>

                  <motion.div 
                    className="modal-section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: selectedProject.hasImages ? 1.1 : 0.4 }}
                  >
                    <h3 style={{ color: selectedProject.accentColor }}>
                      <i className="fas fa-lightbulb"></i> The Solution
                    </h3>
                    <p>{selectedProject.solution}</p>
                  </motion.div>

                  <motion.div 
                    className="modal-section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: selectedProject.hasImages ? 1.2 : 0.5 }}
                  >
                    <h3 style={{ color: selectedProject.accentColor }}>
                      <i className="fas fa-code"></i> Tech Stack
                    </h3>
                    <div className="modal-tech-stack">
                      {selectedProject.technologies.map((tech, idx) => (
                        <motion.span 
                          key={idx} 
                          className="modal-tech-tag"
                          style={{
                            backgroundColor: selectedProject.bgColor,
                            borderColor: selectedProject.accentColor,
                            color: selectedProject.accentColor
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (selectedProject.hasImages ? 1.3 : 0.6) + idx * 0.05 }}
                          whileHover={{
                            backgroundColor: selectedProject.accentColor + '30',
                            boxShadow: `0 5px 15px ${selectedProject.glowColor}`
                          }}
                        >
                          {tech}
                        </motion.span>
          ))}
        </div>
                  </motion.div>

                  <motion.div 
                    className="modal-section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: selectedProject.hasImages ? 1.4 : 0.7 }}
                  >
                    <h3 style={{ color: selectedProject.accentColor }}>
                      <i className="fas fa-tasks"></i> Key Highlights
                    </h3>
                    <ul className="modal-highlights">
                      {selectedProject.highlights.map((highlight, idx) => (
                        <motion.li 
                          key={idx}
                          style={{ borderLeftColor: selectedProject.accentColor }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (selectedProject.hasImages ? 1.5 : 0.8) + idx * 0.1 }}
                        >
                          <i className="fas fa-check-circle" style={{ color: selectedProject.accentColor }}></i>
                          <span>{highlight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="modal-section modal-results"
                    style={{
                      background: `linear-gradient(135deg, ${selectedProject.accentColor}15, ${selectedProject.accentColor}05)`,
                      borderColor: selectedProject.accentColor,
                      boxShadow: `0 0 30px ${selectedProject.accentColor}20`
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: selectedProject.hasImages ? 2.2 : 1.2 }}
                  >
                    <h3 style={{ color: selectedProject.accentColor }}>
                      <i className="fas fa-chart-line"></i> Results & Impact
                    </h3>
                    <p className="results-text" style={{ color: selectedProject.accentColor }}>
                      {selectedProject.results}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Viewer */}
        <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-fullscreen-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeImageFullscreen}
          >
            <motion.div 
              className="image-fullscreen-content"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="image-fullscreen-close"
                onClick={closeImageFullscreen}
              >
                <i className="fas fa-times"></i>
              </button>
              <img 
                src={selectedImage} 
                alt="Fullscreen view"
                className="image-fullscreen-img"
              />
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </section>
  );
};

export default Projects; 