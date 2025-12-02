import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface FloatingCharProps {
    char: string;
    index: number;
    scrollY: MotionValue<number>;
    totalChars: number;
}

const FloatingChar: React.FC<FloatingCharProps> = ({ char, index, scrollY, totalChars }) => {
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

    // Initialize random values once on mount (Lazy initialization)
    // This prevents the "default then update" flash and ensures true randomness from the start
    const [randomValues] = useState(() => ({
        fontSize: Math.max(1, Math.random() * 4),
        maxOpacity: 0.1 + Math.random() * 0.2,
        blur: Math.random() * 3,
        duration: 20 + Math.random() * 20,
        xMove: (Math.random() - 0.5) * 200,
        yMove: (Math.random() - 0.5) * 200,
        rotate: (Math.random() - 0.5) * 360,
        delay: Math.random() * 5,
        blinkDuration: 3 + Math.random() * 7, // 3-10s
        blinkDelay: -Math.random() * 10, // Negative delay to start mid-cycle
        scrollOffset: (Math.random() - 0.5) * 500 // Randomize scroll trigger position
    }));

    useEffect(() => {
        setInitialPos({
            x: Math.random() * 100, // vw
            y: Math.random() * 100  // vh
        });
    }, []);

    // Scroll-based Opacity Calculation
    // Start appearing after 150vh (mid-scroll) and finish by 450vh
    const startScroll = typeof window !== 'undefined' ? window.innerHeight * 1.5 : 0;
    const endScroll = typeof window !== 'undefined' ? window.innerHeight * 4.5 : 1000;
    const step = (endScroll - startScroll) / totalChars;

    // Add random offset to the start position so they don't appear in perfect order
    const myStart = startScroll + index * step + randomValues.scrollOffset;
    const myEnd = myStart + (typeof window !== 'undefined' ? window.innerHeight * 0.5 : 200); // Fade duration

    const opacity = useTransform(scrollY, [myStart, myEnd], [0, randomValues.maxOpacity]);

    return (
        <motion.div
            className="absolute font-serif text-ink pointer-events-none select-none"
            style={{
                left: `${initialPos.x}%`,
                top: `${initialPos.y}%`,
                fontSize: `${randomValues.fontSize}rem`,
                opacity: opacity, // Controlled by scroll (Master fade)
                filter: `blur(${randomValues.blur}px)`,
                zIndex: 1
            }}
            animate={{
                x: [0, randomValues.xMove, 0],
                y: [0, randomValues.yMove, 0],
                rotate: [0, randomValues.rotate, 0],
            }}
            transition={{
                duration: randomValues.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: randomValues.delay
            }}
        >
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                    duration: randomValues.blinkDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: randomValues.blinkDelay // Negative delay for random phase
                }}
            >
                {char}
            </motion.span>
        </motion.div>
    );
};

const FloatingTypography: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate random chars (Memoized to prevent regeneration on re-renders)
    const randomChars = useMemo(() => {
        return Array.from({ length: 40 }, (_, i) => chars[Math.floor(Math.random() * chars.length)]);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-20">
            {randomChars.map((char, i) => (
                <FloatingChar
                    key={i}
                    char={char}
                    index={i}
                    scrollY={scrollY}
                    totalChars={randomChars.length}
                />
            ))}
        </div>
    );
};

export default FloatingTypography;
