
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const InteractiveBackground: React.FC = () => {
  const { scrollY } = useScroll();

  // Map scroll position to rotation values
  const rotateX = useTransform(scrollY, [0, 5000], [0, 360]);
  const rotateY = useTransform(scrollY, [0, 5000], [0, -720]);
  const rotateZ = useTransform(scrollY, [0, 5000], [0, 180]);

  const opacity = useTransform(scrollY, [0, 300], [0.3, 0.8]); // Fade in slightly on scroll

  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden perspective-[1000px]">

      {/* Main 3D Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          opacity,
          willChange: "transform, opacity"
        }}
        className="relative w-[60vw] h-[60vw] md:w-[500px] md:h-[500px] preserve-3d backface-hidden"
      >

        {/* Outer Orbit Ring */}
        <div className="absolute inset-0 rounded-full border border-ink/10 transform-style-3d rotate-x-45" />
        <div className="absolute inset-0 rounded-full border border-ink/10 transform-style-3d rotate-y-45" />

        {/* Middle Orbit Ring */}
        <motion.div
          style={{ rotateZ: rotateY }}
          className="absolute inset-[10%] rounded-full border border-ink/20 border-dashed transform-style-3d"
        />

        {/* Inner Orbit Ring (Accent) */}
        <motion.div
          style={{ rotateX: rotateZ }}
          className="absolute inset-[25%] rounded-full border border-accent/30 transform-style-3d"
        />

        {/* Central Cube Structure */}
        <motion.div
          style={{ rotateX: rotateY, rotateY: rotateX }}
          className="absolute inset-[35%] preserve-3d flex items-center justify-center"
        >
          {/* Cube Faces */}
          <div className="absolute w-full h-full border border-ink/10 bg-ink/[0.01] translate-z-[50px]" /> {/* Front */}
          <div className="absolute w-full h-full border border-ink/10 bg-ink/[0.01] translate-z-[-50px]" /> {/* Back */}
          <div className="absolute w-full h-full border border-ink/10 bg-ink/[0.01] rotate-y-90 translate-z-[50px]" /> {/* Right */}
          <div className="absolute w-full h-full border border-ink/10 bg-ink/[0.01] rotate-y-[-90] translate-z-[50px]" /> {/* Left */}
          <div className="absolute w-full h-full border border-ink/10 bg-ink/[0.01] rotate-x-90 translate-z-[50px]" /> {/* Top */}
          <div className="absolute w-full h-full border border-ink/10 bg-ink/[0.01] rotate-x-[-90] translate-z-[50px]" /> {/* Bottom */}
        </motion.div>

      </motion.div >

      {/* Static Background Texture/Noise Overlay removed to show global background */}
    </div >
  );
};

export default InteractiveBackground;