import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

export interface PageTearTransitionHandle {
    setProgress: (progress: number) => void;
}

interface PageTearTransitionProps {
    targetRef: React.RefObject<HTMLDivElement>;
    borderRef?: React.RefObject<HTMLDivElement>;
}

const PageTearTransition = forwardRef<PageTearTransitionHandle, PageTearTransitionProps>(({ targetRef, borderRef }, ref) => {
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const frameCount = 125; // 0 to 124

    // Preload Images as Blobs for Zero-Latency Access
    useEffect(() => {
        const loadImages = async () => {
            const promises = [];
            for (let i = 0; i < frameCount; i++) {
                const frameNumber = i.toString().padStart(5, '0');
                const filename = `ink_transition_${frameNumber}.jpg`;
                const url = `/overlays/ink_transition/${filename}`;

                // Fetch as Blob to bypass HTTP cache latency on scroll
                const promise = fetch(url)
                    .then(response => response.blob())
                    .then(blob => {
                        const objectUrl = URL.createObjectURL(blob);

                        // Create Image element and Decode it
                        const img = new Image();
                        img.src = objectUrl;

                        // decode() ensures the image is decompressed and ready for GPU
                        // This prevents the "white flash" on first paint
                        return img.decode().then(() => {
                            imagesRef.current[i] = img;
                        }).catch((err) => {
                            console.warn(`Failed to decode frame ${i}, falling back to standard load`, err);
                            imagesRef.current[i] = img;
                        });
                    })
                    .catch(err => console.error(`Failed to load ink frame ${i}`, err));

                promises.push(promise);
            }

            await Promise.all(promises);
            setImagesLoaded(true);
            console.log("Ink transition images loaded (Blob + Decode Mode)");
        };

        loadImages();

        // Cleanup Object URLs on unmount
        return () => {
            imagesRef.current.forEach(img => {
                if (img && img.src) URL.revokeObjectURL(img.src);
            });
        };
    }, []);

    // Imperative Handle to update progress
    useImperativeHandle(ref, () => ({
        setProgress: (progress: number) => {
            // STRICT CHECK: Do not attempt to update mask if images aren't fully loaded
            // This prevents the "flickering then changing" issue on first run
            if (!targetRef.current || !imagesLoaded) return;

            // Map progress to frame index
            const frameIndex = Math.min(
                Math.floor(progress * (frameCount - 1)),
                frameCount - 1
            );

            const img = imagesRef.current[frameIndex];
            if (!img) return;

            const maskStyle = `url(${img.src})`;

            // Apply Mask directly to Hero
            if (targetRef.current.style.maskImage !== maskStyle) {
                targetRef.current.style.maskImage = maskStyle;
                targetRef.current.style.webkitMaskImage = maskStyle;
            }

            // Apply to Border Layer if exists
            if (borderRef?.current) {
                if (borderRef.current.style.maskImage !== maskStyle) {
                    borderRef.current.style.maskImage = maskStyle;
                    borderRef.current.style.webkitMaskImage = maskStyle;
                }
            }
        }
    }));

    return null; // No DOM elements needed, purely logic
});

export default PageTearTransition;
