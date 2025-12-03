
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
        <div className="w-full relative">
            {PROJECTS.map((project, index) => (
                <section key={project.id || index} className="w-full h-screen flex items-center justify-center relative overflow-hidden bg-[#F5F0E6]">
                    {/* Paper Texture Background */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply">
                        <img
                            src="/patterns/cream-paper.png"
                            alt="Paper Texture"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Grid Container matching Hero */}
                    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 items-start justify-center gap-8 z-30 p-4 md:p-12 pt-24 md:pt-32 pointer-events-none">

                        {/* Left: Project Visual (2 Columns) */}
                        <div className="w-full md:col-span-2 flex justify-center items-start h-full pointer-events-auto relative">
                            <div className="w-full h-[50vh] md:h-[60vh] relative group cursor-pointer" onClick={() => handleOpenModal(project)}>
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

                        {/* Vertical Divider Line */}
                        <div className="hidden md:block absolute left-2/3 top-0 bottom-0 w-[1px] bg-ink/20 h-full -ml-4"></div>

                        {/* Right: Text Content (1 Column) */}
                        <div className="w-full md:col-span-1 text-ink flex flex-col justify-start items-start text-left relative z-40 min-h-[150px] pl-4 md:pl-8 pr-4 md:pr-12 pt-32 pointer-events-auto">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="text-[10px] uppercase tracking-widest border border-ink/20 px-2 py-1 text-sub/80 rounded-full">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-ink leading-tight mb-6 group cursor-pointer hover:text-accent transition-colors block break-words" onClick={() => handleOpenModal(project)}>
                                {project.title}
                            </h3>

                            <div className="w-12 h-[1px] bg-accent mb-8"></div>

                            <p className="font-serif-kr text-sub font-light leading-loose text-xs md:text-base mb-12 break-keep line-clamp-4">
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
