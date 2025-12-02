import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-paper/95 backdrop-blur-sm flex items-center justify-center"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 hover:bg-ink/5 rounded-full transition-colors group"
                    >
                        <X className="w-8 h-8 text-ink group-hover:text-accent transition-colors" />
                    </button>

                    {/* Grid Background (Subtle) */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                            <g stroke="#2A52BE" strokeWidth="0.5" fill="none">
                                <line x1="960" y1="50" x2="960" y2="1030" strokeDasharray="4 4" />
                                <rect x="50" y="50" width="1820" height="980" />
                            </g>
                        </svg>
                    </div>

                    <div className="w-full max-w-[1820px] px-6 md:px-[50px] flex justify-between items-start h-[80vh]">

                        {/* Left Page: Info */}
                        <div className="hidden md:flex w-1/2 h-full flex-col justify-between pl-[50px] pr-[50px] border-r border-ink/10">
                            <div>
                                <h2 className="font-serif text-6xl text-ink tracking-tighter mb-8">
                                    NAVIGATION
                                </h2>
                                <div className="w-16 h-[1px] bg-ink/30 mb-8"></div>
                            </div>

                            <div className="mb-20">
                                <p className="font-serif-kr text-lg text-sub font-light leading-relaxed">
                                    어디로 이동하시겠습니까?<br />
                                    원하는 챕터를 선택해주세요.
                                </p>
                            </div>
                        </div>

                        {/* Right Page: Menu Items */}
                        <div className="w-full md:w-1/2 h-full flex flex-col justify-center pl-0 md:pl-[100px]">
                            <ul className="space-y-8 md:space-y-12">
                                {[
                                    { id: '00', title: 'Home', desc: 'Back to Cover', path: '/' },
                                    { id: '01', title: 'Work', desc: 'Selected Projects', path: '/work' },
                                    { id: '02', title: 'Profile', desc: 'Experience & Skills', path: '/about' }
                                ].map((item, index) => (
                                    <motion.li
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                                        className="group cursor-pointer"
                                    >
                                        <Link to={item.path} onClick={onClose} className="block">
                                            <div className="flex items-baseline gap-4 md:gap-8 mb-2">
                                                <span className="font-sans text-xs md:text-sm text-accent font-bold tracking-widest">
                                                    {item.id}
                                                </span>
                                                <h3 className="font-serif text-4xl md:text-6xl text-ink group-hover:text-accent transition-colors duration-300 italic">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-4 pl-14 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                                <span className="w-8 h-[1px] bg-accent"></span>
                                                <span className="font-sans text-xs text-sub uppercase tracking-widest">
                                                    {item.desc}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-accent" />
                                            </div>
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MenuOverlay;
