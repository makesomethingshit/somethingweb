
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
        <div className="w-full">
            {PROJECTS.map((project, index) => (
                <section key={project.id || index} className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 border-b border-ink/10 last:border-b-0 py-12 md:py-0">
                    {/* Left Page (Visual) */}
                    <div className="w-full md:w-[45%] h-[40vh] md:h-[60vh] relative overflow-hidden flex items-center justify-end bg-paper">
                        <div className="relative w-full max-w-lg h-full group cursor-pointer" onClick={() => handleOpenModal(project)}>
                            <div className="absolute inset-0 bg-ink/5 z-10 group-hover:bg-ink/0 transition-colors duration-700"></div>
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute bottom-8 left-8 z-20 md:hidden">
                                <span className="bg-paper text-ink px-4 py-2 text-xs font-sans uppercase tracking-widest">Tap to View</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Page (Text) */}
                    <div className="w-full md:w-[45%] h-auto md:h-[60vh] flex items-center justify-start p-8 md:p-12 relative">
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

            <ProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                project={selectedProject}
            />
        </div>
    );
};

export default Projects;
