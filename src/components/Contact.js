import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // REPLACE THIS WITH YOUR ACTUAL CALENDLY LINK
  const calendlyUrl = "https://calendly.com/ajay-craftelligence/30min";

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const contactInfo = [
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      value: 'hello@craftelligence.tech',
      link: 'mailto:hello@craftelligence.tech',
    },
    {
      icon: 'fas fa-phone',
      title: 'Phone',
      value: '(+91) 9079971790',
      link: 'tel:+919079971790',
    },
    {
      icon: 'fab fa-linkedin',
      title: 'LinkedIn',
      value: 'Craftelligence',
      link: 'https://www.linkedin.com/company/craftelligence',
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Headquarters',
      value: 'Jaipur, Rajasthan, India',
      link: null,
    }
  ];

  return (
    <section id="contact" className="contact section" ref={sectionRef}>
      <div className="contact-background">
        <div className="animated-grid"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="connection-lines">
          <svg className="lines-svg">
            <line className="line line-1" x1="10%" y1="20%" x2="90%" y2="80%" />
            <line className="line line-2" x1="90%" y1="20%" x2="10%" y2="80%" />
            <line className="line line-3" x1="50%" y1="10%" x2="50%" y2="90%" />
          </svg>
        </div>
        <div className="floating-dots">
          <span className="dot dot-1"></span>
          <span className="dot dot-2"></span>
          <span className="dot dot-3"></span>
          <span className="dot dot-4"></span>
          <span className="dot dot-5"></span>
          <span className="dot dot-6"></span>
        </div>
      </div>

      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Let's Connect
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to build something amazing? Schedule a meeting or reach out directly.
        </motion.p>

        <div className="contact-content">
          <motion.div
            className="contact-info-section"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="contact-intro">
              <h3>Get in Touch</h3>
              <p>
                Whether you have a specific project in mind or just want to explore
                possibilities, we're here to help you bring your vision to life.
              </p>
            </div>

            <div className="contact-details">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="contact-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <div className="contact-icon">
                    <i className={info.icon} style={{ color: info.iconColor }}></i>
                  </div>
                  <div className="contact-text">
                    <h4>{info.title}</h4>
                    {info.link ? (
                      <a href={info.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--dark-text)' }}>
                        {info.value}
                      </a>
                    ) : (
                      <p style={{ color: 'var(--dark-text)' }}>{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="contact-cta-section"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="availability-badge">
                <div className="pulsing-dot"></div>
                <span style={{ color: 'var(--dark-text)' }}>Available for new projects</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="calendly-section"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="calendly-card">
              <div className="calendly-header">
                <i className="fas fa-calendar-check"></i>
                <h3>Schedule a Meeting</h3>
                <p>Pick a time that works best for you</p>
              </div>

              <div
                className="calendly-inline-widget"
                data-url={calendlyUrl}
              ></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;