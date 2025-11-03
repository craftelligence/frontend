import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { deleteUser, signOut, onAuthStateChanged } from 'firebase/auth';
import './ProfilePage.css';
import OnboardingNavbar from './OnboardingNavbar';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

const initialState = {
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
};

const fieldLabels = {
  name: 'Full Name',
  email: 'Email',
  phone: 'Phone Number',
  availability: 'Availability',
  location: 'Interested Location',
  start_date: 'Start Date',
  current_job_location: 'Current Job Location',
  job_status: 'Job Status',
  experience_years: 'Experience (years)',
  current_position: 'Current Position',
  resume: 'Resume (PDF)',
  user_role: 'User Role',
  preferred_salary: 'Preferred Salary (LPA)',
  looking_for: 'Looking For'
};

export default function ProfilePage() {
  // Keep Firebase user reactive across refreshes
  const [fbUser, setFbUser] = useState(() => auth.currentUser);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  // Subscribe to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setFbUser(u));
    return () => unsub();
  }, []);

  // Prefill with Firebase user basics
  useEffect(() => {
    if (fbUser) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || fbUser.displayName || '',
        email: prev.email || fbUser.email || '',
      }));
    }
  }, [fbUser]);

  // Local cache helpers
  const lsKey = (uid) => `profile:${uid}`;

  // Load cached form when user becomes available
  useEffect(() => {
    if (!fbUser) return;
    try {
      const raw = localStorage.getItem(lsKey(fbUser.uid));
      if (raw) {
        const saved = JSON.parse(raw);
        setForm((prev) => ({ ...prev, ...saved, resume: null }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fbUser]);

  // Persist form to cache on changes
  useEffect(() => {
    if (!fbUser) return;
    try {
      const { resume, ...rest } = form;
      localStorage.setItem(lsKey(fbUser.uid), JSON.stringify(rest));
    } catch {}
  }, [fbUser, form]);

  // Fetch existing profile and prefill
  useEffect(() => {
    const fetchProfile = async () => {
      if (!fbUser) return;
      try {
        setLoading(true);
        const idToken = await fbUser.getIdToken?.();
        const authHeaders = idToken ? { Authorization: `Bearer ${idToken}` } : {};
        const res = await fetch(apiUrl(`/profiles/user/${encodeURIComponent(fbUser.uid)}`), {
          method: 'GET',
          headers: {
            ...authHeaders,
          },
        });
        if (res.status === 404) {
          // No profile yet; leave defaults
          return;
        }
        if (!res.ok) {
          // Non-fatal; allow user to create
          return;
        }
        const data = await res.json();
        // Map backend fields to local form state names
        setForm((prev) => ({
          ...prev,
          name: data.name ?? prev.name ?? '',
          email: data.email ?? prev.email ?? '',
          phone: data.phone_no ?? prev.phone ?? '',
          availability: data.availability ?? prev.availability ?? '',
          location: data.interested_location ?? prev.location ?? '',
          start_date: data.start_date ?? prev.start_date ?? '',
          current_job_location: data.current_job_location ?? prev.current_job_location ?? '',
          job_status: data.job_status ?? prev.job_status ?? '',
          experience_years: data.experience_years !== undefined && data.experience_years !== null ? String(data.experience_years) : prev.experience_years,
          current_position: data.current_position ?? prev.current_position ?? '',
          preferred_salary: data.preferred_salary !== undefined && data.preferred_salary !== null ? String(data.preferred_salary) : prev.preferred_salary,
          looking_for: data.looking_for ?? prev.looking_for ?? '',
          user_role: data.user_role ?? prev.user_role ?? '',
          resume: null, // file input not prefilled
        }));
        // Capture resume URL if provided by backend, otherwise fall back to a conventional endpoint
        try {
          const providedUrl = data.resume_url || data.resume || '';
          const fallbackUrl = fbUser ? apiUrl(`/profiles/user/${encodeURIComponent(fbUser.uid)}/resume`) : '';
          setResumeUrl(providedUrl || fallbackUrl);
        } catch {}
      } catch (e) {
        // swallow errors to not block the page
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [fbUser]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Clear cached form for current user, if any
      if (fbUser) {
        try { localStorage.removeItem(`profile:${fbUser.uid}`); } catch {}
      }
      await signOut(auth);
      navigate('/onboarding');
    } catch (e) {
      setError(e?.message || 'Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  const isCreatePayloadValid = useMemo(() => {
    // For POST, all fields except resume must be non-empty, and resume must be a File
    const {
      name,
      email,
      phone,
      availability,
      location,
      start_date,
      current_job_location,
      job_status,
      current_position,
      resume,
    } = form;
    return (
      !!name &&
      !!email &&
      !!phone &&
      !!availability &&
      !!location &&
      !!start_date && // one of allowed enum options
      !!current_job_location &&
      !!job_status &&
      form.experience_years !== '' &&
      !!current_position && // one of allowed enum options
      resume instanceof File
    );
  }, [form]);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      const file = files && files[0];
      setForm((prev) => ({ ...prev, resume: file || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toFormData = (data) => {
    // Map local form keys to backend-expected keys
    const fd = new FormData();
    const map = {
      name: data.name,
      email: data.email,
      phone_no: data.phone,
      availability: data.availability,
      interested_location: data.location,
      start_date: data.start_date,
      current_job_location: data.current_job_location,
      job_status: data.job_status,
      experience_years: data.experience_years,
      current_position: data.current_position,
      preferred_salary: data.preferred_salary,
      looking_for: data.looking_for,
      user_role: data.user_role,
      resume: data.resume,
    };
    Object.entries(map).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        fd.append(k, v);
      }
    });
    return fd;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fbUser) {
      setError('You must be logged in to update your profile.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Try updating first
      const updatePayload = { ...form };
      // For PUT, fields can be optional. Only include provided values.
      const updateFd = toFormData(updatePayload);
      const idToken = await fbUser.getIdToken?.();
      const authHeaders = idToken ? { Authorization: `Bearer ${idToken}` } : {};
      const putRes = await fetch(apiUrl(`/profiles/user/${encodeURIComponent(fbUser.uid)}`), {
        method: 'PUT',
        headers: authHeaders,
        body: updateFd,
      });

      if (putRes.ok) {
        // Re-fetch to ensure we reflect server values (and any normalization)
        try {
          const idTokenAfter = await fbUser.getIdToken?.();
          const authHeadersAfter = idTokenAfter ? { Authorization: `Bearer ${idTokenAfter}` } : {};
          const refRes = await fetch(apiUrl(`/profiles/user/${encodeURIComponent(fbUser.uid)}`), {
            method: 'GET',
            headers: {
              ...authHeadersAfter,
              'Cache-Control': 'no-store',
            },
          });
          if (refRes.ok) {
            const data = await refRes.json();
            setForm((prev) => ({
              ...prev,
              name: data.name ?? prev.name ?? '',
              email: data.email ?? prev.email ?? '',
              phone: data.phone_no ?? prev.phone ?? '',
              availability: data.availability ?? prev.availability ?? '',
              location: data.interested_location ?? prev.location ?? '',
              start_date: data.start_date ?? prev.start_date ?? '',
              current_job_location: data.current_job_location ?? prev.current_job_location ?? '',
              job_status: data.job_status ?? prev.job_status ?? '',
              experience_years: data.experience_years !== undefined && data.experience_years !== null ? String(data.experience_years) : prev.experience_years,
              current_position: data.current_position ?? prev.current_position ?? '',
              preferred_salary: data.preferred_salary !== undefined && data.preferred_salary !== null ? String(data.preferred_salary) : prev.preferred_salary,
              looking_for: data.looking_for ?? prev.looking_for ?? '',
              user_role: data.user_role ?? prev.user_role ?? '',
              resume: null,
            }));
            // Update resume URL
            try {
              const providedUrl = data.resume_url || data.resume || '';
              const fallbackUrl = fbUser ? apiUrl(`/profiles/user/${encodeURIComponent(fbUser.uid)}/resume`) : '';
              setResumeUrl(providedUrl || fallbackUrl);
            } catch {}
          }
        } catch {}
        setMessage('Profile updated successfully.');
        return;
      }

      // If update failed with 404, try create
      if (putRes.status === 404) {
        try {
          const createFd = toFormData(form);
          const postRes = await fetch(apiUrl('/profiles/'), {
            method: 'POST',
            headers: authHeaders,
            body: createFd,
          });
          if (!postRes.ok) {
            const txt = await postRes.text();
            throw new Error(txt || 'Failed to create profile');
          }
          // After creating, re-fetch to populate the latest from server
          try {
            const idTokenAfter = await fbUser.getIdToken?.();
            const authHeadersAfter = idTokenAfter ? { Authorization: `Bearer ${idTokenAfter}` } : {};
            const refRes = await fetch(apiUrl(`/profiles/user/${encodeURIComponent(fbUser.uid)}`), {
              method: 'GET',
              headers: {
                ...authHeadersAfter,
                'Cache-Control': 'no-store',
              },
            });
            if (refRes.ok) {
              const data = await refRes.json();
              setForm((prev) => ({
                ...prev,
                name: data.name ?? prev.name ?? '',
                email: data.email ?? prev.email ?? '',
                phone: data.phone_no ?? prev.phone ?? '',
                availability: data.availability ?? prev.availability ?? '',
                location: data.interested_location ?? prev.location ?? '',
                start_date: data.start_date ?? prev.start_date ?? '',
                current_job_location: data.current_job_location ?? prev.current_job_location ?? '',
                job_status: data.job_status ?? prev.job_status ?? '',
                experience_years: data.experience_years !== undefined && data.experience_years !== null ? String(data.experience_years) : prev.experience_years,
                current_position: data.current_position ?? prev.current_position ?? '',
                preferred_salary: data.preferred_salary !== undefined && data.preferred_salary !== null ? String(data.preferred_salary) : prev.preferred_salary,
                looking_for: data.looking_for ?? prev.looking_for ?? '',
                user_role: data.user_role ?? prev.user_role ?? '',
                resume: null,
              }));
            }
          } catch {}
          setMessage('Profile created successfully.');
          return;
        } catch (err) {
          setError(err.message || 'Something went wrong');
        } finally {
          setLoading(false);
        }
      }

      const errTxt = await putRes.text();
      throw new Error(errTxt || 'Failed to update profile');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const doDelete = async () => {
    if (!fbUser) {
      setError('You must be logged in to delete your profile.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // 1) Delete profile from backend
      const idToken = await fbUser.getIdToken?.();
      const authHeaders = idToken ? { Authorization: `Bearer ${idToken}` } : {};
      const res = await fetch(apiUrl(`/profiles/user/${encodeURIComponent(fbUser.uid)}`), {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to delete profile');
      }

      // 2) Delete user from Firebase Auth
      try {
        await deleteUser(fbUser);
        try { localStorage.removeItem(`profile:${fbUser.uid}`); } catch {}
        await signOut(auth).catch(() => {});
        navigate('/onboarding');
        return;
      } catch (authErr) {
        await signOut(auth).catch(() => {});
        navigate('/onboarding');
        return;
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while deleting');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!fbUser) {
      setError('You must be logged in to delete your profile.');
      return;
    }
    setConfirmOpen(true);
  };

  const handleViewResume = async () => {
    if (!resumeUrl) return;
    try {
      // Prefer fetching to create a blob URL so browser treats it as inline PDF
      const idToken = await fbUser?.getIdToken?.();
      const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {};
      const resp = await fetch(resumeUrl, { headers });
      if (!resp.ok) throw new Error('Failed to fetch resume');
      const blob = await resp.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      const w = window.open('', '_blank');
      if (w) {
        w.document.write('<!DOCTYPE html><html><head><title>Resume</title><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body style="margin:0;padding:0;overflow:hidden;background:#111">');
        w.document.write(`<embed src="${blobUrl}#toolbar=1&navpanes=0&scrollbar=1" type="application/pdf" style="border:0;width:100vw;height:100vh" />`);
        w.document.write('</body></html>');
        w.document.close();
      } else {
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <OnboardingNavbar />
      <div className="profile-page">
      <div className="profile-container">
        <div className="profile-topbar">
          <button type="button" className="back-btn" onClick={() => navigate('/onboarding')}>← Back to Home</button>
        </div>
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="profile-header">
            <h2>Your Profile</h2>
            <p>Keep your information up to date. Simple and clean.</p>
          </div>

          {message && <div className="message-success">{message}</div>}
          {error && <div className="message-error">{error}</div>}

          <form onSubmit={handleSave}>
            <div className="form-grid">
              <TextField 
                label={fieldLabels.name} 
                name="name" 
                value={form.name} 
                onChange={onChange} 
                required 
                placeholder="Enter your full name"
              />
              
              <TextField 
                type="email" 
                label={fieldLabels.email} 
                name="email" 
                value={form.email} 
                onChange={onChange} 
                required 
                placeholder="Enter your email"
              />
              
              <TextField 
                label={fieldLabels.phone} 
                name="phone" 
                value={form.phone} 
                onChange={onChange} 
                required 
                placeholder="Enter your phone number"
              />
              
              <SelectField 
                label={fieldLabels.availability} 
                name="availability" 
                value={form.availability} 
                onChange={onChange} 
                options={[
                  { value: '', label: 'Select availability' },
                  { value: 'full-time', label: 'Full Time (40hrs/week)' },
                  { value: 'part-time', label: 'Part Time (20hrs/week)' },
                ]} 
                required 
              />
              
              <SelectField 
                label={fieldLabels.location} 
                name="location" 
                value={form.location} 
                onChange={onChange} 
                options={[
                  { value: '', label: 'Select location preference' },
                  { value: 'remote', label: 'Remote' },
                  { value: 'onsite', label: 'Onsite' },
                  { value: 'both', label: 'Both Remote & Onsite' },
                ]} 
                required 
              />
              
              <SelectField 
                label={fieldLabels.start_date} 
                name="start_date" 
                value={form.start_date} 
                onChange={onChange} 
                options={[
                  { value: '', label: 'Select start date' },
                  { value: 'immediately', label: 'Immediately' },
                  { value: '15 days', label: '15 days' },
                  { value: '1 month', label: '1 month' },
                ]} 
                required 
              />
              
              <TextField 
                label={fieldLabels.current_job_location} 
                name="current_job_location" 
                value={form.current_job_location} 
                onChange={onChange} 
                required 
                placeholder="Enter your current job location"
              />
              
              <SelectField 
                label={fieldLabels.job_status} 
                name="job_status" 
                value={form.job_status} 
                onChange={onChange} 
                options={[
                  { value: '', label: 'Select job status' },
                  { value: 'employed', label: 'Employed' },
                  { value: 'unemployed', label: 'Unemployed' }
                ]} 
                required 
              />
              
              <TextField 
                type="number" 
                min="0" 
                step="0.1" 
                label={fieldLabels.experience_years} 
                name="experience_years" 
                value={form.experience_years} 
                onChange={onChange} 
                required 
                placeholder="Years of experience"
              />
              
              <SelectField 
                label={fieldLabels.current_position} 
                name="current_position" 
                value={form.current_position} 
                onChange={onChange} 
                options={[
                  { value: '', label: 'Select current position' },
                  { value: 'frontend', label: 'Frontend Developer' },
                  { value: 'backend', label: 'Backend Developer' },
                  { value: 'full stack', label: 'Full Stack Developer' },
                  { value: 'data scientist', label: 'Data Scientist' },
                  { value: 'ai-ml', label: 'AI/ML Engineer' },
                  { value: 'qa', label: 'QA Engineer' },
                  { value: 'other', label: 'Other' },
                ]} 
                required 
              />
              
              <TextField 
                type="text" 
                label={fieldLabels.preferred_salary} 
                name="preferred_salary" 
                value={form.preferred_salary} 
                onChange={onChange} 
                placeholder="Enter expected salary (e.g., 15 LPA)"
              />
              
              <SelectField 
                label={fieldLabels.looking_for}
                name="looking_for"
                value={form.looking_for} 
                onChange={onChange} 
                options={[
                  { value: '', label: 'Select job role' },
                  { value: 'frontend', label: 'Frontend Developer' },
                  { value: 'backend', label: 'Backend Developer' },
                  { value: 'full stack', label: 'Full Stack Developer' },
                  { value: 'data scientist', label: 'Data Scientist' },
                  { value: 'ai-ml', label: 'AI/ML Engineer'},
                  { value: 'qa', label: 'QA Engineer'},
                  { value: 'other', label: 'Other'}

                ]}
              />
              
              <SelectField 
                label={fieldLabels.user_role} 
                name="user_role" 
                value={form.user_role} 
                onChange={onChange} 
                options={[
                  { value: '', label: 'Select employment type' },
                  { value: 'contractor', label: 'Contractor'},
                  { value: 'full-time', label: 'Full-time'},
                  { value: 'part-time', label: 'Part-time'},
                  { value: 'any', label: 'Any'},
                ]} 
              />
              
              <div className="file-row">
                <label>{fieldLabels.resume}</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="resume" 
                    accept="application/pdf" 
                    onChange={onChange} 
                    className="file-input" 
                  />
                  <span className="file-label">
                    {form.resume ? (typeof form.resume === 'string' ? form.resume.split('/').pop() : form.resume.name) : 'Choose PDF file'}
                  </span>
                </div>
                <small className="file-hint">Upload a PDF file. Max 5MB.</small>
              </div>
            </div>

            <div className="btn-row">
              {resumeUrl && (
                <button
                  type="button"
                  onClick={handleViewResume}
                  disabled={loading}
                  className="btn"
                  title="View your uploaded resume"
                >
                  View Resume
                </button>
              )}
              <button type="button" onClick={handleDelete} disabled={loading} className="btn btn-danger">
                {loading ? 'Please wait...' : 'Delete Profile'}
              </button>
              <button type="submit" disabled={loading} className="submit-btn" style={{ minWidth: 140 }}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
        {confirmOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Delete Profile</h3>
              <p>This action will permanently remove your profile and sign you out. This cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn" onClick={() => setConfirmOpen(false)} disabled={loading}>Cancel</button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await doDelete();
                    setConfirmOpen(false);
                  }}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete' }
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

function TextField({ label, name, value, onChange, type = 'text', required, min, step }) {
  return (
    <div className="form-group">
      <label>{label}{required ? ' *' : ''}</label>
      <input
        className="input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        step={step}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div className="form-group">
      <label>{label}{required ? ' *' : ''}</label>
      <select name={name} value={value} onChange={onChange} required={required} className="select">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
