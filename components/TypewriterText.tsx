import React from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
    text: string;
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
    instant?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, delay = 0, className = "", style = {}, instant = false }) => {
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
            whileInView="visible" // Changed to whileInView for scroll reveal in Projects
            viewport={{ once: true }}
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

export default TypewriterText;
