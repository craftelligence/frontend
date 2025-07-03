import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="nav-container">
        <motion.div 
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img src="/logo.svg" alt="Craftelligence" className="logo-img" />
          <div className="logo-text">
            <h2>Craftelligence</h2>
            <p>We Build. You Scale.</p>
          </div>
        </motion.div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <motion.li whileHover={{ scale: 1.1 }}>
            <button onClick={() => scrollToSection('home')} className="nav-link">
              Home
            </button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <button onClick={() => scrollToSection('about')} className="nav-link">
              About
            </button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <button onClick={() => scrollToSection('services')} className="nav-link">
              Services
            </button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <button onClick={() => scrollToSection('projects')} className="nav-link">
              Projects
            </button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <button onClick={() => scrollToSection('contact')} className="nav-link">
              Contact
            </button>
          </motion.li>
        </ul>

        <div 
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 