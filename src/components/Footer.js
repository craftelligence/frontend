import React from 'react';
import { ArrowUpRight, Linkedin } from 'lucide-react';
import BrandMark from './BrandMark';
import './Landing.css';
const Footer = () => <footer className="footer-simple"><div className="page-shell footer-inner"><div className="footer-brand"><BrandMark /><div><strong>craftelligence</strong><span>We build. You scale.</span></div></div><div className="footer-links"><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Work</a><a href="https://www.linkedin.com/company/craftelligence" target="_blank" rel="noreferrer">LinkedIn <Linkedin size={14} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Craftelligence</span><a href="mailto:hello@craftelligence.tech">hello@craftelligence.tech <ArrowUpRight size={14} /></a></div></div></footer>;
export default Footer;
