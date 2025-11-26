
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indexContainerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const frameCount = 122;
  const currentFrameRef = useRef(0);

  // Preload all images
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / frameCount) * 100));

      if (loadedCount === frameCount) {
        setImagesLoaded(true);
      }
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(5, '0');
      img.src = `/frames/intro_book_video${frameNumber}.jpg`;
      img.onload = updateProgress;
      img.onerror = updateProgress;
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  // Setup canvas and ScrollTrigger
  useEffect(() => {
    if (!imagesLoaded || !spacerRef.current || !canvasRef.current || !svgRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Render a specific frame
    const renderFrame = (index: number) => {
      const frameIndex = Math.min(Math.floor(index), frameCount - 1);
      const img = imagesRef.current[frameIndex];

      if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);

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

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrameRef.current);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    renderFrame(0);

    // Initialize Grid Paths
    const paths = svgRef.current.querySelectorAll('path');
    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength();
      const dashLength = length + 2;
      (path as SVGPathElement).style.strokeDasharray = dashLength.toString();
      (path as SVGPathElement).style.strokeDashoffset = dashLength.toString();
    });


    // Setup ScrollTrigger
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Timeline: Video -> Grid -> Index

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
        renderFrame(frameIndex);

        // 2. Grid Animation (60% - 80%)
        if (p > 0.6) {
          const gridProgress = Math.min(1, (p - 0.6) / 0.2);
          paths.forEach((path) => {
            const length = (path as SVGPathElement).getTotalLength();
            const dashLength = length + 2;
            const drawLength = dashLength * gridProgress;
            (path as SVGPathElement).style.strokeDashoffset = (dashLength - drawLength).toString();
          });
          svgRef.current!.style.opacity = '0.4';
        } else {
          paths.forEach((path) => {
            const length = (path as SVGPathElement).getTotalLength();
            const dashLength = length + 2;
            (path as SVGPathElement).style.strokeDashoffset = dashLength.toString();
          });
          svgRef.current!.style.opacity = '0';
        }

        // 3. Index Reveal (80% - 100%)
        if (indexContainerRef.current) {
          if (p > 0.8) {
            const indexProgress = (p - 0.8) / 0.2;
            indexContainerRef.current.style.opacity = Math.min(1, indexProgress * 2).toString(); // Fade in faster
            indexContainerRef.current.style.transform = `translateY(${(1 - indexProgress) * 20}px)`;
            // Enable pointer events only when visible
            indexContainerRef.current.style.pointerEvents = 'auto';
          } else {
            indexContainerRef.current.style.opacity = '0';
            indexContainerRef.current.style.pointerEvents = 'none';
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
      window.removeEventListener('resize', setCanvasSize);
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
      <div className="fixed inset-0 w-full h-full z-1 bg-paper">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
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

        {/* Grid Overlay */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none mix-blend-multiply">
          <svg
            ref={svgRef}
            className="w-full h-full opacity-0 transition-opacity duration-500"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="none"
          >
            <g stroke="#2A52BE" strokeWidth="0.8" fill="none">
              {/* Outer Border */}
              <path d="M50 50 H1870 V1030 H50 Z" />

              {/* Spine */}
              <path d="M940 50 V1030" strokeDasharray="4 4" />
              <path d="M980 50 V1030" strokeDasharray="4 4" />

              {/* --- Left Page Columns --- */}
              <path d="M100 100 V980" />
              <path d="M480 100 V980" />
              <path d="M500 100 V980" />
              <path d="M880 100 V980" />

              {/* Horizontal Rows (Left) */}
              <path d="M100 100 H480" /> <path d="M500 100 H880" />
              <path d="M100 980 H480" /> <path d="M500 980 H880" />
              <path d="M100 210 H480 M500 210 H880" />
              <path d="M100 320 H480 M500 320 H880" />
              <path d="M100 430 H480 M500 430 H880" />
              <path d="M100 540 H480 M500 540 H880" />
              <path d="M100 650 H480 M500 650 H880" />
              <path d="M100 760 H480 M500 760 H880" />
              <path d="M100 870 H480 M500 870 H880" />

              {/* --- Right Page Columns --- */}
              <path d="M1040 100 V980" />
              <path d="M1420 100 V980" />
              <path d="M1440 100 V980" />
              <path d="M1820 100 V980" />

              {/* Horizontal Rows (Right) */}
              <path d="M1040 100 H1420" /> <path d="M1440 100 H1820" />
              <path d="M1040 980 H1420" /> <path d="M1440 980 H1820" />
              <path d="M1040 210 H1420 M1440 210 H1820" />
              <path d="M1040 320 H1420 M1440 320 H1820" />
              <path d="M1040 430 H1420 M1440 430 H1820" />
              <path d="M1040 540 H1420 M1440 540 H1820" />
              <path d="M1040 650 H1420 M1440 650 H1820" />
              <path d="M1040 760 H1420 M1440 760 H1820" />
              <path d="M1040 870 H1420 M1440 870 H1820" />
            </g>
          </svg>
        </div>

        {/* Index Content (End View) */}
        <div
          ref={indexContainerRef}
          className="absolute inset-0 flex items-center justify-center z-30 opacity-0 pointer-events-none"
        >
          <div className="w-full max-w-[1920px] px-[100px] flex justify-between items-start h-[880px] pt-[100px]">

            {/* Left Page: Title & Info (Grid Layout) */}
            <div className="w-[780px] h-full grid grid-rows-[repeat(8,110px)]">
              {/* Row 2: INDEX Title */}
              <div className="row-start-2 flex flex-col justify-center">
                <h2 className="font-serif text-9xl text-ink tracking-tighter leading-none ml-[-8px]">
                  INDEX
                </h2>
              </div>

              {/* Row 3: Subtitle */}
              <div className="row-start-3 flex flex-col justify-start pt-6">
                <div className="w-24 h-[1px] bg-ink/30 mb-6"></div>
                <p className="font-sans text-sm text-sub tracking-widest uppercase leading-relaxed">
                  Portfolio 2025<br />
                  Visual Translator
                </p>
              </div>

              {/* Row 7: Korean Text */}
              <div className="row-start-7 flex items-center">
                <p className="font-serif-kr text-lg text-sub font-light leading-relaxed">
                  본 포트폴리오는<br />
                  디자인의 본질을 탐구하는<br />
                  여정을 담고 있습니다.
                </p>
              </div>
            </div>

            {/* Right Page: Table of Contents (Aligned to Grid) */}
            <div className="w-[780px] h-full pl-[40px] grid grid-rows-[repeat(8,110px)]">
              {/* Row 2: Work */}
              <div className="row-start-2 flex items-center group cursor-pointer">
                <Link to="/work" className="block w-full">
                  <div className="flex items-baseline gap-8">
                    <span className="font-sans text-sm text-accent font-bold tracking-widest">01</span>
                    <h3 className="font-serif text-6xl text-ink group-hover:text-accent transition-colors duration-300 italic">Work</h3>
                  </div>
                </Link>
              </div>

              {/* Row 3: Profile */}
              <div className="row-start-3 flex items-center group cursor-pointer">
                <Link to="/about" className="block w-full">
                  <div className="flex items-baseline gap-8">
                    <span className="font-sans text-sm text-accent font-bold tracking-widest">02</span>
                    <h3 className="font-serif text-6xl text-ink group-hover:text-accent transition-colors duration-300 italic">Profile</h3>
                  </div>
                </Link>
              </div>

              {/* Row 4: Contact */}
              <div className="row-start-4 flex items-center group cursor-pointer">
                <Link to="/about" className="block w-full">
                  <div className="flex items-baseline gap-8">
                    <span className="font-sans text-sm text-accent font-bold tracking-widest">03</span>
                    <h3 className="font-serif text-6xl text-ink group-hover:text-accent transition-colors duration-300 italic">Contact</h3>
                  </div>
                </Link>
              </div>
            </div>

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
    </>
  );
};

export default Hero;
