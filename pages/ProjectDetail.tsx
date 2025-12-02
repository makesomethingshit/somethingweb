import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProjectDetail: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-12 flex flex-col items-center font-sans">
            {/* Back Button Area */}
            <div className="w-full max-w-4xl mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-ink/60 hover:text-ink transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-serif italic text-lg">Back to Collection</span>
                </button>
            </div>

            {/* Note Container */}
            <div className="relative w-full max-w-4xl bg-[#fffdf5] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden min-h-[80vh]">

                {/* Binding/Perforation Effect (Top) */}
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10"></div>

                {/* Ruled Lines Background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(transparent 31px, #e5e7eb 32px)',
                        backgroundSize: '100% 32px',
                        marginTop: '4rem' // Offset for title area
                    }}
                ></div>

                {/* Red Margin Line */}
                <div className="absolute top-0 left-12 md:left-24 w-[1px] h-full bg-red-300/50 z-0"></div>

                {/* Content Area */}
                <div className="relative z-10 p-12 md:p-24 pt-16">

                    {/* Handwritten-style Title */}
                    <div className="mb-12 relative">
                        <h1 className="font-serif text-5xl md:text-6xl text-ink relative inline-block">
                            Project 01
                            {/* Underline highlight */}
                            <span className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-200/50 -rotate-1 -z-10 rounded-sm"></span>
                        </h1>
                        <div className="font-mono text-sm text-ink/40 mt-2 ml-1">Date: 2024. 12. 01</div>
                    </div>

                    {/* "Pasted" Image */}
                    <div className="relative mb-12 rotate-1 hover:rotate-0 transition-transform duration-500 ease-out origin-top-left inline-block">
                        <div className="p-3 bg-white shadow-lg border border-gray-100">
                            <div className="w-full max-w-2xl aspect-video bg-gray-200 overflow-hidden relative">
                                <img src="/projects/project1_image.png" alt="Project 1" className="w-full h-full object-cover" />
                                {/* Tape effect */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-sm rotate-3 shadow-sm border-l border-r border-white/60"></div>
                            </div>
                        </div>
                    </div>

                    {/* Text Content aligned to lines */}
                    <div className="prose prose-lg max-w-none font-serif text-ink/80 leading-[32px]">
                        <p className="mb-0">
                            This is the detailed description of Project 01. The interactive thumbnail led you here.
                            We designed this page to look like a research note. The lines guide the text,
                            and the image feels like it was physically attached to the paper.
                        </p>
                        <p className="mt-[32px] mb-0">
                            You can go back to the previous page and your scroll position should be restored.
                            The texture and shadows add depth to the experience, making it feel tactile and personal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
