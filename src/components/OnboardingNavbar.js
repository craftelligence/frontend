import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, LogOut } from 'lucide-react';
import './Navbar.css';

const OnboardingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goTo = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  return (
    <motion.nav
      className={`navbar onboarding-navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="nav-container" style={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo_white.svg" alt="Craftelligence" className="logo-img logo-dark" />
          <img src="/logo_black.svg" alt="Craftelligence" className="logo-img logo-light" />
          <div className="logo-text">
            <h2>Craftelligence</h2>
            <p>We Build. You Scale.</p>
          </div>
        </motion.div>

        {/* User Profile / Sign In */}
        <div className="nav-menu">
          {user ? (
            <motion.li style={{ listStyle: 'none', position: 'relative' }} whileHover={{ scale: 1.05 }} ref={dropdownRef}>
              <div
                className="user-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ cursor: 'pointer' }}
              >
                <div className="user-avatar">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="avatar-image" />
                  ) : (
                    <div className="avatar-initials">{getInitials(getUserDisplayName())}</div>
                  )}
                </div>
                <span className="user-name">{getUserDisplayName()}</span>
                <svg
                  className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 4L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button className="dropdown-item" onClick={handleProfileClick}>
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ) : (
            <motion.li style={{ listStyle: 'none' }} whileHover={{ scale: 1.05 }}>
              <button
                onClick={() => goTo('/developer-registration')}
                className="nav-cta"
              >
                Sign In
              </button>
            </motion.li>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default OnboardingNavbar;