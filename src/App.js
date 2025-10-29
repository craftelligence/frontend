import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import './App.css';

// Lazy load components for better performance
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Projects = lazy(() => import('./components/Projects'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const DeveloperRegistration = lazy(() => import('./components/DeveloperRegistration'));

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '18px',
    color: '#00ff66'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <Suspense fallback={<LoadingSpinner />}>
                <About />
              </Suspense>
              <Suspense fallback={<LoadingSpinner />}>
                <Services />
              </Suspense>
              <Suspense fallback={<LoadingSpinner />}>
                <Projects />
              </Suspense>
              <Suspense fallback={<LoadingSpinner />}>
                <Testimonials />
              </Suspense>
              <Suspense fallback={<LoadingSpinner />}>
                <Contact />
              </Suspense>
              <Suspense fallback={<LoadingSpinner />}>
                <Footer />
              </Suspense>
            </>
          } />
          <Route path="/developer-registration" element={
            <Suspense fallback={<LoadingSpinner />}>
              <DeveloperRegistration />
            </Suspense>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 