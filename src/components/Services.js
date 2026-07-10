import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BrainCircuit, CloudCog, Database, Network, PanelsTopLeft, Sparkles, Workflow } from 'lucide-react';
import './Landing.css';

const services = [
  [BrainCircuit, 'Agentic platforms', 'Useful AI agents and LLM systems that coordinate real work.'],
  [Sparkles, 'AI & machine learning', 'Models and intelligent automation built around your data.'],
  [Network, 'MCP servers', 'Context-aware AI integrations that connect your tools.'],
  [Workflow, 'Digital twins', 'Real-time systems for visibility, simulation, and better decisions.'],
  [CloudCog, 'SaaS development', 'Cloud-native products designed to grow without growing pains.'],
  [Database, 'Data & BI', 'Clear dashboards and data pipelines that turn signals into action.'],
  [PanelsTopLeft, 'Custom software', 'Purpose-built apps, APIs, and admin experiences for your team.']
];
const Services = () => <section id="services" className="clean-section services"><div className="page-shell"><div className="section-intro centered"><span className="eyebrow">What we’re good at</span><h2>Technical depth, made delightfully simple.</h2><p>Choose one capability or bring us the whole challenge. We’ll shape the right path together.</p></div><div className="service-grid">{services.map(([Icon, title, copy], index) => <motion.article className="service-card" key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-35px' }} transition={{ delay: (index % 3) * .07 }}><div className="service-icon"><Icon size={23} /></div><h3>{title}</h3><p>{copy}</p><a href="#contact" aria-label={`Ask about ${title}`}>Let’s explore <ArrowUpRight size={16} /></a></motion.article>)}</div></div></section>;
export default Services;
