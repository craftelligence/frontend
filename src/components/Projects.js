import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import './Landing.css';

const projects = [
  { name: 'EvidenceMD.ai', type: 'Healthcare AI', copy: 'An evidence-based AI assistant that gives clinicians reliable, contextual answers.', result: '95% accuracy in medical information retrieval', image: '/EvidenceMD.png', tone: 'mint' },
  { name: 'AU Legal Docs', type: 'Legal tech', copy: 'A secure self-service platform for automated, compliant legal documentation.', result: '85% less time spent creating documents', tone: 'lilac' },
  { name: 'Community 365', type: 'Safety & security', copy: 'A real-time mobile safety app for alerts, trusted circles, and peace of mind.', result: '99.9% alert delivery success', tone: 'peach' },
  { name: 'Asper AI', type: 'Enterprise AI', copy: 'Ontology generation and data harmonization for connected enterprise knowledge.', result: '70% less manual data mapping', tone: 'sun' }
];

const Projects = () => { const [active, setActive] = useState(null); return <section id="projects" className="clean-section projects"><div className="page-shell"><div className="section-intro split-intro"><div><span className="eyebrow">Selected work</span><h2>Real products. Measurable progress.</h2></div><p>A few examples of the product, platform, and AI work we’ve had the pleasure to ship.</p></div><div className="project-grid">{projects.map((project, i) => <motion.article className={`project-card ${project.tone}`} key={project.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }} onClick={() => setActive(project)}><div className="project-visual">{project.image ? <img src={project.image} alt="EvidenceMD product preview" /> : <span>{String(i + 1).padStart(2, '0')}</span>}</div><div className="project-meta"><span>{project.type}</span><button aria-label={`Read about ${project.name}`}><ArrowUpRight size={18} /></button></div><h3>{project.name}</h3><p>{project.copy}</p></motion.article>)}</div></div><AnimatePresence>{active && <motion.div className="project-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}><motion.div className="modal-card" initial={{ y: 20, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20 }} onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActive(null)} aria-label="Close"><X size={20} /></button><span className="eyebrow">{active.type}</span><h2>{active.name}</h2><p>{active.copy}</p><div className="result-note"><strong>Outcome</strong>{active.result}</div></motion.div></motion.div>}</AnimatePresence></section> };
export default Projects;
