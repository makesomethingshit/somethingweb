import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProjectDetail: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-paper p-8 md:p-24 flex flex-col items-start">
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-ink opacity-50 hover:opacity-100 transition-opacity mb-12"
            >
                <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                <span className="font-serif italic text-lg">Back</span>
            </button>

            <div className="max-w-4xl w-full">
                <h1 className="font-serif text-5xl md:text-7xl mb-8 text-ink">Project 01</h1>
                <div className="w-full aspect-video bg-gray-200 mb-8 overflow-hidden rounded-lg">
                    <img src="/projects/project1_image.png" alt="Project 1" className="w-full h-full object-cover" />
                </div>
                <p className="font-sans text-lg leading-relaxed text-sub max-w-2xl">
                    This is the detailed description of Project 01. The interactive thumbnail led you here.
                    You can go back to the previous page and your scroll position should be restored.
                </p>
            </div>
        </div>
    );
};

export default ProjectDetail;
