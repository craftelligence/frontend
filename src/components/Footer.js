import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initial = stored === 'light' || stored === 'dark' ? stored : 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const companyLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  const serviceLinks = [
    { name: 'Agentic Platforms', href: '#services' },
    { name: 'Digital Twin Solutions', href: '#services' },
    { name: 'SaaS Development', href: '#services' },
    { name: 'Web Applications', href: '#services' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' }
  ];

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      icon: 'fab fa-linkedin', 
      href: 'https://www.linkedin.com/company/craftelligence',
      label: 'Connect on LinkedIn'
    },
    { 
      name: 'Email', 
      icon: 'fas fa-envelope', 
      href: 'mailto:hello@craftelligence.tech',
      label: 'Send us an email'
    },
    { 
      name: 'Phone', 
      icon: 'fas fa-phone', 
      href: 'tel:+919079971790',
      label: 'Give us a call'
    }
  ];

  const contactDetails = [
    {
      icon: 'fas fa-envelope',
      text: 'hello@craftelligence.tech',
      href: 'mailto:hello@craftelligence.tech'
    },
    {
      icon: 'fas fa-phone',
      text: '(+91) 9079971790',
      href: 'tel:+919079971790'
    },
    {
      icon: 'fas fa-map-marker-alt',
      text: 'Jaipur, Rajasthan, India',
      href: null
    }
  ];

  return (
    <footer className="footer">
      {/* Animated Background Elements */}
      <div className="footer-background">
        <div className="animated-gradient"></div>
        <div className="grid-overlay"></div>
        <div className="floating-particles">
          <span className="particle particle-1"></span>
          <span className="particle particle-2"></span>
          <span className="particle particle-3"></span>
          <span className="particle particle-4"></span>
          <span className="particle particle-5"></span>
          <span className="particle particle-6"></span>
          <span className="particle particle-7"></span>
          <span className="particle particle-8"></span>
          <span className="particle particle-9"></span>
        </div>
        <div className="border-glow-animation"></div>
      </div>

      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <motion.div 
            className="footer-brand-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="brand-logo-text-wrapper">
              <div className="brand-logo-wrapper">
                <img src="/logo_white.svg" alt="Craftelligence" className="footer-logo-img logo-dark" />
                <img src="/logo_black.svg" alt="Craftelligence" className="footer-logo-img logo-light" />
              </div>
              
              <div className="brand-content">
                <h3 className="brand-name">Craftelligence</h3>
                <p className="brand-tagline">We Build. You Scale.</p>
              </div>
            </div>

            <p className="brand-description">
              Crafting innovative backend systems, AI agents, and SaaS platforms 
              to help businesses scale and succeed in the digital age.
            </p>

            {/* Social Links */}
            <div className="social-links-wrapper">
              <p className="social-title">Connect With Us</p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <i className={social.icon}></i>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links Grid */}
          <motion.div 
            className="footer-links-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="links-column">
              <h4 className="column-title">Company</h4>
              <ul className="links-list">
                {companyLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={link.href}>
                      <span className="link-arrow">→</span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="links-column">
              <h4 className="column-title">Services</h4>
              <ul className="links-list">
                {serviceLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={link.href}>
                      <span className="link-arrow">→</span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="links-column">
              <h4 className="column-title">Legal</h4>
              <ul className="links-list">
                {legalLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={link.href}>
                      <span className="link-arrow">→</span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            className="footer-contact-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="contact-title">Get in Touch</h4>
            
            <div className="contact-details-list">
              {contactDetails.map((detail, index) => (
                <motion.div
                  key={index}
                  className="contact-detail-item"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="detail-icon">
                    <i className={detail.icon}></i>
                  </div>
                  {detail.href ? (
                    <a href={detail.href}>{detail.text}</a>
                  ) : (
                    <span>{detail.text}</span>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.button 
              className="footer-cta-button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your Project</span>
              <i className="fas fa-arrow-right"></i>
            </motion.button>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-left">
            <p className="copyright">
              &copy; {currentYear} <span className="brand-highlight">Craftelligence</span>. All rights reserved.
            </p>
          </div>

          <div className="footer-bottom-right">
            <motion.button 
              className={`theme-toggle-button ${theme}`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;