'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { logs } from '@/data/logs';
import { Terminal, Activity, Shield, Cpu, ChevronRight } from 'lucide-react';

export default function LogsPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#020205] text-white flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar neural-grid relative">
        {/* Scanline Effect */}
        <div className="scanline" />

        <div className="py-24 px-6 md:px-20 lg:px-40 relative z-10">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative border-l-4 border-cyan-500 pl-8 py-4 bg-cyan-950/5 backdrop-blur-sm"
            >
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l border-cyan-500/30" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500 uppercase tracking-[0.5em] font-black">
                  <Activity size={12} className="animate-pulse" />
                  SYSTEM_AUDIT_TRAIL
                </div>
                <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                  Neural Logs
                </h1>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
                  Authentication: DECRYPTED // Access_Level: ROOT // Subsystem: COGNITIVE_STREAM
                </p>
              </div>
            </motion.div>

            {/* Logs List */}
            <div className="space-y-8">
              {logs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="absolute -left-[33px] top-6 w-4 h-[2px] bg-cyan-500/20 group-hover:bg-cyan-500 transition-colors" />
                  
                  <div className="bg-[#050508] border border-white/5 hover:border-cyan-500/30 transition-all p-8 space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Corner ID */}
                    <div className="absolute top-0 right-0 p-3 font-mono text-[9px] text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors">
                      {log.id}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className={`text-[8px] font-mono px-2 py-0.5 border ${log.metadata.status === 'STABLE' ? 'border-green-500/40 text-green-500/60' : 'border-cyan-500/40 text-cyan-500/60'} uppercase`}>
                            {log.sector}
                          </span>
                          {log.externalLink && (
                             <span className="text-[8px] font-mono px-2 py-0.5 border border-blue-500/40 text-blue-400 uppercase flex items-center gap-1">
                               LINKEDIN_SIGNAL
                             </span>
                          )}
                          <span className="text-[10px] font-mono text-white/20">{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                          {log.title}
                        </h3>
                      </div>

                      <div className="flex gap-4">
                        {log.metadata.latency && (
                          <div className="text-right">
                            <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Latency</div>
                            <div className="text-[10px] font-mono text-cyan-500">{log.metadata.latency}</div>
                          </div>
                        )}
                        {log.metadata.recall && (
                          <div className="text-right">
                            <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Recall</div>
                            <div className="text-[10px] font-mono text-cyan-500">{log.metadata.recall}</div>
                          </div>
                        )}
                        {log.metadata.reactions && (
                          <div className="text-right">
                            <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Impact</div>
                            <div className="text-[10px] font-mono text-cyan-500">{log.metadata.reactions} REAC</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                       <p className="text-white/60 text-sm font-sans leading-relaxed transition-colors group-hover:text-white/90">
                         {log.content}
                       </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-cyan-500/5 transition-all">
                             <Terminal size={12} className="text-white/20 group-hover:text-cyan-400" />
                          </div>
                          <div className="text-[10px] font-mono text-white/20 group-hover:text-cyan-500/60 uppercase tracking-widest transition-colors">
                            Trace_Status: {log.metadata.status}
                          </div>
                       </div>
                       
                       <button 
                         onClick={() => log.externalLink && window.open(log.externalLink, '_blank')}
                         className={`flex items-center gap-2 text-[10px] font-mono transition-all uppercase tracking-widest ${log.externalLink ? 'text-cyan-400 hover:text-white' : 'text-white/20 hover:text-cyan-400 cursor-default'}`}
                       >
                         {log.externalLink ? '[ ACCESS_SOURCE ]' : '[ TRACE_LOG ]'} <ChevronRight size={10} />
                       </button>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute bottom-0 right-0 p-1 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                       <Cpu size={120} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Pagination/Status */}
            <div className="pt-20 border-t border-white/5 flex flex-col items-center space-y-6">
              <div className="flex items-center gap-4">
                 {[1, 2, 3].map(n => (
                   <div key={n} className={`w-8 h-8 border ${n === 1 ? 'border-cyan-500 text-cyan-400' : 'border-white/10 text-white/20'} flex items-center justify-center font-mono text-xs cursor-pointer hover:border-cyan-500/50 transition-colors`}>
                     0{n}
                   </div>
                 ))}
                 <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/20">...</div>
              </div>
              <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.4em]">End_of_Transmission // v4.1 Audit_System</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
