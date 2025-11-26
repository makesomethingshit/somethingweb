
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Setup GSAP ScrollTrigger
  useEffect(() => {
    const video = videoRef.current;
    if (!containerRef.current) return;

    // Function to initialize ScrollTrigger once video metadata is loaded
    const initScrollTrigger = () => {
      setIsVideoReady(true);
      
      if (video) {
        // Force video to pause immediately to act as a scrubber
        video.pause();
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%', // Scroll distance: 4x viewport height
        pin: true,     
        scrub: 1,      // Smooth scrubbing (1 second delay)
        anticipatePin: 1, // Prevent jerky pinning
        onUpdate: (self) => {
          // 1. Video Scrubbing (Only if video exists and has no error)
          if (video && !hasError && video.duration) {
            // Map scroll progress (0 to 1) to video time
            const progress = self.progress;
            const targetTime = progress * video.duration;
            
            if (isFinite(targetTime)) {
                video.currentTime = targetTime;
            }
          }

          // 2. Text Reveal Logic (Always runs, even with fallback image)
          if (textRef.current) {
            const progress = self.progress;
            // Reveal text only in the last 15% of the scroll
            if (progress > 0.85) {
                const textOpacity = (progress - 0.85) / 0.1; // Fade in quickly
                const clampedOpacity = Math.min(Math.max(textOpacity, 0), 1);
                
                textRef.current.style.opacity = clampedOpacity.toString();
                textRef.current.style.transform = `translateY(${20 - (clampedOpacity * 20)}px)`;
            } else {
                textRef.current.style.opacity = '0';
                textRef.current.style.transform = `translateY(20px)`;
            }
          }
        },
      });
    };

    // If we have an error (fallback mode), we still want the scroll trigger for text
    if (hasError) {
        initScrollTrigger();
        return;
    }

    if (video) {
        if (video.readyState >= 1) {
            initScrollTrigger();
        } else {
            video.addEventListener('loadedmetadata', initScrollTrigger);
        }

        const handleError = () => {
            console.warn("Video failed to load, switching to fallback image.");
            setHasError(true);
            setIsVideoReady(true); // Treat as ready so loading spinner goes away
        };
        video.addEventListener('error', handleError);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            video.removeEventListener('loadedmetadata', initScrollTrigger);
            video.removeEventListener('error', handleError);
        };
    }
  }, [hasError]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-paper z-20 overflow-hidden">
      
      {/* 
        Video Layer 
        Uses absolute path '/book_video.mp4'.
        If it fails, 'hasError' becomes true and we render the fallback image.
      */}
      {!hasError ? (
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/book_video.mp4" 
            playsInline
            webkit-playsinline="true"
            muted
            preload="auto"
          />
      ) : (
          /* Fallback: Static Book Texture Background */
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-multiply grayscale-[0.2]">
             {/* Overlay to ensure text readability */}
             <div className="absolute inset-0 bg-paper/60 backdrop-blur-[2px]"></div>
          </div>
      )}

      {/* Text Overlay Layer */}
      <div 
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 translate-y-5 transition-transform duration-100 ease-out z-30"
      >
        <div className="text-center max-w-4xl px-6 bg-paper/90 backdrop-blur-md p-12 rounded-sm border border-ink/5 shadow-2xl relative">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-ink/20"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-ink/20"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-ink/20"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-ink/20"></div>

            <span className="font-sans text-xs md:text-sm tracking-[0.4em] text-sub/60 uppercase mb-8 block">
                Prologue
            </span>
            <h2 className="font-serif text-5xl md:text-7xl text-ink leading-tight italic mb-12">
                The Art of <br/>Nuance
            </h2>
            <div className="w-24 h-[2px] bg-accent/60 mx-auto mb-12"></div>
            
            <div className="font-serif-kr text-xl md:text-2xl text-sub font-light leading-relaxed tracking-wide space-y-6 break-keep">
                <p>
                    디자인은 멈춰있지 않습니다. <br/>
                    그것은 언어이며, 흐름이고, 보이지 않는 생각의 번역입니다.
                </p>
                <p>
                    모션그래픽이라는 도구를 통해 <br/>
                    추상적인 가치를 감각적인 경험으로 옮겨 적습니다.
                </p>
            </div>
            
            <div className="mt-16 text-accent text-3xl font-serif">❦</div>
        </div>
      </div>

      {/* Loading Indicator */}
      {!isVideoReady && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-paper z-50">
          <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-ink/10 border-t-accent rounded-full animate-spin"></div>
              <span className="text-xs font-sans tracking-widest text-ink/50">OPENING BOOK...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
