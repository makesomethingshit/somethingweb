import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !project) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-[9998]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div className="bg-paper w-full max-w-5xl h-[85vh] md:h-[90vh] rounded-sm shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative border border-ink/5">
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-paper/50 hover:bg-ink hover:text-paper transition-colors duration-300 backdrop-blur-sm border border-ink/10"
              >
                <X size={24} />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 custom-scrollbar relative">
                
                {/* Hero Image */}
                <div className="w-full h-[40vh] md:h-[50vh] relative shrink-0">
                   <img 
                     src={project.imageUrl} 
                     alt={project.title} 
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent opacity-40"></div>
                </div>

                {/* Text Content */}
                <div className="px-6 md:px-16 py-12 md:py-16 max-w-4xl mx-auto">
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-6 text-xs font-sans uppercase tracking-widest text-sub mb-6 border-b border-ink/10 pb-6">
                        {project.year && (
                            <div>
                                <span className="text-accent mr-2">Year</span>
                                {project.year}
                            </div>
                        )}
                        {project.role && (
                            <div>
                                <span className="text-accent mr-2">Role</span>
                                {project.role}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-4xl md:text-6xl text-ink mb-8 leading-tight">
                        {project.title}
                    </h2>

                    {/* Full Description */}
                    <div className="mb-12">
                        <h3 className="font-sans text-xs text-accent uppercase tracking-[0.2em] mb-6">Translation Note</h3>
                        <div className="font-serif-kr text-base md:text-lg text-sub leading-loose whitespace-pre-line break-keep">
                            {project.fullDescription || project.description}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-16">
                        <h3 className="font-sans text-xs text-accent uppercase tracking-[0.2em] mb-6">Tools & Languages</h3>
                        <div className="flex flex-wrap gap-3">
                            {project.techStack.map((tech) => (
                                <span key={tech} className="text-sm font-serif text-ink border border-ink/20 px-4 py-2 rounded-full">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-4">
                        {project.demoUrl && project.demoUrl !== '#' && (
                             <a 
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-ink text-paper px-8 py-3 font-sans text-sm uppercase tracking-widest hover:bg-accent transition-colors"
                             >
                                Watch Video <ArrowRight size={16} />
                             </a>
                        )}
                    </div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ProjectModal;