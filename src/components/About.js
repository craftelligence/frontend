import React from 'react';
import { motion } from 'framer-motion';
import { Compass, HeartHandshake, ShieldCheck, Zap } from 'lucide-react';
import './Landing.css';

const values = [[Compass, 'Clear thinking', 'We make the complex feel understandable.'], [Zap, 'Focused delivery', 'Small, experienced teams with real momentum.'], [ShieldCheck, 'Built with care', 'Quality and security are part of the process.'], [HeartHandshake, 'True partnership', 'Honest advice and an easy, direct working rhythm.']];

const About = () => <section id="about" className="clean-section about"><div className="page-shell">
  <div className="section-intro split-intro"><div><span className="eyebrow">A small team with big range</span><h2>Strategy, craft, and engineering in one kind place.</h2></div><p>We partner with founders and product teams from the first sketch through launch and growth—bringing calm, capable execution to the work that matters.</p></div>
  <div className="value-grid">{values.map(([Icon, title, copy], index) => <motion.article className="value-card" key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: index * 0.07 }}><div className="icon-tile"><Icon size={21} /></div><h3>{title}</h3><p>{copy}</p></motion.article>)}</div>
  <motion.div className="stats-ribbon" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}><div><strong>20+</strong><span>projects delivered</span></div><div><strong>10+</strong><span>happy clients</span></div><div><strong>24/7</strong><span>support mindset</span></div><p>Remote-first, globally connected, and genuinely invested in the result.</p></motion.div>
</div></section>;
export default About;
