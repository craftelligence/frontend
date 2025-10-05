import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import "./Hero.css";

// Counter for stats
const Counter = ({ from, to, duration = 2 }) => {
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

const Hero = () => {
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".hero");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          controls.start("visible");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="home" className="hero">
      {/* background green lines layer */}
      <div className="green-lines"></div>

      <div className="hero-main">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Remote-First Engineering Excellence
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          We design scalable backend systems, agentic platforms, SaaS products,
          and AI-powered solutions for startups and enterprises worldwide.
        </motion.p>

        <motion.button
          className="cta-button"
          onClick={scrollToContact}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Let’s Talk <i className="fas fa-arrow-right"></i>
        </motion.button>
      </div>

      {/* Hero Cards */}
      <motion.div
        className="hero-cards"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* About Us */}
        <motion.div className="hero-card" variants={cardVariants}>
          <div className="card-icon"><i className="fas fa-users"></i></div>
          <h3>About Us</h3>
          <p>
            A global, remote-first engineering team that empowers businesses to innovate, scale, and thrive.
          </p>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: "0%" }}
              animate={controls}
              variants={{
                visible: { width: "95%", transition: { duration: 1.5 } },
              }}
            />
          </div>
          <span>Team Growth 95%</span>
        </motion.div>

        {/* Services */}
        <motion.div className="hero-card" variants={cardVariants}>
          <div className="card-icon"><i className="fas fa-cogs"></i></div>
          <h3>Services</h3>
          <p>
            From backend systems to AI-powered platforms, we deliver future-ready technology.
          </p>
          <div className="graph">
            <motion.div className="bar" initial={{ height: "0%" }} animate={controls}
              variants={{ visible: { height: "40%", transition: { duration: 1 } } }} />
            <motion.div className="bar" initial={{ height: "0%" }} animate={controls}
              variants={{ visible: { height: "70%", transition: { duration: 1.2 } } }} />
            <motion.div className="bar" initial={{ height: "0%" }} animate={controls}
              variants={{ visible: { height: "90%", transition: { duration: 1.4 } } }} />
            <motion.div className="bar" initial={{ height: "0%" }} animate={controls}
              variants={{ visible: { height: "60%", transition: { duration: 1.6 } } }} />
          </div>
          <span>System Performance Metrics</span>
        </motion.div>

        {/* Works */}
        <motion.div className="hero-card" variants={cardVariants}>
          <div className="card-icon"><i className="fas fa-rocket"></i></div>
          <h3>Works</h3>
          <p>Delivered projects that push boundaries and fuel growth.</p>
          <div className="stats">
            <div className="stat-box">
              <h4><Counter from={0} to={20} duration={2} />+</h4>
              <p>Projects</p>
            </div>
            <div className="stat-box">
              <h4><Counter from={0} to={100} duration={2} />%</h4>
              <p>Success Rate</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
