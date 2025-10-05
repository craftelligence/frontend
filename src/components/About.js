import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './About.css';

// Counter Component
const Counter = ({ from, to, duration }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [from, to, duration]);

  return <span>{count}</span>;
};

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="about" className="about section" ref={ref}>
      {/* Animated Background */}
      <div className="about-bg-grid"></div>
      
      <div className="container">
        {/* Header Section */}
        <motion.div 
          className="about-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="about-label">ABOUT US</span>
          <h2 className="about-main-title">
            Unveiling Our Identity,<br />
            Vision and Values
          </h2>
          <p className="about-intro">
            Craftelligence is a remote-first engineering team helping startups and enterprises 
            design and deliver scalable backend systems, agentic platforms, SaaS products, 
            and AI-powered solutions.
          </p>
        </motion.div>

        {/* Values Pills */}
        <motion.div 
          className="values-container"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="values-pill-wrapper">
            <div className="value-pill">
              <i className="fas fa-shield-alt"></i>
              <span>Safety</span>
            </div>
            <div className="value-pill">
              <i className="fas fa-cogs"></i>
              <span>Efficient</span>
            </div>
            <div className="value-pill">
              <i className="fas fa-crosshairs"></i>
              <span>Precision</span>
            </div>
            <div className="value-pill">
              <i className="fas fa-lightbulb"></i>
              <span>Innovation</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="about-main-content">
          {/* Stats Section */}
          <motion.div 
            className="stats-section"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="content-heading">Remote-First Engineering Excellence</h3>
            <p className="content-text">
              Craftelligence is a remote-first engineering team helping startups and enterprises 
              design and deliver scalable backend systems, agentic platforms, SaaS products, 
              and AI-powered solutions. We offer end-to-end project execution or dedicated 
              developer support depending on client needs.
            </p>
            <p className="content-text">
              Our team operates globally, bringing together diverse expertise to create 
              innovative solutions that drive business growth and technological advancement.
            </p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">
                  <Counter from={0} to={20} duration={2}/>+
                </div>
                <div className="stat-label">Projects Delivered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  <Counter from={0} to={10} duration={2}/>+
                </div>
                <div className="stat-label">Happy Clients</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  <Counter from={0} to={24} duration={2}/>
                </div>
                <div className="stat-label">Support Hours</div>
              </div>
            </div>
          </motion.div>

          {/* Vision & Mission Cards */}
          <motion.div 
            className="vision-mission-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="vm-card vision-card">
              <div className="vm-header">
                <i className="fas fa-eye"></i>
                <h3>Vision</h3>
              </div>
              <p>
                To lead the way in engineering by delivering innovative, 
                sustainable, and cost-effective solutions.
              </p>
              <div className="vision-chart">
                <div className="chart-bar" style={{height: "70%"}}>
                  <span className="bar-label">70%</span>
                </div>
                <div className="chart-bar" style={{height: "85%"}}>
                  <span className="bar-label">85%</span>
                </div>
                <div className="chart-bar" style={{height: "60%"}}>
                  <span className="bar-label">60%</span>
                </div>
              </div>
            </div>

            <div className="vm-card mission-card">
              <div className="vm-header">
                <i className="fas fa-bullseye"></i>
                <h3>Mission</h3>
              </div>
              <p>
                To leverage expertise, resources, and technology to deliver 
                engineering solutions that exceed global standards.
              </p>
              <div className="mission-chart">
                <div className="progress-circle">
                  <div className="rotating-border"></div>
                  <span className="progress-value">100%</span>
                </div>
                <p className="progress-label">Client Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;