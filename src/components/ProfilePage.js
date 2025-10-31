import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { deleteUser, signOut, onAuthStateChanged } from 'firebase/auth';
import './ProfilePage.css';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

const initialState = {
  name: '',
  email: '',
  phone_no: '',
  availability: '',
  interested_location: '',
  start_date: '',
  current_job_location: '',
  job_status: '',
  experience_years: '',
  current_position: '',
  resume: null,
};

const fieldLabels = {
  name: 'Full Name',
  email: 'Email',
  phone_no: 'Phone Number',
  availability: 'Availability',
  interested_location: 'Interested Location',
  start_date: 'Start Date',
  current_job_location: 'Current Job Location',
  job_status: 'Job Status',
  experience_years: 'Experience (years)',
  current_position: 'Current Position',
  resume: 'Resume (PDF)',
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
        // Map backend fields to form state
        setForm((prev) => ({
          ...prev,
          name: data.name ?? prev.name ?? '',
          email: data.email ?? prev.email ?? '',
          phone_no: data.phone_no ?? '',
          availability: data.availability ?? '',
          interested_location: data.interested_location ?? '',
          start_date: data.start_date ?? '',
          current_job_location: data.current_job_location ?? '',
          job_status: data.job_status ?? '',
          experience_years: data.experience_years !== undefined && data.experience_years !== null ? String(data.experience_years) : prev.experience_years,
          current_position: data.current_position ?? '',
          resume: null, // file input not prefilled
        }));
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
      navigate('/');
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
      phone_no,
      availability,
      interested_location,
      start_date,
      current_job_location,
      job_status,
      current_position,
      resume,
    } = form;
    return (
      !!name &&
      !!email &&
      !!phone_no &&
      !!availability &&
      !!interested_location &&
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
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
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
        setMessage('Profile updated successfully.');
        return;
      }

      // If update failed with 404, try create
      if (putRes.status === 404) {
        if (!isCreatePayloadValid) {
          throw new Error('Please complete all required fields and attach a PDF resume to create your profile.');
        }
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
        setMessage('Profile created successfully.');
        return;
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
        navigate('/');
        return;
      } catch (authErr) {
        await signOut(auth).catch(() => {});
        navigate('/');
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

  return (
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
              <TextField label={fieldLabels.name} name="name" value={form.name} onChange={onChange} required />
              <TextField type="email" label={fieldLabels.email} name="email" value={form.email} onChange={onChange} required />
              <TextField label={fieldLabels.phone_no} name="phone_no" value={form.phone_no} onChange={onChange} required />
              <SelectField label={fieldLabels.availability} name="availability" value={form.availability} onChange={onChange} options={[
                { value: '', label: 'Select availability' },
                { value: 'full-time', label: 'Full Time (40hrs/week)' },
                { value: 'part-time', label: 'Part Time (20hrs/week)' },
              ]} required />
              <SelectField label={fieldLabels.interested_location} name="interested_location" value={form.interested_location} onChange={onChange} options={[
                { value: '', label: 'Select location' },
                { value: 'remote', label: 'Remote' },
                { value: 'onsite', label: 'Onsite' },
                { value: 'both', label: 'Both Remote & Onsite' },
              ]} required />
              <SelectField label={fieldLabels.start_date} name="start_date" value={form.start_date} onChange={onChange} options={[
                { value: '', label: 'Select start date' },
                { value: 'immediately', label: 'Immediately' },
                { value: '15 days', label: '15 days' },
                { value: '1 month', label: '1 month' },
              ]} required />
              <TextField label={fieldLabels.current_job_location} name="current_job_location" value={form.current_job_location} onChange={onChange} required />
              <SelectField label={fieldLabels.job_status} name="job_status" value={form.job_status} onChange={onChange} options={[
                { value: '', label: 'Select status' },
                { value: 'employed', label: 'Employed' },
                { value: 'unemployed', label: 'Unemployed' },
              ]} required />
              <TextField type="number" min="0" step="0.1" label={fieldLabels.experience_years} name="experience_years" value={form.experience_years} onChange={onChange} required />
              <SelectField label={fieldLabels.current_position} name="current_position" value={form.current_position} onChange={onChange} options={[
                { value: '', label: 'Select current position' },
                { value: 'frontend', label: 'Frontend' },
                { value: 'backend', label: 'Backend' },
                { value: 'full stack', label: 'Full Stack' },
                { value: 'data scientist', label: 'Data Scientist' },
                { value: 'other', label: 'Other' },
              ]} required />
              <div className="file-row">
                <label>{fieldLabels.resume}</label>
                <div className="file-input-wrapper">
                  <input type="file" name="resume" accept="application/pdf" onChange={onChange} className="file-input" />
                  <span className="file-label">{form.resume ? form.resume.name : 'Choose PDF file'}</span>
                </div>
                <small className="file-hint">Upload a PDF file. Max 5MB.</small>
              </div>
            </div>

            <div className="btn-row">
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
