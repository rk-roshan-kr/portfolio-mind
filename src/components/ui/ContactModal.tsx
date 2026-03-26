'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Shield, Zap, Terminal } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const ContactModal = () => {
  const isOpen = useStore((state) => state.isContactModalOpen);
  const toggle = useStore((state) => state.toggleContactModal);
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'encoded'>('idle');

  // Background particle effect
  const particles = Array.from({ length: 20 });

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('transmitting');
    
    // Artificial latency for "Decryption/Encoding" effect
    await new Promise(r => setTimeout(r, 2000));
    
    setStatus('encoded');
    setTimeout(() => {
      setStatus('idle');
      setFormData({ name: '', email: '', message: '' });
      toggle(false);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggle(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#050508] border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-hidden"
          >
            {/* Scanned-line effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 neural-grid h-full" />
            
            {/* Header Area */}
            <div className="relative border-b border-cyan-500/20 p-6 flex justify-between items-center bg-cyan-950/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.4em] font-black">
                        INITIATING_SECURE_CHANNEL
                    </h2>
                </div>
                <p className="text-[10px] font-mono text-white/30 uppercase">Protocol: RSA_ENCRYPTED_v2.5 // Terminal: {status === 'idle' ? 'STANDBY' : 'ACTIVE_STREAM'}</p>
              </div>
              <button 
                onClick={() => toggle(false)}
                className="p-2 hover:bg-white/5 text-white/40 hover:text-white transition-all border border-transparent hover:border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-8 relative">
              
              {status === 'encoded' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-16 h-16 border-2 border-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                    <Shield className="text-cyan-400" size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Transmission Encoded</h3>
                    <p className="text-sm font-mono text-cyan-500/60 uppercase tracking-widest leading-relaxed">Identity Packet Fragmented & Sent. <br/> Response latency expected: ~24-48hrs.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleTransmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest pl-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-cyan-500 rounded-full"></span> [ IDENTITY ]
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder="DESIGNATION / NAME"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/[0.02] border border-white/10 p-4 font-mono text-xs text-white placeholder:text-white/10 focus:border-cyan-500/50 focus:bg-cyan-500/[0.03] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest pl-2 flex items-center gap-2">
                         <span className="w-1 h-1 bg-cyan-500 rounded-full"></span> [ RETURN_ENDPOINT ]
                      </label>
                      <input 
                        required
                        type="email"
                        placeholder="EMAIL_ADDRESS"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/[0.02] border border-white/10 p-4 font-mono text-xs text-white placeholder:text-white/10 focus:border-cyan-500/50 focus:bg-cyan-500/[0.03] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest pl-2 flex items-center gap-2">
                       <span className="w-1 h-1 bg-cyan-500 rounded-full"></span> [ DATA_PACKET ]
                    </label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="ENTER_MESSAGE_CONTENTS..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white/[0.02] border border-white/10 p-4 font-mono text-xs text-white placeholder:text-white/10 focus:border-cyan-500/50 focus:bg-cyan-500/[0.03] outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex gap-2">
                       <div className="w-6 h-6 border border-cyan-500/20 flex items-center justify-center">
                         <Terminal size={12} className="text-cyan-500/40" />
                       </div>
                       <div className="w-6 h-6 border border-cyan-500/20 flex items-center justify-center">
                         <Zap size={12} className="text-cyan-500/40" />
                       </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={status === 'transmitting'}
                      className={`
                        flex items-center gap-4 px-8 py-3 
                        ${status === 'transmitting' ? 'bg-cyan-500/20 cursor-wait' : 'bg-cyan-500 hover:bg-cyan-400'} 
                        text-black font-black uppercase italic tracking-tighter text-sm transition-all relative overflow-hidden group
                      `}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      {status === 'transmitting' ? (
                        <>ENCODING...</>
                      ) : (
                        <>
                          TRANSMIT_SIGNAL
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Matrix Status */}
            <div className="bg-black/80 px-8 py-3 border-t border-cyan-500/10 flex justify-between items-center text-[8px] font-mono text-cyan-500/40 uppercase tracking-[0.3em]">
               <div>Core_v4.1 // Secure_Buffer: {status === 'idle' ? '0%' : '100%'}</div>
               <div className="flex gap-4">
                 <span>Lat: [12ms]</span>
                 <span>Pkt: [SHA_256]</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
