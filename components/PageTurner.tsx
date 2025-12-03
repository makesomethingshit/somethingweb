import React from 'react';
import { motion } from 'framer-motion';

interface PageTurnerProps {
    children: React.ReactNode;
    isTurning: boolean;
    onTurnComplete?: () => void;
}

const PageTurner: React.FC<PageTurnerProps> = ({ children, isTurning, onTurnComplete }) => {
    return (
        <motion.div
            initial={{ rotateY: isTurning ? -120 : 0, transformOrigin: "left center" }}
            animate={{
                rotateY: isTurning ? -120 : 0,
                opacity: isTurning ? 0 : 1
            }}
            transition={{
                duration: 1.5,
                ease: "easeInOut"
            }}
            onAnimationComplete={() => {
                if (isTurning && onTurnComplete) {
                    onTurnComplete();
                }
            }}
            style={{
                position: 'relative',
                zIndex: 20,
                width: '100%',
                height: '100%'
            }}
            className=""
        >
            {children}

        </motion.div>
    );
};

export default PageTurner;
