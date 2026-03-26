'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Github, FileText, ChevronLeft, ExternalLink, Quote } from 'lucide-react';
import Link from 'next/link';

const papers = [
  {
    id: 'fieldchain',
    title: 'FieldChain: A Wire-Speed Primitive for Energy-Efficient Storage Integrity',
    authors: 'Roshan Kumar Gupta, Garima Thakur',
    venue: 'USENIX HotStorage \'26 (Submission)',
    abstract: 'FieldChain achieves a sustained system throughput of 41.28 GiB/s on an NVIDIA RTX 4050, saturating PCIe Gen4 x8 links. By leveraging a custom Vulkan backend, we demonstrate a peak kernel compute capacity of 166.86 GiB/s, proving that cryptographic overhead is effectively zero.',
    links: [
      { label: 'View Report', url: 'https://github.com/rk-roshan-kr/FieldChain' },
      { label: 'GitHub', url: 'https://github.com/rk-roshan-kr/FieldChain', icon: <Github size={14} /> }
    ],
    tags: ['GPU_ACCELERATION', 'CRYPTOGRAPHY', 'SYSTEMS_STORAGE']
  },
  {
    id: 'tars',
    title: 'TARS Core: A Physics-Constrained Machine Learning Pipeline for High-Precision Exoplanet Detection',
    authors: 'Roshan Kumar Gupta, Garima Thakur',
    venue: 'Research Paper RP2026',
    abstract: 'We introduce TARS Core, a physics-constrained pipeline prioritizing precision. Using a linear filter cascade with Event Evidence Aggregator (EEA) and ECHO modules, it enforces orbital coherence and shape constraints, achieving 78.6% precision in the TESS two-transit regime.',
    links: [
      { label: 'Full Paper', url: 'https://github.com/rk-roshan-kr/Tars' },
      { label: 'Grant Material', url: 'https://github.com/rk-roshan-kr/Tars' }
    ],
    tags: ['ASTROPHYSICS', 'PHYSICS_ML', 'NASA_TESS']
  },
  {
    id: 'quanta',
    title: 'QUANTA: Signal-to-Noise Limit of Qubits in Quantum Computing',
    authors: 'Roshan Kumar Gupta',
    venue: 'Theoretical Thesis (Draft)',
    abstract: 'A research initiative defining an experimental law for the signal-to-noise limit of qubits. This work explores the architectural divergence required to stabilize quantum signals in high-interference environments.',
    links: [
      { label: 'Thesis Draft', url: '#' }
    ],
    tags: ['QUANTUM_COMPUTING', 'ERROR_CORRECTION', 'SIGNAL_PROCESSING']
  }
];

export default function PapersPage() {
  return (
    <main className="min-h-screen w-screen bg-[#020205] text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] animate-pulse" />
      </div>

      <div className="flex-1 relative z-10 py-24 px-6 md:px-20 lg:px-40">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-16"
          >
            <Link href="/" className="p-2 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all rounded-lg group">
              <ChevronLeft size={20} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
            </Link>
            <div>
              <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.5em] mb-1">Research_Archive</div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic italic">Publications</h1>
            </div>
          </motion.div>

          {/* Papers Grid */}
          <div className="space-y-12">
            {papers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="group relative border-l-2 border-white/10 pl-8 pb-12 last:pb-0"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full border border-white/20 bg-[#020205] group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{paper.venue}</div>
                      <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors uppercase italic">{paper.title}</h2>
                    </div>
                    
                    <p className="text-sm text-white/50 leading-relaxed font-sans max-w-3xl">
                      {paper.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {paper.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 border border-white/5 bg-white/[0.02] text-[9px] font-mono text-white/40 uppercase tracking-tighter">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      {paper.links.map(link => (
                        <a 
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 text-[10px] uppercase font-bold tracking-widest transition-all group/link"
                        >
                          {link.icon || <FileText size={12} />}
                          <span>{link.label}</span>
                          <ExternalLink size={10} className="text-white/20 group-hover/link:text-cyan-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-64 shrink-0 flex flex-col justify-between py-2 border-l border-white/5 pl-8 md:pl-12">
                    <div className="space-y-4">
                      <div>
                        <div className="text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest mb-2">Authors</div>
                        <div className="text-xs text-white/70 font-sans italic">{paper.authors}</div>
                      </div>

                      <div className="pt-4 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Quote size={24} className="text-cyan-500" />
                        <div className="text-[9px] font-mono text-white/40 mt-2">
                          Available for Peer Review
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Decoration */}
          <div className="mt-32 pt-12 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
            <div>© 2026 ROSHAN_KUMAR_GUPTA</div>
            <div>STAY_HARD // PUSH_BOUNDARIES</div>
          </div>
        </div>
      </div>
    </main>
  );
}
