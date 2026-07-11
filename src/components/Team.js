import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import './Landing.css';

const experts = [
  { name: 'Ajay Sihag', role: 'Founder & Lead Engineer', focus: ['Architecture', 'Backend', 'AI'], tone: 'mint' },
  { name: 'Your Name', role: 'Frontend Engineer', focus: ['React', 'UX', 'Design systems'], tone: 'lilac' },
  { name: 'Your Name', role: 'AI / ML Engineer', focus: ['LLMs', 'Data', 'Automation'], tone: 'peach' },
  { name: 'Your Name', role: 'Product Designer', focus: ['UI', 'Research', 'Prototyping'], tone: 'sun' },
];

const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

const Team = () => (
  <section id="team" className="clean-section team">
    <div className="page-shell">
      <div className="section-intro split-intro">
        <div>
          <span className="eyebrow">The people behind the craft</span>
          <h2>Meet the experts who build with you.</h2>
        </div>
        <p>A tight-knit group of engineers and designers who care about the details and stay close to the work from first sketch to launch.</p>
      </div>
      <div className="team-grid">
        {experts.map((member, index) => (
          <motion.article
            className={`team-card ${member.tone}`}
            key={`${member.name}-${index}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: index * 0.07 }}
          >
            <div className="team-top">
              <span className="team-avatar">{initials(member.name)}</span>
              <a className="team-social" href="https://www.linkedin.com/company/craftelligence" target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`}>
                <Linkedin size={16} />
              </a>
            </div>
            <h3>{member.name}</h3>
            <span className="team-role">{member.role}</span>
            <div className="team-tags">
              {member.focus.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Team;
