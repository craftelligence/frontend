import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import './Landing.css';

const experts = [
  { name: 'Unnati Singh', role: 'Founder', bio: 'Shapes the product vision and turns rough ideas into interfaces people love to use.', photo: '/team/unnati.png', linkedin: 'https://www.linkedin.com/in/itisus/', tone: 'lilac', origin: '4% 0%' },
  { name: 'Mukesh Kumar', role: 'Founder', bio: 'Sets the technical direction and builds the systems that keep everything running at scale.', photo: '/team/mukesh.png', linkedin: 'https://www.linkedin.com/in/itismukesh/', tone: 'mint', zoom: 1.1, origin: '44% 0%' },
  { name: 'Ajay Kumar', role: 'Founding Member', bio: 'Designs the architecture and brings AI into products in ways that actually ship.', photo: '/team/ajay.png', linkedin: 'https://www.linkedin.com/in/itisajay/', tone: 'peach' },
  { name: 'Jayant Singh', role: 'Software Engineer', bio: 'Full-stack engineer who ships end to end, from clean APIs to smooth deploys.', photo: '/team/jayant.png', linkedin: 'https://www.linkedin.com/in/jaicodes/', tone: 'sun', zoom: 1.5, origin: '53% 0%' },
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
              <span className="team-avatar">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} loading="lazy" style={{ ...(member.zoom ? { transform: `scale(${member.zoom})` } : {}), ...(member.origin ? { transformOrigin: member.origin } : {}), ...(member.pos ? { objectPosition: member.pos } : {}) }} />
                ) : (
                  initials(member.name)
                )}
              </span>
              <a className="team-social" href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`}>
                <Linkedin size={16} />
              </a>
            </div>
            <h3>{member.name}</h3>
            <span className="team-role">{member.role}</span>
            <p className="team-bio">{member.bio}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Team;
