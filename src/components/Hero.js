import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, ChartNoAxesCombined, Sparkles } from 'lucide-react';
import './Landing.css';

const Hero = () => {
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="hero clean-section">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="page-shell hero-layout">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <span className="eyebrow"><Sparkles size={14} /> Thoughtful tech, built to last</span>
          <h1>Make your bold idea<br /><em>beautifully real.</em></h1>
          <p>We’re a remote-first engineering studio helping ambitious teams turn complex ideas into reliable digital products.</p>
          <div className="hero-actions">
            <motion.button className="button button-primary" onClick={scrollToContact} whileTap={{ scale: 0.97 }}>Start a conversation <ArrowRight size={17} /></motion.button>
            <button className="button button-quiet" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>See our work</button>
          </div>
          <div className="hero-proof"><span className="proof-dot" /> Available for carefully chosen projects</div>
        </motion.div>
        <motion.div className="hero-art" initial={{ opacity: 0, scale: 0.92, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
          <div className="art-window">
            <div className="art-top"><span /><span /><span /><p>craftelligence / studio</p></div>
            <div className="art-body">
              <div className="art-title">The build is<br /><strong>in motion.</strong></div>
              <div className="art-orbit"><Bot size={30} /><i /><i /><i /></div>
              <div className="art-bars"><span /><span /><span /><span /></div>
            </div>
          </div>
          <motion.div className="floating-note note-top" animate={{ y: [0, -9, 0] }} transition={{ duration: 4, repeat: Infinity }}><Bot size={17} /> AI systems</motion.div>
          <motion.div className="floating-note note-bottom" animate={{ y: [0, 9, 0] }} transition={{ duration: 4.5, repeat: Infinity }}><ChartNoAxesCombined size={17} /> Scale-ready</motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
