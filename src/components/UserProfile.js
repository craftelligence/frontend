import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import './UserProfile.css';

const UserProfile = ({ user, onProfileUpdate, onNavigateProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    availability: '',
    location: ''
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'developers', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile(userData);
        setFormData({
          name: userData.name || user.displayName || '',
          email: userData.email || user.email || '',
          phone: userData.phone || '',
          availability: userData.availability || '',
          location: userData.location || ''
        });
      } else {
        // Create new profile if doesn't exist
        const newProfile = {
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          availability: '',
          location: '',
          userId: user.uid,
          createdAt: new Date(),
          status: 'pending'
        };
        await setDoc(doc(db, 'developers', user.uid), newProfile);
        setProfile(newProfile);
        setFormData(newProfile);
      }
    } catch (error) {
      setError('Failed to fetch profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      await updateDoc(doc(db, 'developers', user.uid), {
        ...formData,
        updatedAt: new Date()
      });

      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      onProfileUpdate && onProfileUpdate();
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div className="user-profile-container">
      <motion.button
        className="profile-trigger"
        onClick={() => {
          if (onNavigateProfile) {
            onNavigateProfile();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="profile-avatar-img" />
        ) : (
          <div className="profile-avatar-initials">
            {getInitials(user.displayName)}
          </div>
        )}
        <span className="profile-name">{user.displayName}</span>
        <motion.span
          className="dropdown-arrow"
          animate={{ rotate: onNavigateProfile ? 0 : (isOpen ? 180 : 0) }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {!onNavigateProfile && (
        <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profile-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="profile-header">
              <div className="profile-info">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="profile-large-img" />
                ) : (
                  <div className="profile-large-initials">
                    {getInitials(user.displayName)}
                  </div>
                )}
                <div>
                  <h3>{user.displayName}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
            </div>

            {profile && (
              <div className="profile-details">
                <h4>Application Details</h4>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{profile.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Availability:</span>
                  <span className="value">{profile.availability || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{profile.location || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className={`status ${profile.status}`}>{profile.status}</span>
                </div>
              </div>
            )}

            <div className="profile-actions">
              <button
                className="edit-btn"
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing && (
              <motion.form
                className="profile-edit-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleUpdateProfile}
              >
                <h4>Update Your Details</h4>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                  >
                    <option value="">Select availability</option>
                    <option value="full-time">Full Time (40hrs/week)</option>
                    <option value="part-time">Part Time (20hrs/week)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location Preference</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  >
                    <option value="">Select location</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="both">Both Remote & Onsite</option>
                  </select>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="update-btn"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </motion.form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </div>
  );
};

export default UserProfile;
