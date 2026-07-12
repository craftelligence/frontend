import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import './Landing.css';

const linePath = 'M0 82 C 28 62, 46 74, 72 52 S 118 30, 150 46 S 206 20, 238 28 S 286 12, 300 16';
const areaPath = `${linePath} L300 110 L0 110 Z`;

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

        <motion.div className="hero-art" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
          <motion.div
            className="hero-panel"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="hero-panel-top"><i /><i /><i /><p>craftelligence · delivery</p></div>
            <div className="hero-panel-body">
              <div className="hp-row">
                <div>
                  <small>Products shipped</small>
                  <strong>128</strong>
                </div>
                <span className="hp-trend"><TrendingUp size={13} /> +24%</span>
              </div>
              <svg className="hp-chart" viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9be0c4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#9be0c4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={areaPath}
                  fill="url(#heroFill)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="#166b53"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, delay: 0.4, ease: 'easeInOut' }}
                />
              </svg>
              <div className="hp-tags"><span>AI</span><span>Cloud</span><span>APIs</span><span>Data</span></div>
            </div>
          </motion.div>

          <motion.div
            className="hero-code"
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="hc-top"><i /><i /><i /></div>
            <pre>
{``}<span className="c-key">const</span>{` craft = () =>
  `}<span className="c-fn">ship</span>{`(idea, {
    ai: `}<span className="c-str">true</span>{`,
    scale: `}<span className="c-str">"ready"</span>{`,
  });`}<span className="c-cur">▍</span>
            </pre>
          </motion.div>

          <motion.div
            className="hero-chip"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="chip-dot" /> Shipped to production
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
