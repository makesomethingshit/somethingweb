import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';
import { sendMessageStream } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const AIModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '안녕하세요. 최준수(Choi Jun Soo)의 작업을 돕는 AI 어시스턴트입니다. 그의 시각적 번역 작업에 대해 궁금한 점이 있으신가요?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create a placeholder for the model response
    const modelMessageId = Date.now();
    setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

    try {
      const stream = sendMessageStream(userMessage.text);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          // Update the last message (which is the model's placeholder)
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: '오류가 발생했습니다.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`}
      >
        <Sparkles className="text-white w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-4 md:right-8 w-[90vw] md:w-[400px] h-[600px] bg-[#111827] rounded-2xl shadow-2xl z-50 border border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">AI Assistant</h3>
                  <p className="text-xs text-green-400 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                    Online (Gemini 2.5)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                    }`}
                  >
                    {msg.role === 'model' ? (
                         <ReactMarkdown 
                            components={{
                                p: ({node, ...props}) => <p {...props} className="mb-1 last:mb-0" />,
                                ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside ml-1" />,
                                a: ({node, ...props}) => <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noreferrer" />
                            }}
                         >
                            {msg.text}
                         </ReactMarkdown>
                    ) : (
                        msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages.length === messages.filter(m => m.role !== 'model').length && (
                  <div className="flex justify-start">
                      <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700">
                          <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                          </div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#111827] border-t border-gray-800">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="최준수 디자이너에 대해 물어보세요..."
                  className="flex-1 bg-gray-900 text-white text-sm rounded-full px-4 py-3 border border-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-3 rounded-full ${
                    !input.trim() || isLoading
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-blue-600 shadow-lg'
                  } transition-all`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIModal;