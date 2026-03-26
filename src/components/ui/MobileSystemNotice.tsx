'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ZapOff } from 'lucide-react';

export const MobileSystemNotice = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:hidden w-full bg-cyan-950/20 border-b border-cyan-500/30 px-4 py-2 flex items-center justify-between gap-4 backdrop-blur-md relative overflow-hidden"
    >
      {/* Scanline Effect */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-cyan-500/50 animate-pulse" />
      
      <div className="flex items-center gap-3">
        <div className="p-1 bg-cyan-500/10 rounded border border-cyan-500/20">
          <ZapOff size={14} className="text-cyan-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-tighter">
            [ NOTIFICATION: NEURAL_ENGINE_OFFLINE ]
          </span>
          <span className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-widest">
            CAUSE: MOBILE_HARDWARE_LIMITS_DETECTED
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter italic">Standard_Net v4.1</span>
        <AlertCircle size={12} className="text-white/20" />
      </div>
    </motion.div>
  );
};
