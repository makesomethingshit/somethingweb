
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("문의가 접수되었습니다.");
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section className="min-h-[80vh] flex items-center py-20 relative z-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-20">
          <h2 className="font-serif text-5xl md:text-6xl text-ink mb-6">Inquiry</h2>
          <p className="text-sub font-serif-kr font-light">
            함께 쓰고 싶은 이야기.<br/>
            세상을 향한 새로운 번역.
          </p>
        </div>

        <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-paper p-10 md:p-16 shadow-[0_0_40px_rgba(0,0,0,0.03)] border border-ink/5"
        >
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                  <div className="group">
                    <label htmlFor="name" className="block text-xs text-sub uppercase tracking-widest mb-3">Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-transparent border-b border-ink/20 py-3 text-ink font-serif focus:outline-none focus:border-accent transition-colors placeholder-ink/20 text-lg"
                      placeholder="성함"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="email" className="block text-xs text-sub uppercase tracking-widest mb-3">Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-transparent border-b border-ink/20 py-3 text-ink font-serif focus:outline-none focus:border-accent transition-colors placeholder-ink/20 text-lg"
                      placeholder="이메일 주소"
                    />
                  </div>
              </div>
              <div className="group">
                <label htmlFor="message" className="block text-xs text-sub uppercase tracking-widest mb-3">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  className="w-full bg-transparent border-b border-ink/20 py-3 text-ink font-serif focus:outline-none focus:border-accent transition-colors resize-none placeholder-ink/20 text-lg"
                  placeholder="프로젝트 의뢰 및 협업 제안"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center space-x-3 bg-ink text-white px-10 py-4 hover:bg-accent transition-colors duration-300"
                >
                  <span className="text-sm font-sans uppercase tracking-widest">Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            <div className="mt-16 text-center space-y-2">
                <p className="flex items-center justify-center space-x-2 text-sub font-serif">
                    <Mail size={16} className="text-accent" />
                    <span>hello@junsoo.motion</span>
                </p>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
