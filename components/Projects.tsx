
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import ProjectModal from './ProjectModal';
import { ArrowUpRight } from 'lucide-react';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <div className="relative z-20 bg-paper">
      
      {/* Chapter Title Page */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 sticky top-0 bg-paper z-0">
         <h2 className="font-serif text-6xl md:text-8xl text-ink mb-6 italic">Works</h2>
         <div className="w-16 h-[2px] bg-ink/10 mb-6"></div>
         <p className="font-serif-kr text-sub font-light text-lg">번역된 결과물들</p>
         <span className="absolute bottom-12 font-sans text-xs tracking-widest text-sub/40">SCROLL TO READ</span>
      </section>

      {/* Projects List - Each one is a "Page" */}
      <div className="relative z-10">
        {PROJECTS.map((project, index) => (
            <section 
                key={project.id} 
                className="min-h-screen sticky top-0 bg-paper flex flex-col md:flex-row overflow-hidden border-t border-ink/5"
            >
                {/* Page Number (Absolute) */}
                <div className="absolute top-8 right-8 z-20 font-sans text-xs text-sub/40 tracking-widest">
                    p.{index + 1}
                </div>

                {/* Left Page (Visual) */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden group cursor-pointer" onClick={() => handleOpenModal(project)}>
                    <div className="absolute inset-0 bg-ink/5 z-10 group-hover:bg-ink/0 transition-colors duration-700"></div>
                    <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute bottom-8 left-8 z-20 md:hidden">
                        <span className="bg-paper text-ink px-4 py-2 text-xs font-sans uppercase tracking-widest">Tap to View</span>
                    </div>
                </div>

                {/* Right Page (Text) */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center p-8 md:p-24 relative">
                    {/* Inner Content */}
                    <div className="max-w-md w-full">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.techStack.map(tech => (
                                <span key={tech} className="text-[10px] uppercase tracking-widest border border-ink/20 px-2 py-1 text-sub/80 rounded-full">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <h3 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6 group cursor-pointer hover:text-accent transition-colors" onClick={() => handleOpenModal(project)}>
                            {project.title}
                        </h3>

                        <div className="w-12 h-[1px] bg-accent mb-8"></div>

                        <p className="font-serif-kr text-sub font-light leading-loose text-sm md:text-base mb-12 break-keep line-clamp-4">
                            {project.description}
                        </p>

                        <button 
                            onClick={() => handleOpenModal(project)}
                            className="group flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.2em] text-ink hover:text-accent transition-colors"
                        >
                            Read Full Note 
                            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </section>
        ))}
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        project={selectedProject} 
      />
    </div>
  );
};

export default Projects;
