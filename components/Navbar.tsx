
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const isMain = location.pathname === '/';
    const [isVisible, setIsVisible] = useState(!isMain);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            if (isMain) {
                // Show navbar after scrolling past 2.5 viewport heights (interaction nearing completion)
                setIsVisible(window.scrollY > window.innerHeight * 2.5);
            } else {
                setIsVisible(true);
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMain]);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-in-out border-b border-transparent py-6 md:py-8 bg-transparent ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative">

                {/* Left: Logo */}
                <Link
                    to="/"
                    className="group cursor-pointer flex items-center gap-4 z-[100]"
                >
                    <div className="w-10 h-10 border border-ink flex items-center justify-center transition-all duration-500 hover:bg-ink hover:text-paper bg-paper/80 backdrop-blur-sm box-border">
                        <span className="font-serif font-bold text-lg tracking-tight">CJS</span>
                    </div>
                </Link>

                {/* Right: Index Dropdown Area */}
                {/* We use a stable container for the trigger and absolute positioning for the dropdown */}
                <div
                    className="relative z-[100]"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {/* Trigger Button - Fixed size/layout to prevent shift */}
                    <div className="flex items-center gap-3 cursor-pointer py-2">
                        <span className="hidden md:block font-sans text-xs uppercase tracking-[0.2em] font-medium text-ink group-hover:text-accent transition-colors">
                            Index
                        </span>
                        <div className={`w-10 h-10 flex items-center justify-center border rounded-full transition-colors bg-paper/80 backdrop-blur-sm ${isOpen ? 'border-accent' : 'border-ink/20'}`}>
                            <div className={`relative w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
                                <span className={`absolute top-1/2 left-0 w-full h-[1px] bg-ink transform -translate-y-1/2 transition-all duration-300 ${isOpen ? 'bg-accent' : ''}`} />
                                <span className={`absolute top-0 left-1/2 w-[1px] h-full bg-ink transform -translate-x-1/2 transition-all duration-300 ${isOpen ? 'bg-accent' : ''}`} />
                            </div>
                        </div>
                    </div>

                    {/* Dropdown Menu - Absolutely positioned relative to this container */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full right-0 mt-2 w-72 bg-[#F9F8F4] border border-ink/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[102] p-8 rounded-sm"
                            >
                                {/* Decorative Binding Line */}
                                <div className="absolute top-0 left-6 w-[1px] h-full bg-ink/5 dashed"></div>

                                {/* Header */}
                                <div className="mb-6 text-center border-b-2 border-ink pb-4 mx-2 ml-6">
                                    <span className="font-serif text-xl font-bold tracking-[0.2em] text-ink">INDEX</span>
                                </div>

                                {/* TOC Items */}
                                <div className="flex flex-col space-y-4 ml-6">
                                    {NAV_LINKS.map((link, idx) => {
                                        const isActive = location.pathname === link.href;
                                        return (
                                            <Link
                                                key={link.name}
                                                to={link.href}
                                                onClick={() => setIsOpen(false)} // Explicit close on click
                                                className="group flex items-end justify-between w-full cursor-pointer"
                                            >
                                                <span className={`font-serif text-lg italic transition-colors duration-300 ${isActive ? 'text-accent font-semibold' : 'text-ink group-hover:text-accent'}`}>
                                                    {link.name}
                                                </span>
                                                <span className="flex-grow mx-3 border-b border-dotted border-ink/30 mb-1.5 group-hover:border-accent/50 transition-colors"></span>
                                                <span className={`font-sans text-[10px] font-medium tracking-widest mb-1 transition-colors ${isActive ? 'text-accent' : 'text-sub group-hover:text-accent'}`}>
                                                    p.0{idx + 1}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Footer */}
                                <div className="mt-8 pt-4 border-t border-ink/10 text-center ml-6">
                                    <span className="font-sans text-[9px] text-ink/30 uppercase tracking-widest">
                                        Choi Jun Soo
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;