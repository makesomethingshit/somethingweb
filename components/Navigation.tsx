import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuOverlay from './MenuOverlay';
import { useIntro } from '../context/IntroContext';

const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();
    const isMain = location.pathname === '/';
    const { introFinished } = useIntro();

    useEffect(() => {
        if (isMain) {
            // On main page, show button only after intro is finished
            setIsVisible(introFinished);
        } else {
            setIsVisible(true);
        }
    }, [isMain, introFinished]);

    return (
        <>
            {/* Fixed Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed top-8 right-8 z-[90] mix-blend-difference transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                    }`}
            >
                <div className="flex items-center gap-3 group cursor-pointer">
                    <span className="font-sans text-xs font-bold tracking-[0.2em] text-white group-hover:text-accent transition-colors uppercase">
                        Index
                    </span>
                    <div className="flex flex-col gap-[6px] w-8 items-end">
                        <span className="w-full h-[1px] bg-white group-hover:bg-accent transition-colors"></span>
                        <span className="w-2/3 h-[1px] bg-white group-hover:bg-accent transition-colors group-hover:w-full duration-300"></span>
                    </div>
                </div>
            </button>

            {/* Menu Overlay */}
            <MenuOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default Navigation;
