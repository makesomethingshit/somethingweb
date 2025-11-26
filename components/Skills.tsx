
import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '../constants';

const Skills: React.FC = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-20 relative z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-24">
            
            {/* Header */}
            <div className="md:w-1/3">
                <div className="sticky top-40">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-serif text-5xl text-ink mb-6"
                    >
                        Lexicon
                    </motion.h2>
                    <div className="w-12 h-[2px] bg-accent mb-8"></div>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sub font-sans text-sm leading-relaxed font-light break-keep"
                    >
                        시각적 사유를 위한 어휘 목록.<br/>
                        표현을 완성하는 문법.
                    </motion.p>
                </div>
            </div>
            
            {/* Skills List */}
            <div className="md:w-2/3 space-y-24">
                {SKILLS.map((skillGroup, groupIdx) => (
                    <div key={skillGroup.category}>
                        <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-sans text-xs text-accent uppercase tracking-[0.2em] mb-10"
                        >
                            {skillGroup.category}
                        </motion.h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {skillGroup.items.map((skill, idx) => (
                                <motion.div 
                                    key={skill}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group flex items-center space-x-4 pb-4 border-b border-ink/10"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-ink/20 group-hover:bg-accent transition-colors"></span>
                                    <span className="text-xl md:text-2xl font-serif text-sub group-hover:text-ink transition-colors">
                                        {skill}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
