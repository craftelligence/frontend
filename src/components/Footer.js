import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin',
      href: 'https://www.linkedin.com/company/craftelligence',
      color: '#0077B5'
    },
    {
      name: 'Email',
      icon: 'fas fa-envelope',
      href: 'mailto:hello@craftelligence.tech',
      color: '#EA4335'
    },
    {
      name: 'Phone',
      icon: 'fas fa-phone',
      href: 'tel:+919079971790',
      color: '#25D366'
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-background">
        <div className="footer-pattern"></div>
      </div>
      
      <div className="container">
        <div className="footer-content">
          <motion.div 
            className="footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <img src="/logo.svg" alt="Craftelligence" className="logo-img" />
              <div className="logo-text">
                <h3>Craftelligence</h3>
                <p>We Build. You Scale.</p>
              </div>
            </div>
            
            <p className="footer-description">
              Crafting innovative backend systems, AI agents, and SaaS platforms 
              to help businesses scale and succeed in the digital age.
            </p>
            
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ '--social-color': social.color }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="footer-links-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="footer-links-group">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-links-group">
              <h4>Services</h4>
              <ul>
                <li><a href="#services">Agentic Platforms</a></li>
                <li><a href="#services">Digital Twin Solutions</a></li>
                <li><a href="#services">SaaS Development</a></li>
                <li><a href="#services">Web Applications</a></li>
              </ul>
            </div>
            
            <div className="footer-links-group">
              <h4>Legal</h4>
              <ul>
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className="footer-contact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4>Get in Touch</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <a href="mailto:hello@craftelligence.tech">hello@craftelligence.tech</a>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <a href="tel:+919079971790">(+91) 9079971790</a>
              </div>
              <div className="contact-item">
                <i className="fab fa-linkedin"></i>
                <a href="https://www.linkedin.com/company/craftelligence" target="_blank" rel="noopener noreferrer">
                  Craftelligence
                </a>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Jaipur, Rajasthan, India</span>
              </div>
            </div>
            
            <button 
              className="cta-button"
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Project
              <i className="fas fa-arrow-right"></i>
            </button>
          </motion.div>
        </div>

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Craftelligence. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 