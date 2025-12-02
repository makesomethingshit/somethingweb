
import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '../constants';

const Skills: React.FC = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center py-24 relative z-20 bg-ink/[0.02]">
            <div className="container mx-auto px-6 md:px-12 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-12 md:gap-32">

                    {/* Header */}
                    <div className="md:w-1/3">
                        <div className="sticky top-32">
                            <span className="font-sans text-xs text-accent uppercase tracking-[0.2em] mb-4 block">Chapter 03</span>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="font-serif text-5xl md:text-6xl text-ink mb-8"
                            >
                                Lexicon
                            </motion.h2>
                            <div className="w-12 h-[1px] bg-accent mb-8"></div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-ink/60 font-serif-kr text-sm leading-loose font-light break-keep"
                            >
                                시각적 사유를 위한 어휘 목록.<br />
                                표현을 완성하는 문법과 도구들.
                            </motion.p>
                        </div>
                    </div>

                    {/* Skills List */}
                    <div className="md:w-2/3 space-y-20">
                        {SKILLS.map((skillGroup, groupIdx) => (
                            <div key={skillGroup.category}>
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="font-sans text-xs text-ink/40 uppercase tracking-[0.2em] mb-8 border-b border-ink/10 pb-2"
                                >
                                    {skillGroup.category}
                                </motion.h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                                    {skillGroup.items.map((skill, idx) => (
                                        <motion.div
                                            key={skill}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group flex items-baseline justify-between py-3 border-b border-ink/5 hover:border-accent/30 transition-colors"
                                        >
                                            <span className="text-xl font-serif text-ink group-hover:text-accent transition-colors duration-300">
                                                {skill}
                                            </span>
                                            {/* Optional: Add proficiency dots or subtle indicator if needed, currently keeping it clean */}
                                            <span className="w-1 h-1 rounded-full bg-ink/10 group-hover:bg-accent transition-colors"></span>
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
