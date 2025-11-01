import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import DeveloperRegistration from './DeveloperRegistration';
import OnboardingNavbar from './OnboardingNavbar';
import Footer from './Footer';
import './Onboarding.css';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

export default function Onboarding() {
  const navigate = useNavigate();
  const [fbUser, setFbUser] = useState(() => auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(null); // null=unknown, true=existing, false=first-time

  // keep auth state in sync
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setFbUser(u);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  // when user changes, check profile status
  useEffect(() => {
    const checkProfile = async () => {
      // Wait for auth to be checked before making any decisions
      if (!authChecked) return;
      
      if (!fbUser) {
        // No user is signed in, redirect to registration
        navigate('/developer-registration');
        return;
      }

      try {
        setLoading(true);
        
        // First check if we have a profile in session storage
        const storedProfile = sessionStorage.getItem(`user_${fbUser.uid}_profile`);
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          // Only short-circuit if we know it's complete; if not complete, fall through to verify via Firestore
          if (profile && profile.complete) {
            setHasProfile(true);
            return;
          }
        }
        
        // If not in session storage, check Firestore
        const userDoc = await getDoc(doc(db, 'developers', fbUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Check if required fields are filled
          const requiredFields = ['name', 'email', 'phone', 'availability', 'location'];
          const isProfileComplete = requiredFields.every(field => {
            const value = userData[field];
            return value !== undefined && value !== null && value !== '';
          });
          
          // Store in session for faster access
          sessionStorage.setItem(
            `user_${fbUser.uid}_profile`,
            JSON.stringify({ complete: isProfileComplete })
          );
          
          setHasProfile(isProfileComplete);
          return;
        }
        
        // No profile found in Firestore
        setHasProfile(false);
        
      } catch (error) {
        console.error('Error checking profile:', error);
        // On error, default to showing the form to be safe
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkProfile();
  }, [fbUser, navigate, authChecked]);

  // Show loading state while checking auth or profile
  if (!authChecked || loading || hasProfile === null) {
    return (
      <div className="onboarding-loading">
        <div className="spinner" />
        <span>Checking your profile...</span>
      </div>
    );
  }

  // Render page sections for all users; include form only for first-time users
  return (
    <div className="onboarding-page">
      <OnboardingNavbar />
      <section className="onboarding-hero">
        <div className="container">
          <div className="eyebrow">Developer Onboarding</div>
          <h1 className="title">Showcase your profile to top recruiters</h1>
          <p className="subtitle">
            Complete your details once. We securely share your profile with verified recruiters so you can get discovered
            for matching roles faster.
          </p>
          <div className="badges">
            <div className="badge">🔒 Privacy-first</div>
            <div className="badge">⚡ Fast-track matches</div>
            <div className="badge">🎯 Skill-aligned roles</div>
          </div>
        </div>
      </section>

      <section className="onboarding-highlights">
        <div className="container highlights-grid">
          <div className="card">
            <div className="card-icon">👀</div>
            <h3>Recruiter visibility</h3>
            <p>
              Your profile becomes discoverable to our network of vetted recruiters. They can review your skills, experience, and
              preferences to reach out with relevant opportunities.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">🔧</div>
            <h3>Control & updates</h3>
            <p>
              You can update your availability, location preference, and resume anytime via your profile page, keeping your
              information fresh and accurate.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">🛡️</div>
            <h3>Secure by design</h3>
            <p>
              We use secure authentication and share only the details you provide for matching. We never sell your data.
            </p>
          </div>
        </div>
      </section>

      {!hasProfile && (
        <section className="onboarding-form container">
          <DeveloperRegistration 
            initialUser={fbUser} 
            variant="embedded" 
            onComplete={() => {
              // Update session storage when profile is completed
              if (fbUser?.uid) {
                sessionStorage.setItem(
                  `user_${fbUser.uid}_profile`,
                  JSON.stringify({ complete: true })
                );
              }
              setHasProfile(true);
            }}
          />
        </section>
      )}
      <Footer />
    </div>
  );
}
