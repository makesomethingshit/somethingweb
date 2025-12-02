
import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE } from '../constants';

const Experience: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center py-24 relative z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 border-b border-ink/10 pb-8">
          <div>
            <span className="font-sans text-xs text-accent uppercase tracking-[0.2em] mb-4 block">Chapter 02</span>
            <h2 className="font-serif text-5xl md:text-6xl text-ink">Timeline</h2>
          </div>
          <p className="max-w-xs text-sm text-sub font-light leading-relaxed text-right mt-8 md:mt-0 font-serif-kr">
            시간의 궤적.<br />
            경험이 남긴 흔적들.
          </p>
        </div>

        {/* Timeline Content */}
        <div className="relative border-l border-ink/10 ml-4 md:ml-0 space-y-20">
          {EXPERIENCE.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="relative pl-12 md:pl-24 group"
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-paper border border-ink/30 group-hover:bg-accent group-hover:border-accent transition-colors duration-500 z-10"></div>

              <div className="grid md:grid-cols-12 gap-8 items-start">
                {/* Period */}
                <div className="md:col-span-3 pt-1">
                  <span className="font-sans text-xs font-medium text-accent uppercase tracking-widest block mb-1">{exp.period}</span>
                </div>

                {/* Role & Company */}
                <div className="md:col-span-9">
                  <h3 className="text-3xl font-serif text-ink mb-2 group-hover:text-accent transition-colors duration-300">{exp.company}</h3>
                  <p className="text-sm font-sans text-sub uppercase tracking-wide mb-8">{exp.position}</p>

                  {/* Description */}
                  <ul className="space-y-4">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-ink/70 text-base font-serif-kr font-light leading-loose pl-0">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
