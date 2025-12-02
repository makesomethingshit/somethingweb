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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, rotate: -1 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div className="bg-paper w-full max-w-4xl h-[85vh] md:h-[90vh] shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 32px)',
                backgroundAttachment: 'local',
                backgroundSize: '100% 32px',
                marginTop: '32px' // Align first line
              }}>

              {/* Binding Effect (Top) */}
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/10 to-transparent z-20 pointer-events-none"></div>

              {/* Close Button (Hand-drawn style) */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-2 text-ink/60 hover:text-ink transition-colors duration-300 font-handwriting-en text-2xl"
              >
                Close X
              </button>

              {/* Scrollable Content */}
              <div
                className="overflow-y-auto flex-1 custom-scrollbar relative p-6 md:p-12 pt-16"
                data-lenis-prevent
              >

                {/* Content Container */}
                <div className="max-w-3xl mx-auto">

                  {/* Header Area */}
                  <div className="mb-12 relative">
                    <div className="flex flex-wrap gap-4 text-sm font-handwriting-en text-sub mb-4 uppercase tracking-widest">
                      {project.year && (
                        <span>Year: {project.year}</span>
                      )}
                      {project.role && (
                        <span>Role: {project.role}</span>
                      )}
                    </div>

                    <h2 className="font-handwriting-en font-bold text-5xl md:text-6xl text-ink mb-4 leading-tight relative inline-block">
                      {project.title}
                      {/* Highlighter effect */}
                      <span className="absolute bottom-2 left-0 w-full h-4 bg-yellow-200/40 -z-10 -rotate-1 rounded-sm"></span>
                    </h2>
                  </div>

                  {/* Photo with Tape Effect */}
                  <div className="mb-12 relative inline-block rotate-1 hover:rotate-0 transition-transform duration-500 origin-center">
                    <div className="p-2 bg-white shadow-lg border border-gray-100 relative">
                      <div className="w-full aspect-video bg-gray-100 overflow-hidden">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Tape */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm border-l border-r border-white/60"></div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-12">
                    <h3 className="font-handwriting-en text-3xl font-bold text-accent mb-6 border-b border-ink/10 pb-2 inline-block">Translation Note:</h3>
                    <div className="font-handwriting-kr text-lg md:text-xl text-ink/80 leading-loose whitespace-pre-line break-keep">
                      {project.fullDescription || project.description}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-12">
                    <h3 className="font-handwriting-en text-3xl font-bold text-accent mb-6 border-b border-ink/10 pb-2 inline-block">Tools Used:</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="font-handwriting-en text-lg text-ink border border-ink/20 rounded-full px-4 py-1">
                          #{tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-4 mt-8">
                    {project.demoUrl && project.demoUrl !== '#' && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 font-handwriting-en text-2xl text-ink hover:text-accent transition-colors border-b border-ink hover:border-accent pb-1"
                      >
                        Watch Video <ArrowRight size={20} />
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