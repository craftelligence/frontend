import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Services.css';

const Services = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const services = [
    {
      icon: 'fas fa-robot',
      title: 'Agentic Platforms',
      subtitle: 'Multi-Agent AI Systems',
      description: 'Build multi-agent LLM-powered systems that work together to solve complex problems autonomously.',
      features: ['Multi-agent coordination', 'LLM integration', 'Intelligent task execution', 'Scalable architecture'],
      badge: 'AI-Powered',
      imageUrl: '/Agentic Platforms.jpg',
      themeColor: '#00ff66',
      bgGradient: 'linear-gradient(135deg, rgba(0, 255, 102, 0.15), rgba(0, 204, 82, 0.1))',
      glowColor: 'rgba(0, 255, 102, 0.3)'
    },
    {
      icon: 'fas fa-brain',
      title: 'AI & Machine Learning',
      subtitle: 'Intelligent Automation',
      description: 'Custom AI models and ML solutions for predictive analytics, computer vision, NLP, and intelligent automation.',
      features: ['Custom model training', 'Neural networks', 'Predictive analytics', 'Computer vision & NLP'],
      badge: 'Advanced',
      imageUrl: '/AI:ML.png',
      themeColor: '#00d4ff',
      bgGradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 170, 255, 0.1))',
      glowColor: 'rgba(0, 212, 255, 0.3)'
    },
    {
      icon: 'fas fa-server',
      title: 'MCP Servers',
      subtitle: 'Model Context Protocol',
      description: 'Build and deploy Model Context Protocol servers that enable seamless AI integration and context-aware interactions.',
      features: ['Context-aware AI', 'Protocol implementation', 'Server deployment', 'AI ecosystem integration'],
      badge: 'New',
      imageUrl: '/mcp servers.png',
      themeColor: '#00ffaa',
      bgGradient: 'linear-gradient(135deg, rgba(0, 255, 170, 0.15), rgba(0, 204, 136, 0.1))',
      glowColor: 'rgba(0, 255, 170, 0.3)'
    },
    {
      icon: 'fas fa-cube',
      title: 'Digital Twin Solutions',
      subtitle: 'Real-Time Modeling',
      description: 'Real-time system modeling and insights for operational optimization and predictive maintenance.',
      features: ['Real-time monitoring', 'Predictive analytics', 'System simulation', 'Performance optimization'],
      badge: 'IoT',
      imageUrl: '/digital_twin_solution.webp',
      themeColor: '#00e5ff',
      bgGradient: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(0, 183, 204, 0.1))',
      glowColor: 'rgba(0, 229, 255, 0.3)'
    },
    {
      icon: 'fas fa-cloud',
      title: 'SaaS Development',
      subtitle: 'Cloud-Native Products',
      description: 'Full-stack cloud-native applications built for scale, performance, and global reach.',
      features: ['Cloud-native architecture', 'Microservices', 'Auto-scaling', 'High availability'],
      badge: 'Scalable',
      imageUrl: '/saas.png',
      themeColor: '#00d9ff',
      bgGradient: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15), rgba(0, 174, 204, 0.1))',
      glowColor: 'rgba(0, 217, 255, 0.3)'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Data Analytics & BI',
      subtitle: 'Data-Driven Insights',
      description: 'Transform raw data into actionable insights with advanced analytics, dashboards, and business intelligence.',
      features: ['Data visualization', 'Real-time analytics', 'Custom dashboards', 'Reporting automation'],
      badge: 'Insights',
      imageUrl: '/da_bi.webp',
      themeColor: '#00ffcc',
      bgGradient: 'linear-gradient(135deg, rgba(0, 255, 204, 0.15), rgba(0, 204, 163, 0.1))',
      glowColor: 'rgba(0, 255, 204, 0.3)'
    },
    {
      icon: 'fas fa-code',
      title: 'Custom Software',
      subtitle: 'Tailored Solutions',
      description: 'Custom backend systems, APIs, admin panels, and web applications designed for your specific needs.',
      features: ['Custom APIs', 'Admin dashboards', 'Web applications', 'Database design'],
      badge: 'Custom',
      imageUrl: '/Custom_Software.png',
      themeColor: '#00ff88',
      bgGradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 204, 109, 0.1))',
      glowColor: 'rgba(0, 255, 136, 0.3)'
    }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % services.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, services.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % services.length);
    // Don't stop auto-play when using navigation buttons
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
    // Don't stop auto-play when using navigation buttons
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    // Don't stop auto-play when clicking dots
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    })
  };

  const FloatingCard = ({ service, index }) => {
    const positions = [
      { left: '5%', top: '10%' },
      { left: '85%', top: '15%' },
      { left: '10%', top: '75%' },
      { left: '80%', top: '70%' },
      { left: '15%', top: '40%' },
      { left: '75%', top: '45%' },
      { left: '50%', top: '5%' },
    ];

    const pos = positions[index % positions.length];
    const randomDuration = 15 + Math.random() * 10;
    const randomDelay = Math.random() * 5;

    return (
      <motion.div
        className="floating-card"
        style={{
          left: pos.left,
          top: pos.top,
        }}
        animate={{
          y: [0, -40, 0],
          rotate: [-8, 8, -8],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: randomDuration,
          repeat: Infinity,
          delay: randomDelay,
          ease: 'easeInOut',
        }}
      >
        <div className="floating-card-inner" style={{ background: service.bgGradient, borderColor: service.themeColor }}>
          <div className="floating-card-icon" style={{ color: service.themeColor }}>
            <i className={service.icon}></i>
          </div>
          <div className="floating-card-title">{service.title}</div>
          <div className="floating-card-badge" style={{ color: service.themeColor, borderColor: service.themeColor }}>
            {service.badge}
          </div>
        </div>
      </motion.div>
    );
  };

  const currentService = services[currentSlide];

  return (
    <section id="services" className="services-section">
      <div className="services-bg-grid"></div>

      {services.map((service, index) => (
        <FloatingCard key={`float-${index}`} service={service} index={index} />
      ))}

      <div className="services-container">
        <div className="services-header">
          <span className="services-label">Our Services</span>
          <h2 className="services-main-title">What We Do</h2>
          <p className="services-intro">
            Cutting-edge technology solutions designed to transform your business and drive innovation
          </p>
        </div>

        <div className="carousel-wrapper">
          <div className="carousel-main">
            <button 
              className="autoplay-toggle" 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              style={{ borderColor: currentService.themeColor }}
            >
              {isAutoPlaying ? (
                <div className="autoplay-pulse" style={{ background: currentService.themeColor }}></div>
              ) : (
                <div className="autoplay-paused"></div>
              )}
              <span style={{ color: currentService.themeColor }}>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
            </button>

            <button 
              className="nav-button prev" 
              onClick={prevSlide}
              style={{ borderColor: currentService.themeColor, color: currentService.themeColor }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="nav-button next" 
              onClick={nextSlide}
              style={{ borderColor: currentService.themeColor, color: currentService.themeColor }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                className="service-card"
                style={{ borderColor: currentService.themeColor, boxShadow: `0 20px 60px ${currentService.glowColor}` }}
              >
                <div className="card-left" style={{ background: currentService.bgGradient }}>
                  <div className="card-image-container">
                    <img src={currentService.imageUrl} alt={currentService.title} className="card-main-image" />
                    <div className="card-image-overlay" style={{ background: currentService.bgGradient }}></div>
                  </div>
                  <div className="card-icon-main" style={{ color: currentService.themeColor }}>
                    <i className={currentService.icon}></i>
                  </div>
                  <div className="card-badge-main" style={{ color: currentService.themeColor, borderColor: currentService.themeColor }}>
                    {currentService.badge}
                  </div>
                </div>

                <div className="card-right">
                  <h3 className="card-title">{currentService.title}</h3>
                  <div className="card-subtitle" style={{ color: currentService.themeColor }}>{currentService.subtitle}</div>
                  <p className="card-description">{currentService.description}</p>

                  <div className="card-features">
                    {currentService.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        className="feature-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + 0.2 }}
                        style={{ 
                          background: `${currentService.themeColor}15`,
                          borderColor: `${currentService.themeColor}40`
                        }}
                      >
                        <div className="feature-check" style={{ background: currentService.themeColor }}>
                          <i className="fas fa-check"></i>
                        </div>
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="dots-container">
            {services.map((service, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                style={{
                  background: index === currentSlide ? '#00ff66' : 'rgba(0, 255, 102, 0.6)',
                  borderColor: index === currentSlide ? '#00ff66' : 'rgba(0, 255, 102, 0.8)',
                  minWidth: '12px',
                  minHeight: '12px'
                }}
              />
            ))}
          </div>
        </div>

        <motion.div 
          className="services-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-content">
            <h3 className="cta-title">Ready to Build Something Amazing?</h3>
            <p className="cta-description">
              Let's discuss your project and see how we can help you scale.
            </p>
            <button 
              className="cta-button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Start Your Project</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;