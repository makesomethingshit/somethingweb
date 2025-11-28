
import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIModal from './components/AIModal';
import InteractiveBackground from './components/InteractiveBackground';
import Navigation from './components/Navigation';
import GridOverlay from './components/GridOverlay';

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Dust Overlay Component
const DustOverlay = () => {
  const [opacity, setOpacity] = React.useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // Fade out over the first 500px of scroll
      const newOpacity = Math.max(0, 1 - window.scrollY / 500);
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (opacity === 0) return null;

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed top-0 left-0 w-full h-full object-cover pointer-events-none z-[9999] mix-blend-screen"
      style={{ opacity }}
    >
      <source src="/overlays/dust.mp4" type="video/mp4" />
    </video>
  );
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
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);

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
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[url('/frames/intro_book_video00121.jpg')] bg-cover bg-center mix-blend-multiply"></div>
        <InteractiveBackground />
        <DustOverlay />
        <Navigation />

        {/* Navbar Removed */}

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
