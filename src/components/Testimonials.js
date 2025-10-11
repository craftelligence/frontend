import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Testimonials.css';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);

  const testimonials = [
    {
      id: 1,
      name: "Krishna Kumar",
      role: "Founder",
      company: "EvidenceMD.ai",
      avatar: "fas fa-brain",
      text: "Craftelligence built our entire platform — backend, frontend, and AI integration — with unmatched precision. Their LLM expertise made our medical assistant accurate and reliable for real-world clinicians.",
      detailedText: "Working with Craftelligence transformed our AI-driven healthcare vision into a production-ready platform. Their team built everything from backend APIs to a clean React frontend and handled all LLM integrations with deep understanding of medical context. What impressed me most was how they made our AI not just conversational — but evidence-backed, reliable, and clinically meaningful. The collaboration felt seamless, with fast turnarounds and clear communication at every step.",
      project: "EvidenceMD.ai",
      accentColor: "#00ff66",
      linkedinUrl: "https://www.linkedin.com/company/evidencemd/",
      logo: null
    },
    {
      id: 2,
      name: "Olivia Harris",
      role: "Director",
      company: "AU Legal Docs Platform",
      avatar: "fas fa-file-contract",
      text: "Their team delivered a secure, automated system for legal document generation. From AWS integration to payment workflows, everything runs seamlessly — truly production-grade engineering.",
      detailedText: "We needed a secure legal automation platform that complied with Australian data and privacy standards. Craftelligence designed and developed the entire backend in FastAPI, integrated AWS services, and automated PDF generation and payments via Stripe. Their architectural clarity and data-handling precision exceeded expectations. What stood out most was their attention to user experience and legal compliance — they made a complex system feel simple for end users.",
      project: "AU Legal Docs Platform",
      accentColor: "#8a2be2",
      linkedinUrl: "#"
    },
    {
      id: 3,
      name: "Michael Reed",
      role: "Co-Founder",
      company: "Community 365",
      avatar: "fas fa-shield-alt",
      text: "Craftelligence turned our vision for a community safety app into reality. Their technical depth in mobile, API, and real-time systems gave us a reliable and fast-performing platform.",
      detailedText: "Our challenge was to build a robust, real-time mobile safety solution that could scale across communities. Craftelligence developed both the React Native frontend and the FastAPI backend, integrating geolocation, Twilio messaging, and alert systems in record time. The result is a high-performing, user-friendly app with low latency and rock-solid reliability. Their problem-solving mindset and deep system design expertise made all the difference.",
      project: "Community 365",
      accentColor: "#ff6347",
      linkedinUrl: "#"
    },
    {
      id: 4,
      name: "Sarah Patel",
      role: "CTO",
      company: "Asper AI",
      avatar: "fas fa-project-diagram",
      text: "They developed our ontology and data harmonization engine with remarkable insight. Their work in LLMs, Neo4j, and data mapping automation set new standards for our internal AI workflows.",
      detailedText: "We engaged Craftelligence to help build our ontology generation and data harmonization pipeline — a critical backbone for our AI knowledge graph. They engineered Neo4j-based backend services, created ML models for contextual mapping, and even integrated Azure and LLM pipelines for automation. The result is a scalable, intelligent system that aligns data semantics across multiple enterprise domains. Their expertise in AI infrastructure and applied machine learning has been truly world-class.",
      project: "Asper AI",
      accentColor: "#ffa500",
      linkedinUrl: "#"
    }
  ];

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);


  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex, nextTestimonial]);

  // Calculate positions for stacked cards
  const getStackedCards = () => {
    const cards = [];
    for (let i = 0; i < Math.min(3, testimonials.length); i++) {
      const index = (currentIndex + i) % testimonials.length;
      cards.push({
        ...testimonials[index],
        position: i
      });
    }
    return cards;
  };

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-bg"></div>

      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="testimonials-label">TESTIMONIALS</span>
          <h2 className="testimonials-main-title">
            TRUSTED BY FOUNDERS<br />
            BACKED BY RESULTS
          </h2>
          <p className="testimonials-intro">
            Results that speak through founder voices.
          </p>
        </div>

        <div className="testimonials-content">
          <div className="cards-stack">
            <AnimatePresence mode="popLayout">
              {getStackedCards().map((testimonial, index) => (
                        <motion.div
                          key={testimonial.id}
                          className={`testimonial-card stack-${index}`}
                          initial={{
                            scale: 0.9 - (index * 0.05),
                            y: index * 20,
                            opacity: 0,
                            rotateX: 5
                          }}
                          animate={{
                            scale: 0.9 - (index * 0.05),
                            y: index * 20,
                            opacity: 1 - (index * 0.3),
                            rotateX: 0,
                            zIndex: 10 - index
                          }}
                          exit={{
                            scale: 0.9,
                            y: -100,
                            opacity: 0,
                            rotateX: -10,
                            transition: { duration: 0.3 }
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            opacity: { duration: 0.3 }
                          }}
                          style={{
                            pointerEvents: index === 0 ? 'auto' : 'none',
                            borderColor: testimonial.accentColor,
                            background: 'linear-gradient(135deg, rgba(255, 99, 71, 0.15), rgba(255, 215, 0, 0.15), rgba(0, 255, 102, 0.15))',
                            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)`
                          }}
                        >
                  <div className="card-header">
                    <div className="logo-badge" style={{ color: testimonial.accentColor }}>
                      {testimonial.project === "EvidenceMD.ai" ? (
                        <div className="company-logo-container">
                          <div className="evidence-md-logo">
                            <span className="evidence-text">Evidence</span>
                            <span className="md-text">MD</span>
                            <span className="ai-text">.ai</span>
                          </div>
                        </div>
                      ) : (
                        testimonial.project
                      )}
                    </div>
                    <div className="card-tab" style={{ 
                      background: `rgba(${parseInt(testimonial.accentColor.slice(1,3), 16)}, ${parseInt(testimonial.accentColor.slice(3,5), 16)}, ${parseInt(testimonial.accentColor.slice(5,7), 16)}, 0.2)` 
                    }}></div>
                    <div className="dot-indicator" style={{ background: testimonial.accentColor }}></div>
                  </div>

                          <div className="card-content">
                            <div className="quote-icon" style={{ color: testimonial.accentColor }}>❝</div>
                            <p className="testimonial-text">
                              {expandedCard === testimonial.id ? testimonial.detailedText : testimonial.text}
                            </p>
                            {expandedCard !== testimonial.id && (
                              <button 
                                className="show-more-btn"
                                onClick={() => {
                                  setExpandedCard(testimonial.id);
                                  setIsAutoPlaying(false);
                                }}
                                style={{ color: testimonial.accentColor }}
                              >
                                Show More
                              </button>
                            )}
                            {expandedCard === testimonial.id && (
                              <button 
                                className="show-less-btn"
                                onClick={() => setExpandedCard(null)}
                                style={{ color: testimonial.accentColor }}
                              >
                                Show Less
                              </button>
                            )}
                          </div>

                  <div className="card-footer">
                    <div className="avatar-icon">
                      <i className={testimonial.avatar} style={{ color: testimonial.accentColor }}></i>
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-role">{testimonial.role} of {testimonial.company}</p>
                    </div>
                     <a href={testimonial.linkedinUrl} className="linkedin-icon" style={{ background: testimonial.accentColor }} target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="testimonials-controls">
            <motion.button
              className="nav-button prev"
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ 
                borderColor: testimonials[currentIndex]?.accentColor, 
                color: testimonials[currentIndex]?.accentColor 
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </motion.button>

            <motion.button
              className="nav-button next"
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ 
                borderColor: testimonials[currentIndex]?.accentColor, 
                color: testimonials[currentIndex]?.accentColor 
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </motion.button>
          </div>

          <div className="autoplay-controls">
            <motion.button
              className={`autoplay-toggle ${isAutoPlaying ? 'playing' : ''}`}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAutoPlaying ? 'Pause' : 'Play'} Auto-scroll
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;