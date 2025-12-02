import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface ProjectRevealProps {
    progress: number;
    onOpenProject: () => void;
    resetKey: number;
    onVideoEnd?: () => void;
    onVideoReset?: () => void;
    onTextTrigger?: () => void;
}

const ProjectReveal: React.FC<ProjectRevealProps> = ({ progress, onOpenProject, resetKey, onVideoEnd, onVideoReset, onTextTrigger }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const sketchRef = useRef<HTMLImageElement>(null);
    const colorRef = useRef<HTMLImageElement>(null);
    const textTriggeredRef = useRef(false);
    const hasPlayedRef = useRef(false);

    // Off-screen canvases
    const contentCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const spotCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement | null>(null); // WebGL for Ink Mask

    // WebGL Refs
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const textureRef = useRef<WebGLTexture | null>(null);
    const positionBufferRef = useRef<WebGLBuffer | null>(null);

    // Spot Radius for Hover/Click (Start at 0 for animation)
    const spotRadius = useRef(0);
    // Mask Expansion (Ink Bleed) for Click Transition
    const maskExpansion = useRef(1.0);

    const [isHovering, setIsHovering] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Reset Logic
    useEffect(() => {
        if (resetKey > 0) {
            setIsTransitioning(false);
            gsap.to(spotRadius, {
                current: 90,
                duration: 1.0,
                ease: "power2.out"
            });
            gsap.to(maskExpansion, {
                current: 1.0,
                duration: 1.0,
                ease: "power2.out"
            });
        }
    }, [resetKey]);

    // Assets
    const sketchSrc = "/projects/project1_sketch.png";
    const colorSrc = "/projects/project1_image.png";
    const inkVideoSrc = "/overlays/ink_drop.mp4";

    // Initialize Canvases & WebGL
    useEffect(() => {
        // 1. Content Canvas (2D)
        if (!contentCanvasRef.current) {
            contentCanvasRef.current = document.createElement('canvas');
            contentCanvasRef.current.width = 1200;
            contentCanvasRef.current.height = 800;
        }
        // 2. Spot Canvas (2D)
        if (!spotCanvasRef.current) {
            spotCanvasRef.current = document.createElement('canvas');
            spotCanvasRef.current.width = 1200;
            spotCanvasRef.current.height = 800;
        }
        // 3. Mask Canvas (WebGL)
        if (!maskCanvasRef.current) {
            maskCanvasRef.current = document.createElement('canvas');
            maskCanvasRef.current.width = 600; // Low res is fine for ink
            maskCanvasRef.current.height = 400;

            const gl = maskCanvasRef.current.getContext('webgl', { alpha: true, premultipliedAlpha: false });
            if (gl) {
                glRef.current = gl;
                initWebGL(gl);
            }
        }
    }, []);

    const initWebGL = (gl: WebGLRenderingContext) => {
        // Vertex Shader (Standard)
        const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        // Fragment Shader (Ink Bleed: Alpha = (1.0 - Red) * Expansion)
        const fsSource = `
            precision mediump float;
            uniform sampler2D u_image;
            uniform float u_expansion;
            varying vec2 v_texCoord;
            void main() {
                vec4 color = texture2D(u_image, v_texCoord);
                // Video: White(1.0) BG, Black(0.0) Ink.
                // We want: Transparent(0.0) BG, Opaque(1.0) Ink.
                // Multiply by u_expansion to make the ink "bleed" into the white areas.
                float alpha = clamp((1.0 - color.r) * u_expansion, 0.0, 1.0); 
                gl_FragColor = vec4(0.0, 0.0, 0.0, alpha); 
            }
        `;

        // Compile Shaders
        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vs = createShader(gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        programRef.current = program;

        // Buffers
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Full quad with flipped Y for texture coords if needed, but standard usually fine
        // Clip space: -1 to 1. Texture: 0 to 1.
        const positions = new Float32Array([
            -1.0, -1.0, 0.0, 1.0,
            1.0, -1.0, 1.0, 1.0,
            -1.0, 1.0, 0.0, 0.0,
            -1.0, 1.0, 0.0, 0.0,
            1.0, -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 0.0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        positionBufferRef.current = positionBuffer;

        // Texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        textureRef.current = texture;
    };

    // Video Auto-Play Logic
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Set playback rate to 1.5x (faster)
        video.playbackRate = 1.5;

        if (progress > 0.5) {
            // Play if visible and hasn't played yet
            if (video.paused && !hasPlayedRef.current) {
                hasPlayedRef.current = true; // Mark as played
                video.play().catch(() => {
                    // Handle autoplay policy issues
                });
            }
        } else if (progress < 0.1) {
            // Reset if scrolled away
            if (!video.paused || video.currentTime > 0) {
                video.pause();
                video.currentTime = 0;
                textTriggeredRef.current = false;
                hasPlayedRef.current = false; // Reset played state
                if (onVideoReset) onVideoReset();
            }
        }
    }, [progress, onVideoReset]);

    // Handle Video Events (End & Progress)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            if (onVideoEnd) onVideoEnd();
        };

        const handleTimeUpdate = () => {
            if (onTextTrigger && !textTriggeredRef.current && video.duration > 0) {
                if (video.currentTime / video.duration > 0.25) {
                    textTriggeredRef.current = true;
                    onTextTrigger();
                }
            }
        };

        video.addEventListener('ended', handleEnded);
        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [onVideoEnd, onTextTrigger]);

    // Main Rendering Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const sketch = sketchRef.current;
        const color = colorRef.current;
        const video = videoRef.current;
        const contentCanvas = contentCanvasRef.current;
        const spotCanvas = spotCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const gl = glRef.current;
        const program = programRef.current;

        if (!canvas || !sketch || !color || !video || !contentCanvas || !spotCanvas || !maskCanvas || !gl || !program) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const contentCtx = contentCanvas.getContext('2d', { willReadFrequently: true });
        const spotCtx = spotCanvas.getContext('2d', { willReadFrequently: true });

        if (!ctx || !contentCtx || !spotCtx) return;

        canvas.width = 1200;
        canvas.height = 800;

        let animationFrameId: number;

        const draw = () => {
            // Optimization: Stop drawing if progress is 0 (invisible)
            if (progress <= 0 && !isTransitioning) {
                animationFrameId = requestAnimationFrame(draw); // Keep loop alive but do nothing? No, better to stop.
                // Actually, if we stop, we need a way to restart.
                // The useEffect dependency [progress] will restart it if progress changes from 0 to >0.
                return;
            }

            // 0. Clear Main and Content
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            contentCtx.clearRect(0, 0, contentCanvas.width, contentCanvas.height);

            // Layout Calculations
            const imgAspect = sketch.naturalWidth / sketch.naturalHeight;
            const canvasAspect = canvas.width / canvas.height;
            let drawW, drawH, offsetX, offsetY;

            // Scale factor increased by 5% (1.05) - slightly larger than original
            const scale = 1.05;

            if (imgAspect > canvasAspect) {
                drawW = canvas.width * scale;
                drawH = (canvas.width / imgAspect) * scale;
                offsetX = (canvas.width - drawW) / 2;
                offsetY = 0; // Force Top Alignment
            } else {
                drawH = canvas.height * scale;
                drawW = (canvas.height * imgAspect) * scale;
                offsetX = (canvas.width - drawW) / 2;
                offsetY = 0; // Force Top Alignment
            }

            // --- STEP 1: Compose Content (Sketch + Spot) ---
            contentCtx.globalCompositeOperation = 'source-over';
            contentCtx.drawImage(sketch, offsetX, offsetY, drawW, drawH);

            // Handle Hover Spot (Always draw if hovering OR transitioning)
            if ((isHovering || isTransitioning) && progress > 0.5) {
                spotCtx.clearRect(0, 0, spotCanvas.width, spotCanvas.height);
                spotCtx.save();

                // Optimization: Removed expensive SVG filter 'url(#wobbly-filter)'
                // Instead, draw multiple overlapping circles with slight offsets to simulate irregularity

                const baseRadius = spotRadius.current;

                // 1. Main Circle
                const gradient = spotCtx.createRadialGradient(
                    mousePos.x, mousePos.y, 0,
                    mousePos.x, mousePos.y, baseRadius
                );
                gradient.addColorStop(0, 'white');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                spotCtx.fillStyle = gradient;
                spotCtx.beginPath();
                spotCtx.arc(mousePos.x, mousePos.y, baseRadius * 1.2, 0, Math.PI * 2);
                spotCtx.fill();

                // 2. Secondary "Wobble" Circles (Static offsets for performance, or use simple math)
                // To make it truly efficient, we just use a slightly larger, softer circle behind it
                const outerGradient = spotCtx.createRadialGradient(
                    mousePos.x, mousePos.y, 0,
                    mousePos.x, mousePos.y, baseRadius * 1.1
                );
                outerGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)');
                outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                spotCtx.fillStyle = outerGradient;
                spotCtx.beginPath();
                spotCtx.arc(mousePos.x + 5, mousePos.y - 5, baseRadius * 1.3, 0, Math.PI * 2);
                spotCtx.fill();

                spotCtx.globalCompositeOperation = 'source-in';
                spotCtx.drawImage(color, offsetX, offsetY, drawW, drawH);
                spotCtx.restore();

                contentCtx.drawImage(spotCanvas, 0, 0);
            }

            // --- STEP 2: WebGL Ink Mask ---
            if (video.readyState >= 2) {
                gl.useProgram(program);

                // Set Expansion Uniform
                const expansionLocation = gl.getUniformLocation(program, "u_expansion");
                gl.uniform1f(expansionLocation, maskExpansion.current);

                // Bind Attributes
                const positionLocation = gl.getAttribLocation(program, "a_position");
                const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
                gl.enableVertexAttribArray(texCoordLocation);
                gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);

                // Upload Texture
                gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

                // Draw
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }

            // --- STEP 3: Final Composite ---
            ctx.drawImage(contentCanvas, 0, 0);
            ctx.globalCompositeOperation = 'destination-in';

            // Scale mask by 5% (1.05)
            const maskScale = 1.05;
            const maskW = canvas.width * maskScale;
            const maskH = canvas.height * maskScale;
            const maskX = (canvas.width - maskW) / 2;
            const maskY = (canvas.height - maskH) / 2;

            ctx.drawImage(maskCanvas, maskX, maskY, maskW, maskH);
            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(draw);
        };

        const startDrawing = () => {
            if (sketch.complete && color.complete) {
                // Only start if progress > 0
                if (progress > 0) {
                    draw();
                }
            }
        };
        sketch.onload = startDrawing;
        color.onload = startDrawing;
        if (sketch.complete && color.complete) startDrawing();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovering, mousePos, isTransitioning, progress]);

    // Global Mouse Move Listener for robust interaction
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current || progress <= 0.5) return;

            const rect = canvasRef.current.getBoundingClientRect();

            // Check if mouse is inside the canvas bounds
            const isInside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (isInside) {
                setIsHovering(true);
                const scaleX = canvasRef.current.width / rect.width;
                const scaleY = canvasRef.current.height / rect.height;
                setMousePos({
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY
                });

                // Animate spot to base size if not already
                if (spotRadius.current === 0) {
                    gsap.to(spotRadius, {
                        current: 90,
                        duration: 0.2,
                        ease: "back.out(1.7)"
                    });
                }
            } else {
                setIsHovering(false);
                // Animate spot back to 0
                if (spotRadius.current > 0 && !isTransitioning) {
                    gsap.to(spotRadius, {
                        current: 0,
                        duration: 0.3,
                        ease: "power2.in"
                    });
                }
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [progress, isTransitioning]);

    // Removed local handleMouseEnter/Leave/Move as global listener handles it
    // Removed auto-focus useEffect

    const handleClick = (e: React.MouseEvent) => {
        if (isTransitioning || !canvasRef.current) return;

        // Pixel-perfect click detection
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            // If alpha is 0 (transparent), ignore click
            if (pixel[3] === 0) return;
        }

        setIsTransitioning(true);

        // Animate Spot Radius (Expand to fill screen with color)
        gsap.to(spotRadius, {
            current: 3000,
            duration: 1.5, // Faster duration
            ease: "power2.inOut"
        });

        // Animate Ink Expansion (Bleed ink to fill screen)
        gsap.to(maskExpansion, {
            current: 50,
            duration: 1.5, // Faster duration
            ease: "power2.inOut",
            onComplete: onOpenProject
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative max-w-[1600px] w-full aspect-[3/2] cursor-pointer mx-auto overflow-hidden rounded-sm"
            onClick={handleClick}
        >
            {/* SVG Filter Removed for Performance */}

            {/* Main Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-10"
            />

            {/* Hidden Video Source */}
            <video
                ref={videoRef}
                src={inkVideoSrc}
                className="hidden"
                muted
                playsInline
                preload="auto"
            />

            {/* Hidden Assets */}
            <img ref={sketchRef} src={sketchSrc} className="hidden" alt="sketch" />
            <img ref={colorRef} src={colorSrc} className="hidden" alt="color" />


        </div>
    );
};

export default ProjectReveal;
