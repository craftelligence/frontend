import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './Landing.css';

const services = [
  ['/agentic_platforms.jpg', 'Agentic platforms', 'Useful AI agents and LLM systems that coordinate real work.'],
  ['/ai_ml.png', 'AI & machine learning', 'Models and intelligent automation built around your data.'],
  ['/mcp_servers.png', 'MCP servers', 'Context-aware AI integrations that connect your tools.'],
  ['/digital_twin_solution.webp', 'Digital twins', 'Real-time systems for visibility, simulation, and better decisions.'],
  ['/saas.png', 'SaaS development', 'Cloud-native products designed to grow without growing pains.'],
  ['/da_bi.webp', 'Data & BI', 'Clear dashboards and data pipelines that turn signals into action.'],
  ['/Custom_Software.png', 'Custom software', 'Purpose-built apps, APIs, and admin experiences for your team.'],
];

const Services = () => (
  <section id="services" className="clean-section services">
    <div className="page-shell">
      <div className="section-intro centered">
        <span className="eyebrow">What we’re good at</span>
        <h2>Technical depth, made delightfully simple.</h2>
        <p>Choose one capability or bring us the whole challenge. We’ll shape the right path together.</p>
      </div>
      <div className="service-grid">
        {services.map(([img, title, copy], index) => (
          <motion.article
            className="service-card"
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-35px' }}
            transition={{ delay: (index % 3) * 0.07 }}
          >
            <div className="service-media">
              <img src={img} alt={title} loading="lazy" />
            </div>
            <div className="service-body">
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href="#contact" aria-label={`Ask about ${title}`}>Let’s explore <ArrowUpRight size={16} /></a>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
