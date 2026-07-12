import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check, X } from 'lucide-react';
import './Landing.css';

const projects = [
  {
    name: 'EvidenceMD.ai',
    type: 'Healthcare AI',
    copy: 'An evidence-based AI assistant that gives clinicians reliable, contextual answers.',
    result: '95% accuracy in medical information retrieval',
    image: '/EvidenceMD.png',
    images: ['/EvidenceMD.png', '/EvidenceMD2.png', '/EvidenceMD3.png', '/EvidenceMD4.png'],
    link: 'https://evidencemd.ai/',
    tone: 'mint',
    services: ['Clinical AI', 'Web & mobile', 'Evidence engine'],
    highlights: [
      'Chain-of-thought clinical reasoning with inline, verifiable citations',
      'Evidence-based AI scribe that turns encounters into structured notes',
      'OpenAI-compatible medical API teams can build on',
    ],
  },
  {
    name: 'AU Legal Docs',
    type: 'Legal tech',
    copy: 'A secure self-service platform for automated, compliant legal documentation.',
    result: '85% less time spent creating documents',
    image: '/EaseLaw.png',
    images: ['/EaseLaw.png', '/EaseLaw2.png'],
    link: 'https://www.easelaw.ai/',
    tone: 'lilac',
    services: ['Document automation', 'Compliance', 'Web app'],
    highlights: [
      'Guided, template-driven document generation',
      'Built-in compliance checks with a full audit trail',
      'Secure self-service portal for clients',
    ],
  },
  {
    name: 'Community 365',
    type: 'Safety & security',
    copy: 'A real-time mobile safety app for alerts, trusted circles, and peace of mind.',
    result: '99.9% alert delivery success',
    tone: 'peach',
    services: ['Mobile app', 'Real-time alerts', 'Geolocation'],
    highlights: [
      'One-tap SOS alerts to your trusted circle',
      'Live location sharing with reliable delivery',
      'Real-time notifications built for scale',
    ],
  },
  {
    name: 'Asper AI',
    type: 'Enterprise AI',
    copy: 'Ontology generation and data harmonization for connected enterprise knowledge.',
    result: '70% less manual data mapping',
    tone: 'sun',
    services: ['Enterprise AI', 'Data harmonization', 'Knowledge graph'],
    highlights: [
      'Automated ontology generation from raw data',
      'Smart mapping across disconnected sources',
      'A connected knowledge layer for the enterprise',
    ],
  },
];

const Projects = () => {
  const [active, setActive] = useState(null);
  const [shot, setShot] = useState(0);
  const activeIndex = active ? projects.indexOf(active) : -1;
  const gallery = active ? (active.images && active.images.length ? active.images : active.image ? [active.image] : []) : [];

  const openProject = (project) => {
    setActive(project);
    setShot(0);
  };

  return (
    <section id="projects" className="clean-section projects">
      <div className="page-shell">
        <div className="section-intro split-intro">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2>Real products. Measurable progress.</h2>
          </div>
          <p>A few examples of the product, platform, and AI work we’ve had the pleasure to ship.</p>
        </div>
        <div className="project-grid">
          {projects.map((project, i) => (
            <motion.article
              className={`project-card ${project.tone}`}
              key={project.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => openProject(project)}
            >
              <div className="project-visual">
                {project.image ? <img src={project.image} alt={`${project.name} preview`} /> : <span>{String(i + 1).padStart(2, '0')}</span>}
              </div>
              <div className="project-meta">
                <span>{project.type}</span>
                <button aria-label={`Read about ${project.name}`}><ArrowUpRight size={18} /></button>
              </div>
              <h3>{project.name}</h3>
              <p>{project.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div className="project-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div
              className={`modal-card ${active.tone}`}
              initial={{ y: 24, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setActive(null)} aria-label="Close"><X size={20} /></button>
              <div className="modal-visual">
                {gallery.length ? (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={gallery[shot]}
                      src={gallery[shot]}
                      alt={`${active.name} preview`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </AnimatePresence>
                ) : (
                  <span className="modal-num">{String(activeIndex + 1).padStart(2, '0')}</span>
                )}
                <span className="modal-type">{active.type}</span>
              </div>
              {gallery.length > 1 && (
                <div className="modal-shots">
                  {gallery.map((src, idx) => (
                    <button
                      key={src}
                      className={idx === shot ? 'is-active' : ''}
                      onClick={() => setShot(idx)}
                      aria-label={`View screenshot ${idx + 1}`}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
              <div className="modal-body">
                <h2>{active.name}</h2>
                <p>{active.copy}</p>
                {active.services && (
                  <div className="modal-tags">
                    {active.services.map((service) => (
                      <span key={service}>{service}</span>
                    ))}
                  </div>
                )}
                {active.highlights && (
                  <ul className="modal-highlights">
                    {active.highlights.map((item) => (
                      <li key={item}><Check size={15} strokeWidth={2.5} /> {item}</li>
                    ))}
                  </ul>
                )}
                <div className="result-note"><strong>Outcome</strong>{active.result}</div>
                {active.link && (
                  <a className="modal-visit" href={active.link} target="_blank" rel="noreferrer">Visit site <ArrowUpRight size={16} /></a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
