import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-paper border-t border-ink/5">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="font-serif text-ink font-bold text-lg">Jun-Soo.</span>
        </div>
        <div className="text-sub text-xs font-sans tracking-wider text-center md:text-right opacity-60">
          <p>&copy; {new Date().getFullYear()} Choi Jun Soo. All rights reserved.</p>
          <p className="mt-2">Translation & Storytelling Portfolio</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;