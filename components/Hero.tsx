
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectReveal from './ProjectReveal';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import ProjectModal from './ProjectModal';
import { motion } from 'framer-motion';

const TypewriterText: React.FC<{ text: string; delay?: number; className?: string }> = ({ text, delay = 0, className = "" }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay }
    })
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "inline-block" }} // Ensure inline-block for proper spacing
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indexContainerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleOpenProject = () => {
    setSelectedProject(PROJECTS[0]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
    setResetKey(prev => prev + 1);
  };

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<ImageBitmap[]>([]);

  const frameCount = 122;
  const currentFrameRef = useRef(0);
  const [revealProgress, setRevealProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  const gridAnimatedRef = useRef(false);

  // Preload all images using createImageBitmap for performance
  useEffect(() => {
    const loadImages = async () => {
      const promises = [];
      let loadedCount = 0;

      const updateProgress = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
      };

      for (let i = 0; i < frameCount; i++) {
        const frameNumber = i.toString().padStart(5, '0');
        const url = `/frames/intro_book_video${frameNumber}.jpg`;

        const promise = fetch(url)
          .then(response => response.blob())
          .then(blob => createImageBitmap(blob))
          .then(bitmap => {
            updateProgress();
            return { index: i, bitmap };
          })
          .catch(err => {
            console.error(`Failed to load frame ${i}`, err);
            updateProgress();
            return null;
          });

        promises.push(promise);
      }

      const results = await Promise.all(promises);
      const sortedImages = results
        .filter((item): item is { index: number; bitmap: ImageBitmap } => item !== null)
        .sort((a, b) => a.index - b.index)
        .map(item => item.bitmap);

      imagesRef.current = sortedImages;
      setImagesLoaded(true);
    };

    loadImages();

    return () => {
      // Cleanup bitmaps
      imagesRef.current.forEach(bitmap => bitmap.close());
    };
  }, []);

  // Setup canvas and ScrollTrigger
  useEffect(() => {
    if (!imagesLoaded || !spacerRef.current || !canvasRef.current || !gridContainerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false }); // Optimize for no alpha
    if (!context) return;

    // Render a specific frame
    const renderFrame = (index: number) => {
      const frameIndex = Math.min(Math.floor(index), frameCount - 1);
      const img = imagesRef.current[frameIndex];

      if (img) {
        // No need to clearRect if we draw over the whole canvas
        // context.clearRect(0, 0, canvas.width, canvas.height);

        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgAspect;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgAspect;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    // Use requestAnimationFrame for smooth rendering
    let animationFrameId: number;
    const renderLoop = () => {
      renderFrame(currentFrameRef.current);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Set canvas size with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // renderFrame(currentFrameRef.current); // Handled by loop
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 100);
    };

    setCanvasSize();
    window.addEventListener('resize', handleResize);
    // renderFrame(0); // Handled by loop

    // Setup ScrollTrigger
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Get all grid lines (borders)
    const horizontalLines = gridContainerRef.current.querySelectorAll('.grid-h-line');
    const verticalLines = gridContainerRef.current.querySelectorAll('.grid-v-line');

    // Initial State for Grid
    gsap.set([...horizontalLines, ...verticalLines], { scale: 0, opacity: 0 });
    gsap.set(horizontalLines, { transformOrigin: 'left center' });
    gsap.set(verticalLines, { transformOrigin: 'top center' });


    ScrollTrigger.create({
      trigger: spacerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;

        // 1. Video Animation (0% - 60%)
        const videoProgress = Math.min(1, p / 0.6);
        const frameIndex = videoProgress * (frameCount - 1);
        currentFrameRef.current = frameIndex;
        // renderFrame(frameIndex); // Handled by loop

        // 2. Grid Animation (Triggered at 60%)
        if (p > 0.6) {
          if (!gridAnimatedRef.current) {
            gridAnimatedRef.current = true;
            gridContainerRef.current!.style.opacity = '1';

            // Horizontal lines stagger
            gsap.to(horizontalLines, {
              scale: 1,
              opacity: 1,
              duration: 1.5,
              stagger: 0.1,
              ease: "power2.out",
              overwrite: true
            });

            // Vertical lines stagger
            gsap.to(verticalLines, {
              scale: 1,
              opacity: 1,
              duration: 1.5,
              stagger: 0.15,
              delay: 0.5, // Start slightly after horizontal
              ease: "power2.out",
              overwrite: true
            });
          }
        } else if (p < 0.5) {
          // Reset if scrolled back up significantly
          if (gridAnimatedRef.current) {
            gridAnimatedRef.current = false;
            gridContainerRef.current!.style.opacity = '0';
            gsap.to([...horizontalLines, ...verticalLines], {
              scale: 0,
              opacity: 0,
              duration: 0.5,
              overwrite: true
            });
          }
        }

        // 3. Index Reveal (80% - 100%)
        if (indexContainerRef.current) {
          if (p > 0.8) {
            const indexProgress = (p - 0.8) / 0.2;
            indexContainerRef.current.style.opacity = Math.min(1, indexProgress * 2).toString();
            // indexContainerRef.current.style.transform = `translateY(${(1 - indexProgress) * 20}px)`; // Removed translation for cleaner reveal
            indexContainerRef.current.style.pointerEvents = 'auto';

            // Pass progress to ProjectReveal (0 to 1 as we scroll from 80% to 100%)
            setRevealProgress(indexProgress);
          } else {
            indexContainerRef.current.style.opacity = '0';
            indexContainerRef.current.style.pointerEvents = 'none';
            setRevealProgress(0);
          }
        }

        // Scroll Hint fade out
        if (scrollHintRef.current) {
          const opacity = 1 - (p * 10);
          scrollHintRef.current.style.opacity = Math.max(0, opacity).toString();
          scrollHintRef.current.style.pointerEvents = opacity <= 0 ? 'none' : 'auto';
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [imagesLoaded]);

  return (
    <>
      <style>{`
        @keyframes pulse-white-gray {
            0%, 100% { color: white; opacity: 1; }
            50% { color: #888; opacity: 0.7; }
        }
        .animate-pulse-custom {
            animation: pulse-white-gray 2s ease-in-out infinite;
        }
      `}</style>

      {/* Fixed Background Layer */}
      <div className="fixed inset-0 w-full h-full z-1">
        {/* Local background removed to use global background */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ willChange: 'contents, transform' }} // Hint to browser
        />

        {/* Scroll Hint Text (Initial View) */}
        <div
          ref={scrollHintRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none"
        >
          <div className="mt-32 flex flex-col items-center gap-4 animate-pulse-custom">
            <span className="font-serif tracking-[0.2em] text-sm uppercase">Scroll to Open</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>

        {/* Grid Overlay - Responsive CSS Grid */}
        <div
          ref={gridContainerRef}
          className="absolute inset-0 w-full h-full z-20 pointer-events-none mix-blend-multiply opacity-0 flex items-center justify-center p-4 md:p-12 lg:p-24"
        >

        </div>

        {/* Index Content (End View) */}
        <div
          ref={indexContainerRef}
          className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-30 opacity-0 pointer-events-none p-4"
        >
          <div className="w-full max-w-4xl flex justify-center">
            <ProjectReveal
              progress={revealProgress}
              onOpenProject={handleOpenProject}
              resetKey={resetKey}
              onTextTrigger={() => setShowText(true)}
              onVideoReset={() => setShowText(false)}
            />
          </div>

          <div className="w-full text-ink flex flex-col justify-center items-center text-center -mt-24 relative z-40 min-h-[150px]">
            {showText && (
              <>
                <TypewriterText
                  text={PROJECTS[0].title}
                  className="text-5xl font-serif mb-6 block"
                />
                <TypewriterText
                  text={PROJECTS[0].description}
                  delay={1.5} // Start after title finishes roughly
                  className="font-sans text-sm tracking-widest uppercase opacity-70 block"
                />
              </>
            )}
          </div>
        </div>

        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-ink/10 border-t-accent rounded-full animate-spin"></div>
              <span className="text-xs font-sans tracking-widest text-ink/50">
                LOADING FRAMES... {loadProgress}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scroll Spacer */}
      <div ref={spacerRef} className="relative w-full h-[500vh] pointer-events-none"></div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default Hero;
