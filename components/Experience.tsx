
import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE } from '../constants';

const Experience: React.FC = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-20 relative z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start justify-between mb-20 border-b border-ink/10 pb-10">
             <h2 className="font-serif text-5xl md:text-6xl text-ink mb-8 md:mb-0">Career History</h2>
             <p className="max-w-xs text-sm text-sub font-light leading-relaxed text-right">
                협업의 여정.<br/>
                성장의 기록.
             </p>
        </div>

        <div className="space-y-0">
          {EXPERIENCE.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group border-b border-ink/10 py-16 hover:bg-white/40 transition-colors duration-500"
            >
              <div className="grid md:grid-cols-12 gap-8">
                {/* Period */}
                <div className="md:col-span-3">
                  <span className="font-sans text-xs text-sub uppercase tracking-widest block mb-2">{exp.period}</span>
                </div>

                {/* Role & Company */}
                <div className="md:col-span-4">
                   <h3 className="text-2xl font-serif text-ink mb-1 group-hover:text-accent transition-colors">{exp.company}</h3>
                   <p className="text-sm font-sans text-sub uppercase tracking-wide">{exp.position}</p>
                </div>
                
                {/* Description */}
                <div className="md:col-span-5">
                   <ul className="space-y-3">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-sub text-sm font-serif-kr font-light leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
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
