import React from 'react';

const Projects: React.FC = () => {
    return (
        <div className="w-full h-screen relative flex items-center justify-center overflow-hidden">
            {/* Background Image matching Hero's last frame */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/frames/intro_book_video00121.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>

            <div className="relative z-10 text-ink/30 font-serif text-sm tracking-widest uppercase">
                Projects (Coming Soon)
            </div>
        </div>
    );
};

export default Projects;
