
import React from 'react';
import { motion } from 'framer-motion';

const Manifesto: React.FC = () => {
  return (
    // Hero 섹션의 줌인이 끝난 직후(400vh 이후)에 보여짐.
    // Hero의 끝 배경(종이)과 동일한 배경색을 가짐.
    <section className="min-h-screen flex flex-col items-center justify-center py-20 relative z-20 bg-paper">
        
        {/* 페이지 표시 */}
        <div className="w-full text-center mb-16">
            <span className="font-sans text-[10px] text-sub/40 uppercase tracking-[0.3em]">Page. 01</span>
        </div>

        <div className="max-w-4xl px-6 md:px-12 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16"
            >
                <h2 className="font-serif text-5xl md:text-7xl text-ink leading-tight italic mb-4">
                    The Art of <br/>Nuance
                </h2>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif-kr text-lg md:text-xl text-sub font-light leading-loose tracking-wide break-keep space-y-8"
            >
                <p>
                    디자인은 멈춰있지 않습니다. <br/>
                    그것은 언어이며, 흐름이고, <br/>
                    보이지 않는 생각의 번역입니다.
                </p>
                <p>
                    저는 모션그래픽이라는 도구를 통해 <br/>
                    추상적인 가치를 감각적인 경험으로 옮겨 적습니다.
                </p>
                <div className="w-full flex justify-center py-8">
                    <span className="text-accent text-2xl font-serif">❦</span>
                </div>
            </motion.div>
        </div>
    </section>
  );
};

export default Manifesto;
