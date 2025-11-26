
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GridOverlay: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        // Select all path elements (using path for everything ensures consistent drawing)
        const paths = svgRef.current.querySelectorAll('path');

        // Set initial state for drawSVG effect
        paths.forEach((path) => {
            const length = (path as SVGPathElement).getTotalLength();
            // Add a small buffer to length to prevent tiny gaps
            (path as SVGPathElement).style.strokeDasharray = (length + 1).toString();
            (path as SVGPathElement).style.strokeDashoffset = (length + 1).toString();
        });

        // Animate lines drawing in
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: '+=200%', // Scroll distance for the drawing animation
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                paths.forEach((path) => {
                    const length = (path as SVGPathElement).getTotalLength();
                    const drawLength = length * progress;
                    (path as SVGPathElement).style.strokeDashoffset = (length - drawLength).toString();
                });
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === containerRef.current) t.kill();
            });
        };
    }, []);

    return (
        <>
            {/* Fixed Overlay Layer */}
            <div className="fixed inset-0 w-full h-full z-10 pointer-events-none mix-blend-multiply">
                <svg
                    ref={svgRef}
                    className="w-full h-full opacity-40"
                    viewBox="0 0 1920 1080"
                    preserveAspectRatio="none"
                >
                    <g stroke="#2A52BE" strokeWidth="0.8" fill="none">

                        {/* Using PATHs for continuous lines to avoid gaps */}

                        {/* Outer Border */}
                        <path d="M50 50 H1870 V1030 H50 Z" />

                        {/* Spine (Dashed lines handled separately if needed, but solid for now for consistency) */}
                        <path d="M940 50 V1030" strokeDasharray="4 4" />
                        <path d="M980 50 V1030" strokeDasharray="4 4" />

                        {/* --- Left Page Columns --- */}
                        {/* Vertical Lines */}
                        <path d="M100 100 V980" />
                        <path d="M480 100 V980" />
                        <path d="M500 100 V980" />
                        <path d="M880 100 V980" />

                        {/* Horizontal Rows (Left) - Drawn as one continuous path for rows if possible, or separate lines */}
                        {/* Top and Bottom Borders of columns */}
                        <path d="M100 100 H480" /> <path d="M500 100 H880" />
                        <path d="M100 980 H480" /> <path d="M500 980 H880" />

                        {/* Inner Rows */}
                        <path d="M100 210 H480 M500 210 H880" />
                        <path d="M100 320 H480 M500 320 H880" />
                        <path d="M100 430 H480 M500 430 H880" />
                        <path d="M100 540 H480 M500 540 H880" />
                        <path d="M100 650 H480 M500 650 H880" />
                        <path d="M100 760 H480 M500 760 H880" />
                        <path d="M100 870 H480 M500 870 H880" />


                        {/* --- Right Page Columns --- */}
                        {/* Vertical Lines */}
                        <path d="M1040 100 V980" />
                        <path d="M1420 100 V980" />
                        <path d="M1440 100 V980" />
                        <path d="M1820 100 V980" />

                        {/* Horizontal Rows (Right) */}
                        {/* Top and Bottom Borders */}
                        <path d="M1040 100 H1420" /> <path d="M1440 100 H1820" />
                        <path d="M1040 980 H1420" /> <path d="M1440 980 H1820" />

                        {/* Inner Rows */}
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

            {/* Scroll Spacer for Animation */}
            <div ref={containerRef} className="relative w-full h-[200vh] pointer-events-none"></div>
        </>
    );
};

export default GridOverlay;
