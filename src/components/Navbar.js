import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import UserProfile from './UserProfile';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''} ${isOpen ? 'expanded' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="nav-container">
        {/* Logo */}
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onClick={() => scrollToSection('home')}
        >
          <img src="/logo_white.svg" alt="Craftelligence" className="logo-img logo-dark" />
          <img src="/logo_black.svg" alt="Craftelligence" className="logo-img logo-light" />
          <div className="logo-text">
            <h2>Craftelligence</h2>
            <p>We Build. You Scale.</p>
          </div>
        </motion.div>

        {/* Hamburger */}
        <div
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Nav Menu */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <motion.li whileHover={{ scale: 1.05 }}>
            <button onClick={() => scrollToSection('home')} className="nav-link">Home</button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }}>
            <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }}>
            <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }}>
            <button onClick={() => scrollToSection('projects')} className="nav-link">Projects</button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }}>
            <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
          </motion.li>
          {user ? (
            <motion.li whileHover={{ scale: 1.05 }}>
              <UserProfile user={user} onNavigateProfile={() => goTo('/profile')} />
            </motion.li>
          ) : (
            <motion.li whileHover={{ scale: 1.05 }}>
              <button
                onClick={() => goTo('/developer-registration')}
                className="nav-link developer-btn"
              >
                Are You Developer?
              </button>
            </motion.li>
          )}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;