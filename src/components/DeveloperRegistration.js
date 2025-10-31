import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import './DeveloperRegistration.css';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

const DeveloperRegistration = ({ initialUser = null, variant }) => {
  const navigate = useNavigate();
  const isEmbedded = variant === 'embedded';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    availability: '',
    location: '',
    start_date: '',
    current_job_location: '',
    job_status: '',
    experience_years: '',
    current_position: '',
    user_role: '',
    preferred_salary: '',
    looking_for: ''
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Keep auth state in sync and prefill when user becomes available
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setFormData(prev => ({
          ...prev,
          name: prev.name || u.displayName || '',
          email: prev.email || u.email || '',
        }));
      }
    });
    return () => unsub();
  }, []);

  // If onboarding passed us a user, consume it immediately
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setFormData(prev => ({
        ...prev,
        name: prev.name || initialUser.displayName || '',
        email: prev.email || initialUser.email || '',
      }));
    }
  }, [initialUser]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Signed in user:', user?.uid, user?.email);
      // Always go to onboarding; it will choose form vs blank
      navigate('/onboarding');
    } catch (error) {
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in with Google first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Build multipart/form-data for backend
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('email', formData.email);
      fd.append('phone_no', formData.phone);
      fd.append('availability', formData.availability);
      fd.append('interested_location', formData.location);
      // Use form inputs that align with backend enums
      fd.append('start_date', formData.start_date);
      fd.append('current_job_location', formData.current_job_location);
      fd.append('job_status', formData.job_status);
      fd.append('experience_years', String(formData.experience_years || '0'));
      fd.append('current_position', formData.current_position);
      if (formData.resume) fd.append('resume', formData.resume);

      const idToken = await user.getIdToken?.();
      const authHeaders = idToken ? { Authorization: `Bearer ${idToken}` } : {};

      const res = await fetch(apiUrl('/profiles/'), {
        method: 'POST',
        headers: authHeaders,
        body: fd,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to submit application');
      }

      // Save minimal record to Firestore for internal tracking (optional)
      await setDoc(doc(db, 'developers', user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        availability: formData.availability,
        location: formData.location,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setSuccess(true);
      
      // Redirect to main page after successful registration
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError('Failed to submit application: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`developer-registration${isEmbedded ? ' embedded' : ''}`}>
        {/* Elegant Particle Background */}
        <div className="particle-background" style={{ display: isEmbedded ? 'none' : undefined }}>
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="gradient-orbs" style={{ display: isEmbedded ? 'none' : undefined }}>
          <motion.div 
            className="orb orb-1"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="orb orb-2"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="orb orb-3"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Mesh Grid */}
        <div className="mesh-grid" style={{ display: isEmbedded ? 'none' : undefined }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,255,102,0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Zigzag Lines */}
        <div className="zigzag-lines" style={{ display: isEmbedded ? 'none' : undefined }}>
          {[...Array(5)].map((_, i) => (
            <div key={`zigzag-${i}`} className="zigzag-line" />
          ))}
        </div>

        {/* Diagonal Lines */}
        <div className="diagonal-lines" style={{ display: isEmbedded ? 'none' : undefined }}>
          {[...Array(4)].map((_, i) => (
            <div key={`diagonal-${i}`} className="diagonal-line" />
          ))}
        </div>

        {/* 3D Rotating Cubes */}
        <div className="rotating-cubes" style={{ display: isEmbedded ? 'none' : undefined }}>
          {[...Array(4)].map((_, i) => (
            <div key={`cube-${i}`} className="cube-3d">
              <div className="cube-face front"></div>
              <div className="cube-face back"></div>
              <div className="cube-face right"></div>
              <div className="cube-face left"></div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
            </div>
          ))}
        </div>

        {/* Wave Lines */}
        <div className="wave-lines" style={{ display: isEmbedded ? 'none' : undefined }}>
          {[...Array(4)].map((_, i) => (
            <div key={`wave-${i}`} className="wave-line" />
          ))}
        </div>

        {/* Lightning Bolts */}
        <div className="lightning-container" style={{ display: isEmbedded ? 'none' : undefined }}>
          {[...Array(3)].map((_, i) => (
            <div key={`lightning-${i}`} className="lightning-bolt" />
          ))}
        </div>

        {/* Circuit Board */}
        <div className="circuit-board" style={{ display: isEmbedded ? 'none' : undefined }}>
          <div className="circuit-line horizontal" style={{ top: '15%', left: '10%' }}></div>
          <div className="circuit-line vertical" style={{ top: '40%', right: '20%' }}></div>
          <div className="circuit-line horizontal" style={{ bottom: '30%', left: '30%' }}></div>
          <div className="circuit-line vertical" style={{ top: '60%', right: '15%' }}></div>
          <div className="circuit-node" style={{ top: '15%', left: '10%' }}></div>
          <div className="circuit-node" style={{ top: '40%', right: '20%' }}></div>
          <div className="circuit-node" style={{ bottom: '30%', left: '30%' }}></div>
          <div className="circuit-node" style={{ top: '60%', right: '15%' }}></div>
        </div>

        <div className="success-container">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="success-message"
          >
            <motion.div
              className="success-icon"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              ✓
            </motion.div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you for your interest in joining our team. We'll review your application and get back to you soon.</p>
            <motion.button 
              onClick={() => navigate('/')}
              className="submit-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Homepage
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`developer-registration${isEmbedded ? ' embedded' : ''}`}>
      {/* Elegant Particle Background */}
      <div className="particle-background" style={{ display: isEmbedded ? 'none' : undefined }}>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="gradient-orbs" style={{ display: isEmbedded ? 'none' : undefined }}>
        <motion.div 
          className="orb orb-1"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="orb orb-2"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="orb orb-3"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Mesh Grid */}
      <div className="mesh-grid" style={{ display: isEmbedded ? 'none' : undefined }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,255,102,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Zigzag Lines */}
      <div className="zigzag-lines" style={{ display: isEmbedded ? 'none' : undefined }}>
        {[...Array(5)].map((_, i) => (
          <div key={`zigzag-${i}`} className="zigzag-line" />
        ))}
      </div>

      {/* Diagonal Lines */}
      <div className="diagonal-lines" style={{ display: isEmbedded ? 'none' : undefined }}>
        {[...Array(4)].map((_, i) => (
          <div key={`diagonal-${i}`} className="diagonal-line" />
        ))}
      </div>

      {/* 3D Rotating Cubes */}
      <div className="rotating-cubes" style={{ display: isEmbedded ? 'none' : undefined }}>
        {[...Array(4)].map((_, i) => (
          <div key={`cube-${i}`} className="cube-3d">
            <div className="cube-face front"></div>
            <div className="cube-face back"></div>
            <div className="cube-face right"></div>
            <div className="cube-face left"></div>
            <div className="cube-face top"></div>
            <div className="cube-face bottom"></div>
          </div>
        ))}
      </div>

      {/* Wave Lines */}
      <div className="wave-lines" style={{ display: isEmbedded ? 'none' : undefined }}>
        {[...Array(4)].map((_, i) => (
          <div key={`wave-${i}`} className="wave-line" />
        ))}
      </div>

      {/* Lightning Bolts */}
      <div className="lightning-container" style={{ display: isEmbedded ? 'none' : undefined }}>
        {[...Array(3)].map((_, i) => (
          <div key={`lightning-${i}`} className="lightning-bolt" />
        ))}
      </div>

      {/* Circuit Board */}
      <div className="circuit-board" style={{ display: isEmbedded ? 'none' : undefined }}>
        <div className="circuit-line horizontal" style={{ top: '15%', left: '10%' }}></div>
        <div className="circuit-line vertical" style={{ top: '40%', right: '20%' }}></div>
        <div className="circuit-line horizontal" style={{ bottom: '30%', left: '30%' }}></div>
        <div className="circuit-line vertical" style={{ top: '60%', right: '15%' }}></div>
        <div className="circuit-node" style={{ top: '15%', left: '10%' }}></div>
        <div className="circuit-node" style={{ top: '40%', right: '20%' }}></div>
        <div className="circuit-node" style={{ bottom: '30%', left: '30%' }}></div>
        <div className="circuit-node" style={{ top: '60%', right: '15%' }}></div>
      </div>

      <div className="registration-container">
        {/* Progress Bar */}
        <motion.div 
          className="progress-bar-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="progress-steps">
            <div className={`progress-step ${!user ? 'active' : 'completed'}`}>
              <div className="step-circle">
                {user ? '✓' : '1'}
              </div>
              <span className="step-label">Sign In</span>
            </div>
            <div className="progress-line">
              <motion.div 
                className="progress-line-fill"
                initial={{ width: '0%' }}
                animate={{ width: user ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <div className={`progress-step ${user ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span className="step-label">Complete Form</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="registration-form"
        >
          <motion.div 
            className="form-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="header-icon"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              💻
            </motion.div>
            <h1>Join Our Development Team</h1>
            <p>Fill out the form below to apply for developer positions</p>
          </motion.div>

          {!user ? (
            <motion.div 
              className="google-signin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="step-indicator">
                <div className="step-number">01</div>
                <div className="step-info">
                  <h3>Sign in with Google</h3>
                  <p>Authenticate to continue with your application</p>
                </div>
              </div>
              <motion.button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="google-btn"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(66, 133, 244, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '10px' }}>
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              className="user-info"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="user-details">
                {user.photoURL ? (
                  <motion.img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="profile-img"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                ) : (
                  <motion.div 
                    className="profile-avatar"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </motion.div>
                )}
                <div>
                  <h3>Welcome, {user.displayName}!</h3>
                  <p>{user.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          {user && (
            <motion.form 
              onSubmit={handleSubmit} 
              className="application-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="step-indicator">
                <div className="step-number">02</div>
                <div className="step-info">
                  <h3>Complete Your Application</h3>
                  <p>Fill in your details to submit your application</p>
                </div>
              </div>
              <div className="form-row">
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="name">
                  <span className="label-icon">👤</span>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </motion.div>
              </div>

              <div className="form-row">
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="phone">
                  <span className="label-icon">📱</span>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  pattern="[0-9+\-() ]+"
                  title="Please enter a valid phone number"
                  required
                />
              </motion.div>

              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="user_role">Employment Role *</label>
                <select
                  id="user_role"
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select employment type</option>
                  <option value="contractor">Contractor</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="any">Any</option>
                </select>
              </motion.div>
              </div>

              <div className="form-row">
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="preferred_salary">Preferred Salary (LPA) *</label>
                <div className="salary-input">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    id="preferred_salary"
                    name="preferred_salary"
                    value={formData.preferred_salary}
                    onChange={handleInputChange}
                    placeholder="e.g., 80000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="looking_for">Looking For (Job Role) *</label>
                <select
                  id="looking_for"
                  name="looking_for"
                  value={formData.looking_for}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select job role</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="full-stack">Full Stack Developer</option>
                  <option value="data-science">Data Scientist</option>
                  <option value="ai-ml">AI/ML Engineer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>
              </div>

              <div className="form-row">
                <motion.div 
                  className="form-group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="resume">
                    <span className="label-icon">📄</span>
                    Resume (PDF, max 2MB) *
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                      className="file-input"
                    />
                    <label htmlFor="resume" className="file-label">
                      {formData.resume ? formData.resume.name : 'Choose File'}
                    </label>
                  </div>
                  {formData.resume && (
                    <motion.p 
                      className="file-info"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      ✓ {formData.resume.name}
                    </motion.p>
                  )}
                </motion.div>

                {/* Current Position */}
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="current_position">
                  <span className="label-icon">🧑‍💻</span>
                  Current Position *
                </label>
                <select
                  id="current_position"
                  name="current_position"
                  value={formData.current_position}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select position</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="full-stack">Full Stack Developer</option>
                  <option value="data-science">Data Scientist</option>
                  <option value="ai-ml">AI/ML Engineer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>
              </div>

              <div className="form-row">
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="availability">
                  <span className="label-icon">⏰</span>
                  Availability *
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select availability</option>
                  <option value="full-time">Full Time (40hrs/week)</option>
                  <option value="part-time">Part Time (20hrs/week)</option>
                </select>
              </motion.div>

              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="location">
                  <span className="label-icon">📍</span>
                  Interested Location *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select location preference</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="both">Both Remote & Onsite</option>
                </select>
              </motion.div>
              </div>

              {/* Start Date */}
              <div className="form-row">
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="start_date">
                  <span className="label-icon">🗓️</span>
                  Start Date *
                </label>
                <select
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select start date</option>
                  <option value="immediately">Immediately</option>
                  <option value="15 days">15 days</option>
                  <option value="1 month">1 month</option>
                </select>
              </motion.div>

              {/* Current Job Location */}
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="current_job_location">
                  <span className="label-icon">🏢</span>
                  Current Job Location *
                </label>
                <input
                  type="text"
                  id="current_job_location"
                  name="current_job_location"
                  value={formData.current_job_location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your current job location"
                />
              </motion.div>
              </div>

              {/* Job Status */}
              <div className="form-row">
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="job_status">
                  <span className="label-icon">💼</span>
                  Job Status *
                </label>
                <select
                  id="job_status"
                  name="job_status"
                  value={formData.job_status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select job status</option>
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </motion.div>

              {/* Experience Years */}
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="experience_years">
                  <span className="label-icon">📈</span>
                  Experience (years) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  id="experience_years"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 3.5"
                />
              </motion.div>
              </div>

              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <motion.button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <span style={{ marginLeft: '8px' }}>→</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperRegistration;