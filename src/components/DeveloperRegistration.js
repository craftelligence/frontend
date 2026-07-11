import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import BrandMark from './BrandMark';
import './DeveloperRegistration.css';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

const DeveloperRegistration = ({ initialUser = null, variant, onComplete }) => {
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
  const [wasSubmitted, setWasSubmitted] = useState(false);

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
    setWasSubmitted(true);
    // Use HTML5 constraint validation API manually
    const formEl = e.currentTarget;
    if (formEl && !formEl.checkValidity()) {
      // Let the CSS show red borders due to was-submitted class; do not proceed
      setError('Please fill in all required fields.');
      return;
    }
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
      // Additional required fields
      fd.append('user_role', formData.user_role);
      fd.append('preferred_salary', String(formData.preferred_salary || '0'));
      fd.append('looking_for', formData.looking_for);
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

      // If embedded in Onboarding, signal completion and do not navigate
      if (isEmbedded) {
        if (typeof onComplete === 'function') {
          try { onComplete(); } catch {}
        }
        return;
      }

      // Redirect to main page after successful registration (standalone)
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
        {!isEmbedded && <span className="dev-glow dev-glow-one" aria-hidden="true" />}
        {!isEmbedded && <span className="dev-glow dev-glow-two" aria-hidden="true" />}
        <div className="registration-container">
          <motion.div
            className="dev-card success-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon"><CheckCircle2 size={34} /></div>
            <h2>Application submitted</h2>
            <p>Thanks for your interest in joining our team. We&rsquo;ll review your application and get back to you soon.</p>
            <button onClick={() => navigate('/')} className="button button-primary submit-btn">
              Go to homepage <ArrowRight size={17} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`developer-registration${isEmbedded ? ' embedded' : ''}`}>
      {!isEmbedded && <span className="dev-glow dev-glow-one" aria-hidden="true" />}
      {!isEmbedded && <span className="dev-glow dev-glow-two" aria-hidden="true" />}

      <div className="registration-container">
        {!isEmbedded && (
          <div className="dev-topbar">
            <button className="brand" onClick={() => navigate('/')} aria-label="Craftelligence home">
              <BrandMark />
              <span>craftelligence<small>We build. You scale.</small></span>
            </button>
            <button className="dev-back" onClick={() => navigate('/')}>
              <ArrowLeft size={16} /> Back to home
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="progress-bar-container">
          <div className="progress-steps">
            <div className={`progress-step ${!user ? 'active' : 'completed'}`}>
              <div className="step-circle">{user ? <Check size={16} /> : '1'}</div>
              <span className="step-label">Sign in</span>
            </div>
            <div className="progress-line">
              <motion.div
                className="progress-line-fill"
                initial={{ width: '0%' }}
                animate={{ width: user ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
            <div className={`progress-step ${user ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span className="step-label">Complete form</span>
            </div>
          </div>
        </div>

        <motion.div
          className="dev-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <span className="eyebrow">Careers at Craftelligence</span>
            <h1>Join our development team</h1>
            <p>Tell us about yourself and we&rsquo;ll match you with the right opportunities.</p>
          </div>

          {!user ? (
            <div className="google-signin">
              <div className="step-indicator">
                <div className="step-number">01</div>
                <div className="step-info">
                  <h3>Sign in with Google</h3>
                  <p>Authenticate to continue with your application.</p>
                </div>
              </div>
              <button onClick={handleGoogleSignIn} disabled={loading} className="google-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Signing in…' : 'Sign in with Google'}
              </button>
            </div>
          ) : (
            <div className="user-info">
              <div className="user-details">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="profile-img" />
                ) : (
                  <div className="profile-avatar">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <h3>Welcome, {user.displayName || 'there'}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {user && (
            <form
              onSubmit={handleSubmit}
              className={`application-form ${wasSubmitted ? 'was-submitted' : ''}`}
              noValidate
            >
              <div className="step-indicator">
                <div className="step-number">02</div>
                <div className="step-info">
                  <h3>Complete your application</h3>
                  <p>Fill in your details to submit your application.</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter your full name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email address *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Enter your email" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone number *</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" pattern="[0-9+\-() ]+" title="Please enter a valid phone number" required />
                </div>
                <div className="form-group">
                  <label htmlFor="user_role">Employment role *</label>
                  <select id="user_role" name="user_role" value={formData.user_role} onChange={handleInputChange} required>
                    <option value="">Select employment type</option>
                    <option value="contractor">Contractor</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="any">Any</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferred_salary">Preferred salary (LPA) *</label>
                  <input type="number" id="preferred_salary" name="preferred_salary" value={formData.preferred_salary} onChange={handleInputChange} placeholder="e.g., 8" min="0" step="1" required />
                </div>
                <div className="form-group">
                  <label htmlFor="looking_for">Looking for (job role) *</label>
                  <select id="looking_for" name="looking_for" value={formData.looking_for} onChange={handleInputChange} required>
                    <option value="">Select job role</option>
                    <option value="frontend">Frontend Developer</option>
                    <option value="backend">Backend Developer</option>
                    <option value="full stack">Full Stack Developer</option>
                    <option value="data scientist">Data Scientist</option>
                    <option value="ai-ml">AI/ML Engineer</option>
                    <option value="qa">QA Engineer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="resume">Resume (PDF, max 2MB) *</label>
                  <div className="file-input-wrapper">
                    <input type="file" id="resume" accept=".pdf" onChange={handleFileChange} required className="file-input" />
                    <label htmlFor="resume" className="file-label">
                      {formData.resume ? formData.resume.name : 'Choose file'}
                    </label>
                  </div>
                  {formData.resume && (
                    <p className="file-info"><Check size={14} /> {formData.resume.name}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="current_position">Current position *</label>
                  <select id="current_position" name="current_position" value={formData.current_position} onChange={handleInputChange} required>
                    <option value="">Select position</option>
                    <option value="frontend">Frontend Developer</option>
                    <option value="backend">Backend Developer</option>
                    <option value="full stack">Full Stack Developer</option>
                    <option value="data scientist">Data Scientist</option>
                    <option value="ai-ml">AI/ML Engineer</option>
                    <option value="qa">QA Engineer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="availability">Availability *</label>
                  <select id="availability" name="availability" value={formData.availability} onChange={handleInputChange} required>
                    <option value="">Select availability</option>
                    <option value="full-time">Full time (40hrs/week)</option>
                    <option value="part-time">Part time (20hrs/week)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="location">Interested location *</label>
                  <select id="location" name="location" value={formData.location} onChange={handleInputChange} required>
                    <option value="">Select location preference</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="both">Both Remote & Onsite</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date">Start date *</label>
                  <select id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} required>
                    <option value="">Select start date</option>
                    <option value="immediately">Immediately</option>
                    <option value="15 days">15 days</option>
                    <option value="1 month">1 month</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="current_job_location">Current job location *</label>
                  <input type="text" id="current_job_location" name="current_job_location" value={formData.current_job_location} onChange={handleInputChange} required placeholder="Enter your current job location" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="job_status">Job status *</label>
                  <select id="job_status" name="job_status" value={formData.job_status} onChange={handleInputChange} required>
                    <option value="">Select job status</option>
                    <option value="employed">Employed</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="experience_years">Experience (years) *</label>
                  <input type="number" min="0" step="0.1" id="experience_years" name="experience_years" value={formData.experience_years} onChange={handleInputChange} required placeholder="e.g., 3.5" />
                </div>
              </div>

              {error && (
                <motion.div className="error-message" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading} className="button button-primary submit-btn">
                {loading ? (<><span className="spinner" /> Submitting…</>) : (<>Submit application <ArrowRight size={17} /></>)}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperRegistration;
