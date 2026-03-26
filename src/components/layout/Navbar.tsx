'use client';

import React from 'react';
import { Github, Linkedin, Mail, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter, usePathname } from 'next/navigation';

export const Navbar = () => {
  const viewMode = useStore((state) => state.viewMode);
  const setViewMode = useStore((state) => state.setViewMode);
  const triggerSearchFocus = useStore((state) => state.triggerSearchFocus);
  const isInspectorOpen = useStore((state) => state.isInspectorOpen);
  const toggleInspector = useStore((state) => state.toggleInspector);
  const isSatelliteOnline = useStore((state) => state.isSatelliteOnline);
  const isForging = useStore((state) => state.isForging);
  const isContactModalOpen = useStore((state) => state.isContactModalOpen);
  const [copied, setCopied] = React.useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  const handleModeChange = (mode: 'classic' | 'neural') => {
    if (pathname !== '/') {
      router.push('/');
    }
    setViewMode(mode);
  };

  return (
    <header className="h-14 w-full border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0 bg-black/80 backdrop-blur-md relative z-20 font-mono">

      {/* 1. THE SEARCH TRIGGER (Left) */}
      <div className="flex-1 flex items-center">
        <button
          onClick={triggerSearchFocus}
          className="group flex items-center gap-1 text-[10px] tracking-widest text-white/40 hover:text-cyan-400 transition-colors duration-300"
        >
          <span className="font-bold">&gt;</span>
          <span className="pulse-underscore animate-pulse-underscore inline-block w-1.5 bg-cyan-400 h-[2px] mt-1 group-hover:bg-cyan-400"></span>
          <span className="ml-1 uppercase hidden sm:inline">SEARCH_LATENT_SPACE</span>
          <span className="ml-1 uppercase sm:hidden">SEARCH</span>
        </button>

        {/* Global Forge Status (Desktop Only) */}
        {isForging && (
          <div className="hidden lg:flex ml-4 items-center gap-2 px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded-sm animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
            <span className="text-[9px] text-orange-400 font-black tracking-widest uppercase">FORGE_ACTIVE</span>
          </div>
        )}

        {/* Mobile Toggle / Status (Mobile Only) */}
        {!isForging && (
           <div className="lg:hidden ml-2 flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/5 border border-cyan-500/20 rounded-sm">
             <div className="w-1 h-1 rounded-full bg-cyan-400"></div>
             <span className="text-[8px] text-cyan-400 font-bold tracking-widest uppercase">STND_NET</span>
           </div>
        )}
      </div>

      {/* 2. THE MODE TOGGLE (Center - Desktop Only) */}
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="flex items-center h-8 border border-white/10 p-0.5 bg-black/40">
          <button 
            onClick={() => handleModeChange('neural')}
            className={`h-full px-4 flex items-center transition-all duration-300 text-[10px] tracking-widest uppercase ${viewMode === 'neural' && pathname === '/'
                ? 'text-cyan-400 border border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                : 'text-white/40 hover:text-cyan-300'
              }`}
          >
            [ NEURAL_MATRIX ]
          </button>
          <button 
            onClick={() => handleModeChange('classic')}
            className={`h-full px-4 flex items-center transition-all duration-300 text-[10px] tracking-widest uppercase ${viewMode === 'classic' && pathname === '/'
                ? 'text-cyan-400 border border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                : 'text-white/40 hover:text-cyan-300'
              }`}
          >
            [ STANDARD_NET ]
          </button>
        </div>
      </div>

      {/* 3. THE ASSET MATRIX (Right) */}
      <div className="flex-1 flex items-center justify-end gap-3 md:gap-6 text-[10px]">
        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4 text-white/40 tracking-tighter">
          <a href="https://github.com/rk-roshan-kr" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors tracking-widest">
            <span className="hidden sm:inline">[ REPO ]</span>
            <span className="sm:hidden text-[9px]">REPO</span>
          </a>
          <a href="/papers" className={`transition-colors tracking-widest ${pathname === '/papers' ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400'}`}>
            <span className="hidden sm:inline">[ PAPER ]</span>
            <span className="sm:hidden text-[9px]">PAPER</span>
          </a>
          <a href="/logs" className={`transition-colors tracking-widest ${pathname === '/logs' ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400'}`}>
            <span className="hidden sm:inline">[ LOG ]</span>
            <span className="sm:hidden text-[9px]">LOG</span>
          </a>
        </div>

        {/* Social cluster (Desktop Only) */}
        <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-3 md:pl-6 h-4">
          <a href="https://linkedin.com/in/roshankumargupta-0xc0de" target="_blank" rel="noreferrer" className="opacity-30 hover:opacity-100 hover:text-cyan-400 transition-all">
            <Linkedin size={14} />
          </a>
          <div className="relative group/mail">
            <button 
              onClick={() => {
                navigator.clipboard.writeText('roshankumargupta.sh@gmail.com');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                window.location.href = 'mailto:roshankumargupta.sh@gmail.com';
              }}
              className="opacity-30 hover:opacity-100 hover:text-cyan-400 transition-all cursor-pointer p-1"
            >
              <Mail size={14} />
            </button>
          </div>
        </div>

        {/* Primary Action (Small & Functional) */}
        <a
          href="/resume.pdf"
          download
          className="px-2 sm:px-4 py-1.5 border border-cyan-500/30 bg-transparent text-cyan-400 tracking-widest uppercase transition-all duration-300 hover:bg-cyan-500 hover:text-black"
        >
          <span className="hidden sm:inline">[ EXPORT_PDF ]</span>
          <span className="sm:hidden text-[9px]">PDF</span>
        </a>
      </div>
    </header>
  );
};
