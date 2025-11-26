
import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIModal from './components/AIModal';
import InteractiveBackground from './components/InteractiveBackground';

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Page Wrapper for Transitions
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="min-h-screen flex flex-col w-full" 
  >
    {children}
  </motion.div>
);

// Main Landing Page Structure
const MainLanding: React.FC = () => {
  return (
    <>
        <Hero />
        {/* Note: The Manifesto/Prologue is now integrated into Hero for the continuous scroll effect */}
    </>
  );
};

// Composite About Page Component
const AboutPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="pt-24">
        <Experience />
        <Skills />
        <Contact />
      </div>
    </PageWrapper>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main: Book Cover -> Prologue */}
        <Route path="/" element={
            <PageWrapper>
                <MainLanding />
            </PageWrapper>
        } />
        
        {/* Work: The Project Pages */}
        <Route path="/work" element={
            <PageWrapper>
                <Projects />
            </PageWrapper>
        } />

        {/* About: History & Contact */}
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
        <ScrollToTop />
        {/* Removed overflow-x-hidden from here to prevent sticky issues in some browsers, handling on body via CSS if needed */}
        <div className="bg-paper text-ink min-h-screen selection:bg-accent selection:text-white relative flex flex-col font-sans">
        
        {/* Book Spine / Gutter Shadow Overlay - Visible on all pages to maintain theme */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0 hidden md:block">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-ink/5 to-transparent mx-auto"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ink/5 to-transparent w-24 mx-auto opacity-30"></div>
        </div>

        {/* Subtle Background */}
        <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
        <InteractiveBackground />

        <Navbar />
        
        <main className="relative z-10 flex-grow flex flex-col">
            <AnimatedRoutes />
        </main>

        <Footer />
        <AIModal />
        </div>
    </Router>
  );
};

export default App;
