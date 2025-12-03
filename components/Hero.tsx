import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectReveal from './ProjectReveal';
import BookLoader from './BookLoader';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import ProjectModal from './ProjectModal';
import { motion } from 'framer-motion';
import { useIntro } from '../context/IntroContext';

const TypewriterText: React.FC<{ text: string; delay?: number; className?: string; style?: React.CSSProperties; instant?: boolean }> = ({ text, delay = 0, className = "", style = {}, instant = false }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: instant ? 0 : 0.02,
        delayChildren: instant ? 0 : delay
      }
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
        duration: instant ? 0 : undefined
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <motion.div
      style={{ display: "block", ...style }}
      variants={container}
      initial={instant ? "visible" : "hidden"}
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

interface HeroProps {
  onNextPage?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNextPage }) => {
  const [localIntroFinished, setLocalIntroFinished] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indexContainerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const [hasClicked, setHasClicked] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [inkDropFinished, setInkDropFinished] = useState(false);

  // Intro Interaction States
  const [introClicked, setIntroClicked] = useState(false);
  const { introFinished, setIntroFinished } = useIntro(); // Global state for App.tsx

  // Capture the initial state of introFinished on mount.
  // If it's already true on mount, it means we are returning (skip animations).
  // If it's false on mount, we are in the first flow (play animations).
  const isReturnVisit = useRef(introFinished).current;

  // Initialize local state based on global state to prevent re-running intro
  useEffect(() => {
    if (introFinished) {
      setLocalIntroFinished(true);
      setShowText(true); // Show text immediately
      // Do not set imagesLoaded(true) here, let them reload naturally
    }
  }, [introFinished]);

  const handleOpenProject = () => {
    setSelectedProject(PROJECTS[0]);
    setIsModalOpen(true);
    setHasClicked(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
    setResetKey(prev => prev + 1);
  };

  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<ImageBitmap[]>([]);

  const frameCount = 122;
  const currentFrameRef = useRef(introFinished ? frameCount - 1 : 0);
  const [revealProgress, setRevealProgress] = useState(0);
  const [showText, setShowText] = useState(false);

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

  // Setup canvas and Click Interaction
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    // Render a specific frame
    const renderFrame = (index: number) => {
      const frameIndex = Math.min(Math.floor(index), frameCount - 1);
      const img = imagesRef.current[frameIndex];

      if (img) {
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

    // Render Loop
    let animationFrameId: number;
    const renderLoop = () => {
      renderFrame(currentFrameRef.current);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Resize Handler
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 100);
    };
    setCanvasSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [imagesLoaded]);

  // Handle Grid Animation when Intro Finishes
  useEffect(() => {
    if (localIntroFinished && gridContainerRef.current) {
      gridContainerRef.current.style.opacity = '1';
      const horizontalLines = gridContainerRef.current.querySelectorAll('.grid-h-line');
      const verticalLines = gridContainerRef.current.querySelectorAll('.grid-v-line');

      gsap.to(horizontalLines, {
        scale: 1, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power2.out"
      });
      gsap.to(verticalLines, {
        scale: 1, opacity: 1, duration: 1.5, stagger: 0.15, delay: 0.5, ease: "power2.out"
      });
    }
  }, [localIntroFinished]);

  // Animate Vertical Line on Text Trigger
  useEffect(() => {
    if (showText && verticalLineRef.current) {
      gsap.to(verticalLineRef.current, {
        scaleY: 1,
        opacity: 1,
        duration: 1.0,
        ease: "power2.out"
      });
    }
  }, [showText]);

  // Click Handler for Intro Animation
  const handleIntroClick = () => {
    if (introClicked || !imagesLoaded) return;
    setIntroClicked(true);

    // 1. Animate Video Frames (Slower Playback)
    const videoObj = { frame: 0 };
    gsap.to(videoObj, {
      frame: frameCount - 1,
      duration: 3.0, // Slowed down from 1.5s to 3.0s
      ease: "power2.inOut",
      onUpdate: () => {
        currentFrameRef.current = videoObj.frame;
      },
      onComplete: () => {
        // Video finished
      }
    });

    // 2. Zoom In Effect (Scale Canvas)
    gsap.to(canvasRef.current, {
      scale: 1.2, // Reduced zoom from 3 to 1.2 (Just enough to feel "entering" but not pixelated)
      duration: 3.0, // Match video duration
      ease: "power3.inOut",
      delay: 0
    });

    // 3. Fade Out Scroll Hint
    if (scrollHintRef.current) {
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        duration: 0.5
      });
    }

    // 4. Reveal Project Section (After Zoom)
    setTimeout(() => {
      setLocalIntroFinished(true);
      setIntroFinished(true); // Notify App to hide dust
      setRevealProgress(1); // Force reveal to 100% immediately or animate it

    }, 3000); // Match duration exactly
  };

  // Lock Body Scroll when Intro Finishes
  useEffect(() => {
    if (localIntroFinished) {
      // Apply overflow hidden to prevent scrollbars, but allow event propagation for future page-turn logic
      const styles = {
        overflow: 'hidden',
        height: '100%',
        overscrollBehavior: 'none'
      };

      Object.assign(document.body.style, styles);
      Object.assign(document.documentElement.style, styles);
    } else {
      const styles = {
        overflow: '',
        height: '',
        overscrollBehavior: ''
      };

      Object.assign(document.body.style, styles);
      Object.assign(document.documentElement.style, styles);
    }
    return () => {
      const styles = {
        overflow: '',
        height: '',
        overscrollBehavior: ''
      };
      Object.assign(document.body.style, styles);
      Object.assign(document.documentElement.style, styles);
    };
  }, [localIntroFinished]);
  useEffect(() => {
    if (!localIntroFinished || !onNextPage) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50) { // Threshold for scroll down
        onNextPage();
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [localIntroFinished, onNextPage]);

  // Calculate Text Delays
  const titleText = PROJECTS[0].title;
  const descText = PROJECTS[0].description;
  const body1Text = "A digital exploration of memory and form. This project delves into the intersection of analog textures and digital interactivity, creating a space where the user becomes part of the narrative.";
  const body2Text = "Through the layering of ink, paper, and code, we bridge the gap between the tangible and the virtual. Every interaction leaves a mark, every scroll reveals a new layer of depth.";

  const charDuration = 0.02; // Faster typing speed
  const titleDuration = titleText.length * charDuration;
  const descDuration = descText.length * charDuration;
  const body1Duration = body1Text.length * charDuration;

  const titleDelay = 0;
  const descDelay = titleDelay + titleDuration + 0.2; // Start after title + buffer
  const body1Delay = descDelay + descDuration + 0.3; // Start after description + buffer
  const body2Delay = body1Delay + body1Duration + 0.3; // Start after body1 + buffer


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

      {/* Persistent Background Canvas - Changed to absolute for PageTurner compatibility */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ willChange: 'contents, transform' }}
        />
      </div>

      {/* Intro Click Layer (Visible only during intro) - Changed to absolute */}
      {!localIntroFinished && (
        <div
          className="absolute inset-0 w-full h-full z-50 cursor-pointer"
          onClick={handleIntroClick}
        >
          {/* Hover Trigger Area (Restricted to Book Area) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] md:w-[400px] md:h-[500px] z-50" // Centered book area
            onMouseEnter={() => {
              if (!introClicked && canvasRef.current) {
                gsap.to(canvasRef.current, { scale: 1.05, duration: 0.5, ease: "power2.out" });
              }
            }}
            onMouseLeave={() => {
              if (!introClicked && canvasRef.current) {
                gsap.to(canvasRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
              }
            }}
          ></div>

          <div
            ref={scrollHintRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none"
          >
            <div className="mt-32 flex flex-col items-center gap-4 animate-pulse-custom">
              <span className="font-serif tracking-[0.2em] text-sm uppercase">Click to Enter</span>
            </div>
          </div>

          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#F5F0E6] z-50 pointer-events-none transition-opacity duration-500">
              <div className="flex flex-col items-center gap-6">
                {/* Minimal Loading Spinner */}
                <BookLoader />

                {/* Styled Loading Text */}
                <div className="flex flex-col items-center gap-2">
                  <span className="font-serif text-lg text-ink tracking-widest uppercase">Loading</span>
                  <span className="font-sans text-[10px] text-ink/40 tracking-[0.2em]">{loadProgress}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Layer (Visible after Intro) */}
      {localIntroFinished && (
        <>
          {/* Fixed Background (Grid) - Changed to absolute */}
          <div className="absolute inset-0 w-full h-full z-1 pointer-events-none">
            <div
              ref={gridContainerRef}
              className="absolute inset-0 w-full h-full mix-blend-multiply opacity-0 flex items-center justify-center p-4 md:p-12 lg:p-24"
            >
              {/* Adding Grid Lines explicitly for safety */}
              <div className="absolute inset-0 border-t border-b border-gray-300 grid-h-line scale-x-0 origin-left"></div>
              <div className="absolute inset-0 border-l border-r border-gray-300 grid-v-line scale-y-0 origin-top"></div>
            </div>
          </div>

          {/* Content Area - Fixed Height, No Scroll */}
          <div className="relative w-full h-screen z-10 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div
                ref={indexContainerRef}
                className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 items-start justify-center gap-8 z-30 p-4 md:p-12 pt-24 md:pt-32"
                style={{ opacity: 1, pointerEvents: 'auto' }}
              >
                {/* Left: Project Reveal (Larger) */}
                <div className="w-full md:col-span-2 flex justify-center items-start pointer-events-auto relative">
                  <ProjectReveal
                    progress={1}
                    onOpenProject={handleOpenProject}
                    resetKey={resetKey}
                    onTextTrigger={() => setShowText(true)}
                    onVideoReset={() => setShowText(false)}
                    onVideoEnd={() => setVideoEnded(true)}
                    onInkDropComplete={() => setInkDropFinished(true)}
                    skipAnimation={isReturnVisit}
                  />
                </div>

                {/* Vertical Divider Line - Absolute to avoid taking grid cell */}
                <div
                  ref={verticalLineRef}
                  className="hidden md:block absolute left-2/3 top-0 bottom-0 w-[1px] bg-ink/20 h-full origin-top scale-y-0 opacity-0 -ml-4" // -ml-4 to center in gap
                ></div>

                {/* Right: Text Content */}
                <div className="w-full md:col-span-1 text-ink flex flex-col justify-start items-start text-left relative z-40 min-h-[150px] pl-4 md:pl-8 pr-4 md:pr-12 pt-32"> {/* Added pt-32 for visual alignment */}
                  {showText && (
                    <>
                      <TypewriterText
                        text={titleText}
                        className="text-3xl md:text-5xl lg:text-6xl font-serif mb-4 md:mb-8 block break-words" // Responsive text
                        instant={isReturnVisit}
                      />
                      <TypewriterText
                        text={descText}
                        delay={descDelay}
                        className="font-sans text-xs md:text-sm tracking-widest uppercase opacity-70 block mb-8 break-words"
                        instant={isReturnVisit}
                      />

                      {/* Body Content */}
                      <div className="font-serif text-sm md:text-base lg:text-lg leading-relaxed opacity-80 w-full whitespace-normal break-words max-w-full md:max-w-md"> {/* Responsive max-w */}
                        <TypewriterText
                          text={body1Text}
                          delay={body1Delay}
                          className="block mb-4"
                          instant={isReturnVisit}
                        />
                        <TypewriterText
                          text={body2Text}
                          delay={body2Delay}
                          className="block"
                          instant={isReturnVisit}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default Hero;
