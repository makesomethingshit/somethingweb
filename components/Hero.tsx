
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indexContainerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<ImageBitmap[]>([]);

  const frameCount = 122;
  const currentFrameRef = useRef(0);

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

    // Set canvas size with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrameRef.current);
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 100);
    };

    setCanvasSize();
    window.addEventListener('resize', handleResize);
    renderFrame(0);

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
        renderFrame(frameIndex);

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
            indexContainerRef.current.style.transform = `translateY(${(1 - indexProgress) * 20}px)`;
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
      window.removeEventListener('resize', handleResize);
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
          style={{ willChange: 'contents' }}
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
          <div className="w-full h-full max-w-[1600px] border-2 border-[#2A52BE] relative flex">
            {/* Spine (Center Line) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#2A52BE] -translate-x-1/2 hidden md:block opacity-50 border-r border-dashed border-[#2A52BE]"></div>

            {/* Left Page */}
            <div className="w-full md:w-1/2 h-full border-r border-[#2A52BE] relative flex flex-col">
              {/* Horizontal Lines */}
              {[...Array(8)].map((_, i) => (
                <div key={`h-left-${i}`} className="grid-h-line absolute w-full h-[1px] bg-[#2A52BE]/30 left-0" style={{ top: `${(i + 1) * 11.1}%` }}></div>
              ))}
              {/* Vertical Lines */}
              <div className="grid-v-line absolute top-0 bottom-0 w-[1px] bg-[#2A52BE]/30 left-[10%]"></div>
              <div className="grid-v-line absolute top-0 bottom-0 w-[1px] bg-[#2A52BE]/30 left-[50%]"></div>
              <div className="grid-v-line absolute top-0 bottom-0 w-[1px] bg-[#2A52BE]/30 right-[10%]"></div>
            </div>

            {/* Right Page */}
            <div className="hidden md:flex w-1/2 h-full relative flex-col">
              {/* Horizontal Lines */}
              {[...Array(8)].map((_, i) => (
                <div key={`h-right-${i}`} className="grid-h-line absolute w-full h-[1px] bg-[#2A52BE]/30 left-0" style={{ top: `${(i + 1) * 11.1}%` }}></div>
              ))}
              {/* Vertical Lines */}
              <div className="grid-v-line absolute top-0 bottom-0 w-[1px] bg-[#2A52BE]/30 left-[10%]"></div>
              <div className="grid-v-line absolute top-0 bottom-0 w-[1px] bg-[#2A52BE]/30 left-[50%]"></div>
              <div className="grid-v-line absolute top-0 bottom-0 w-[1px] bg-[#2A52BE]/30 right-[10%]"></div>
            </div>
          </div>
        </div>

        {/* Index Content (End View) */}
        <div
          ref={indexContainerRef}
          className="absolute inset-0 flex items-center justify-center z-30 opacity-0 pointer-events-none p-4 md:p-12 lg:p-24"
        >
          <div className="w-full max-w-[1600px] h-full flex flex-col md:flex-row relative">

            {/* Left Page: Title & Info */}
            <div className="w-full md:w-1/2 h-full p-6 md:p-12 flex flex-col justify-between relative">

              {/* Content positioned relative to grid lines approximately */}
              <div className="mt-[10%] md:mt-[11%]">
                <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ink tracking-tighter leading-none">
                  PREFACE
                </h2>
              </div>

              <div className="flex-grow flex flex-col justify-center">
                <div className="w-24 h-[1px] bg-ink/30 mb-6"></div>
                <p className="font-sans text-xs md:text-sm text-sub tracking-widest uppercase leading-relaxed">
                  Portfolio 2025<br />
                  Visual Translator
                </p>
              </div>

              <div className="mb-[10%]">
                <p className="font-serif-kr text-base md:text-lg text-sub font-light leading-relaxed">
                  보이지 않는 가치를<br />
                  보이는 경험으로<br />
                  번역합니다.
                </p>
              </div>
            </div>

            {/* Right Page: Preface Text */}
            <div className="w-full md:w-1/2 h-full p-6 md:p-12 flex flex-col justify-center pl-12 md:pl-24">
              <div className="max-w-md">
                <p className="font-serif text-xl md:text-2xl text-ink leading-relaxed italic mb-8">
                  "Design is the silent ambassador of your brand."
                </p>
                <p className="font-sans text-sm md:text-base text-sub leading-loose mb-8">
                  우리는 수많은 정보와 소음 속에 살고 있습니다.<br />
                  그 속에서 진정한 의미를 찾아내고,<br />
                  사용자의 언어로 번역하여 전달하는 것.<br />
                  그것이 제가 생각하는 디자인의 본질입니다.
                </p>
                <p className="font-sans text-sm md:text-base text-sub leading-loose">
                  단순한 시각적 아름다움을 넘어,<br />
                  문제의 본질을 꿰뚫고 해결책을 제시하는<br />
                  Visual Translator가 되겠습니다.
                </p>
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
