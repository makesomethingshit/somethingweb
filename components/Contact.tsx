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

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <section className="min-h-[80vh] flex items-center justify-center py-32 relative z-20 bg-paper">
            <div className="container mx-auto px-6 md:px-12 max-w-5xl">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Header: Meta Info */}
                    <div className="flex justify-between items-end border-b border-ink/10 pb-6 mb-12">
                        <div className="flex flex-col gap-2">
                            <span className="font-sans text-xs uppercase tracking-[0.2em] text-ink/40">Correspondence</span>
                            <span className="font-serif text-xl italic text-ink">To. Junsoo</span>
                        </div>
                        <div className="text-right">
                            <span className="font-mono text-xs text-ink/40 tracking-widest uppercase">{dateString}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-16">

                        {/* Message Body - The Hero */}
                        <div className="group relative">
                            <textarea
                                id="message"
                                required
                                rows={1}
                                value={formState.message}
                                onChange={(e) => {
                                    setFormState({ ...formState, message: e.target.value });
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                className="w-full bg-transparent border-none p-0 text-3xl md:text-5xl font-serif leading-tight resize-none placeholder-ink/10 focus:ring-0 focus:outline-none transition-all"
                                placeholder="Start typing your message..."
                            ></textarea>
                        </div>

                        {/* Footer: Inputs & Action */}
                        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-12 items-end border-t border-ink/10 pt-12">

                            {/* Name */}
                            <div className="group relative">
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full bg-transparent border-b border-ink/10 py-2 text-lg font-serif focus:border-ink transition-colors focus:outline-none placeholder-ink/20"
                                    placeholder="Your Name"
                                />
                            </div>

                            {/* Email */}
                            <div className="group relative">
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full bg-transparent border-b border-ink/10 py-2 text-lg font-serif focus:border-ink transition-colors focus:outline-none placeholder-ink/20"
                                    placeholder="Your Email"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="group flex items-center gap-4 px-8 py-4 bg-ink text-paper hover:bg-accent transition-colors duration-500"
                            >
                                <span className="font-sans text-xs uppercase tracking-[0.2em]">Send</span>
                                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
