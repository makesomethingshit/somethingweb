import React from 'react';
import { motion } from 'framer-motion';

const BookLoader: React.FC = () => {
    return (
        <div className="relative w-16 h-12 flex items-center justify-center perspective-[500px]">
            {/* Book Base (Static Pages) */}
            <div className="absolute bottom-0 flex w-full h-full items-end justify-center">
                <div className="w-[45%] h-8 bg-ink/20 border border-paper/10 rounded-l-sm origin-right transform-gpu"></div>
                <div className="w-[1px] h-8 bg-ink/30"></div> {/* Spine */}
                <div className="w-[45%] h-8 bg-ink/20 border border-paper/10 rounded-r-sm origin-left transform-gpu"></div>
            </div>

            {/* Flipping Pages */}
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className="absolute bottom-0 right-1/2 w-[45%] h-8 bg-ink/60 border border-paper/20 origin-right rounded-l-sm"
                    style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden", // Hide the back when flipped if we wanted distinct sides, but here we just want the shape
                    }}
                    animate={{
                        rotateY: [0, -180],
                        zIndex: [10 - index, 10 - index, 0] // Start on top, end below
                    }}
                    transition={{
                        duration: 1.8,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: index * 0.4,
                        repeatDelay: 0.5
                    }}
                />
            ))}
        </div>
    );
};

export default BookLoader;
