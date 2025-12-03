import React, { useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectDetail from './pages/ProjectDetail';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIModal from './components/AIModal';
import FloatingTypography from './components/FloatingTypography';
import Navigation from './components/Navigation';
import { useIntro } from './context/IntroContext';
import PageTearTransition from './components/PageTearTransition';

// Force reload
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;
      // Fade out over the first 500px of scroll
      const newOpacity = Math.max(0, 1 - window.scrollY / 500);
      videoRef.current.style.opacity = newOpacity.toString();
      // Optimization: Hide element when invisible
      videoRef.current.style.display = newOpacity <= 0 ? 'none' : 'block';
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="fixed top-0 left-0 w-full h-full object-cover pointer-events-none z-[9999] mix-blend-screen"
      style={{ opacity: 1, willChange: 'opacity' }} // Initial opacity 1, optimized
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

// Main Landing Page Structure (Scrollytelling Implementation with CSS Sticky)
const MainLanding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const borderLayerRef = useRef<HTMLDivElement>(null);
  const pageTearRef = useRef<{ setProgress: (p: number) => void }>(null);
  const { introFinished } = useIntro();

  useEffect(() => {
    if (!introFinished || !containerRef.current) return;

    // Create ScrollTrigger for Playback (Image Sequence)
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top -100px", // Wait until user scrolls 100px down
      end: "+=50%", // Short scroll distance to trigger
      pin: false, // CSS Sticky handles pinning
      scrub: false, // Disable scrubbing
      markers: false, // Disable markers
      onEnter: () => {
        // Animate progress 0 -> 1
        const progressObj = { value: 0 };
        gsap.to(progressObj, {
          value: 1,
          duration: 5.0, // Much slower playback
          ease: "power2.inOut",
          onUpdate: () => {
            if (pageTearRef.current) {
              pageTearRef.current.setProgress(progressObj.value);
            }
          },
          overwrite: true
        });
      },
      onLeaveBack: () => {
        // Animate progress 1 -> 0
        const progressObj = { value: 1 };
        gsap.to(progressObj, {
          value: 0,
          duration: 4.0,
          ease: "power2.inOut",
          onUpdate: () => {
            if (pageTearRef.current) {
              pageTearRef.current.setProgress(progressObj.value);
            }
          },
          overwrite: true
        });
      }
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [introFinished]);

  return (
    // Scroll Container: Defines the total scroll distance (Reduced from 300vh)
    <div ref={containerRef} className="relative w-full h-[150vh]">

      {/* Sticky Viewport: Stays fixed while scrolling through the container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Projects Layer (Bottom, revealed by ink) */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Projects />
        </div>

        {/* Hero Layer (Top, masked by ink) */}
        <div
          ref={heroContainerRef}
          className="absolute inset-0 z-10 w-full h-full"
          style={{
            // Initial Mask (White = Visible)
            maskImage: 'none',
            WebkitMaskImage: 'none',
            maskMode: 'luminance',
            WebkitMaskMode: 'luminance',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            // Scale UP the Hero Mask to make the hole BIGGER
            maskSize: '105%',
            WebkitMaskSize: '105%',
            willChange: 'mask-image', // Optimization Hint
            transform: 'scaleX(-1)' // FLIP MASK HORIZONTALLY
          } as any}
        >
          {/* Un-flip content so it looks normal */}
          <div className="w-full h-full" style={{ transform: 'scaleX(-1)' }}>
            <Hero />
          </div>
        </div>

        {/* Ink Border Layer (Visible Black Ink at the Edge) */}
        {/* Placed BEHIND Hero (z-5) but IN FRONT of Projects (z-0) */}
        <div
          ref={borderLayerRef}
          className="absolute inset-0 z-[5] w-full h-full bg-black pointer-events-none"
          style={{
            maskImage: 'none',
            WebkitMaskImage: 'none',
            maskMode: 'luminance',
            WebkitMaskMode: 'luminance',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            // Keep Border Mask at 100% (Smaller Hole than Hero)
            maskSize: '100%',
            WebkitMaskSize: '100%',
            willChange: 'mask-image', // Optimization Hint
            transform: 'scaleX(-1)' // FLIP MASK HORIZONTALLY
          } as any}
        />

        {/* Transition Overlay (Updates the Masks directly) */}
        <PageTearTransition ref={pageTearRef} targetRef={heroContainerRef} borderRef={borderLayerRef} />

        {/* Scroll Hint (Optional) */}
        {introFinished && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-ink/50 text-xs uppercase tracking-widest animate-bounce pointer-events-none z-50">
            Scroll to Explore
          </div>
        )}
      </div>
    </div>
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

        <Route path="/work/project-1" element={<ProjectDetail />} />

        {/* About: History & Contact */}
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const { introFinished } = useIntro();

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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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


        <AnimatePresence>
          {!introFinished && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="fixed inset-0 pointer-events-none z-10"
            >
              <FloatingTypography />
              <DustOverlay />
            </motion.div>
          )}
        </AnimatePresence>

        <Navigation />

        {/* Navbar Removed */}

        <main className="relative z-10 flex-grow flex flex-col">
          <AnimatedRoutes />
        </main>

        {/* <Footer /> */}
        <AIModal />
      </div>
    </Router>
  );
};

export default App;
