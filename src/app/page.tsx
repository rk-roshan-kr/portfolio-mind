'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, KeyboardEvent, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { LatentSpace } from '@/components/scene/LatentSpace';
import { Github, Linkedin, Mail, ChevronRight, Briefcase, Award, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ChatTerminal } from '@/components/chat/ChatTerminal';
import { ContactModal } from '@/components/ui/ContactModal';
import { MobileSystemNotice } from '@/components/ui/MobileSystemNotice';

export default function PortfolioHome() {
  const [inputValue, setInputValue] = useState('');

  const activeNodeId = useStore((state) => state.activeNodeId);
  const nodes = useStore((state) => state.nodes);
  const viewMode = useStore((state) => state.viewMode);
  const isInspectorOpen = useStore((state) => state.isInspectorOpen);
  const toggleInspector = useStore((state) => state.toggleInspector);
  const toggleContactModal = useStore((state) => state.toggleContactModal);

  const searchFocusTrigger = useStore((state) => state.searchFocusTrigger);
  const [emailCopied, setEmailCopied] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
      if (!isLarge && useStore.getState().viewMode === 'neural') {
        useStore.getState().setViewMode('classic');
      }
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const activeNode = activeNodeId ? nodes.find(n => n.id === activeNodeId) : null;

  useEffect(() => {
    if (searchFocusTrigger > 0) {
      if (viewMode !== 'neural') {
        useStore.getState().setViewMode('neural');
      }
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [searchFocusTrigger]);

  useEffect(() => {
    const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        useStore.getState().setActiveNode(null);
      }
    };
    window.addEventListener('keydown', handleGlobalKey, true);

    // Initial Satellite Check for Digital Twin v2.5
    useStore.getState().checkSatelliteStatus();

    return () => window.removeEventListener('keydown', handleGlobalKey, true);
  }, []);

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#020205] text-white flex flex-col font-sans touch-none relative">
      <MobileSystemNotice />

      {/* HUD System Status Bar */}
      <Navbar />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-row overflow-hidden w-full relative z-10">

        {/* LEFT/MAIN PANEL */}
        <div className={`${(viewMode === 'neural' && isLargeScreen) ? 'w-full md:w-[70%]' : 'w-full'} relative h-full flex flex-col bg-[#020205] transition-all duration-500`}>
          {viewMode === 'neural' && isLargeScreen ? (
            <>
              {/* High-Tech HUD Breadcrumb */}
              <div className="absolute top-4 left-6 z-10 pointer-events-auto">
                <div className="text-[10px] font-mono tracking-[0.3em] text-cyan-500/50 uppercase flex items-center gap-2">
                  <span className="w-2 h-px bg-cyan-500/30"></span>
                  LATENT_SPACE &gt; <span className="text-cyan-400 font-bold">{activeNode ? activeNode.title : 'SYS_OVERVIEW'}</span>
                </div>
              </div>

              <div className="flex-1 w-full h-full cursor-crosshair active:cursor-move">
                <Canvas 
                  dpr={[1, 2]} 
                  camera={{ position: [0, 0, 25], fov: 45 }} 
                  onPointerMissed={() => useStore.getState().setActiveNode(null)}
                >
                  <Suspense fallback={null}>
                    <LatentSpace />
                  </Suspense>
                </Canvas>
              </div>
            </>
          ) : (
            <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[#020205] relative neural-grid">
              {/* Scanline Effect */}
              <div className="scanline" />

              <div className="py-12 md:py-24 px-4 md:px-20 lg:px-40 relative z-10">
                <div className="max-w-5xl mx-auto space-y-16 md:space-y-32">

                  {/* 00_NEURAL_HEADER */}
                  <div className="relative border-l-8 border-cyan-500 pl-10 py-6 bg-cyan-950/5 backdrop-blur-sm">
                    {/* Top Corner Bracket */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30" />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-tighter">Verified_Identity</span>
                          <span className="text-cyan-500/50 font-mono text-[10px] uppercase tracking-widest">ID: 0xRK_GUPTA_25B</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
                          Roshan Gupta
                        </h1>
                        <p className="text-sm md:text-2xl font-mono text-cyan-500 uppercase tracking-[0.4em] font-bold">Systems Architect // HPC_Research</p>
                      </div>

                      <div className="flex flex-col gap-3 text-right">
                        <div 
                          className="flex items-center md:justify-end gap-3 text-xs font-mono text-white/40 uppercase tracking-widest group cursor-pointer relative" 
                          onClick={() => {
                            navigator.clipboard.writeText('roshankumargupta.sh@gmail.com');
                            setEmailCopied(true);
                            setTimeout(() => setEmailCopied(false), 2000);
                            window.location.href = 'mailto:roshankumargupta.sh@gmail.com';
                          }}
                        >
                          <span className="group-hover:text-cyan-400 font-bold transition-colors">
                            {emailCopied ? '[ SIGNAL_COPIED ]' : 'roshankumargupta.sh@gmail.com'}
                          </span> 
                          <Mail size={14} className="text-cyan-500/50 group-hover:text-cyan-400"/>
                          
                          {/* Tooltip purely for "Click to Copy" hint if not copied */}
                          {!emailCopied && (
                            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <div className="bg-cyan-500 text-black px-2 py-1 text-[8px] font-black uppercase tracking-tighter italic">
                                Click_to_Replicate
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center md:justify-end gap-3 text-xs font-mono text-white/40 uppercase tracking-widest group cursor-pointer" onClick={() => window.open('https://github.com/rk-roshan-kr')}>
                          <span className="group-hover:text-cyan-400">github.com/rk-roshan-kr</span> <Github size={14} className="text-cyan-500/50 group-hover:text-cyan-400" />
                        </div>
                        <div className="flex items-center md:justify-end gap-3 text-xs font-mono text-white/40 uppercase tracking-widest group cursor-pointer" onClick={() => window.open('https://linkedin.com/in/roshankumargupta-0xc0de')}>
                          <span className="group-hover:text-cyan-400">linkedin.com/0xc0de</span> <Linkedin size={14} className="text-cyan-500/50 group-hover:text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 01_EXECUTIVE_VECTOR */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start"
                  >
                    <div className="md:col-span-3 space-y-2">
                      <h2 className="text-xs font-mono text-cyan-500 uppercase tracking-[0.5em] font-black flex items-center gap-2">
                        <span className="w-4 h-px bg-cyan-500"></span> 01_SUMMARY
                      </h2>
                      <div className="text-[10px] font-mono text-cyan-500/30 uppercase tracking-widest pl-6">Core_Architecture</div>
                    </div>
                    <div className="md:col-span-9 relative">
                      <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-sans font-light italic border-r-2 border-white/5 pr-4 md:pr-12">
                        "Architecting deterministic, hardware-sympathetic software for
                        next-generation AI infrastructure. Operating at the silicon-to-shader boundary
                        to maximize hardware utilization through memory-aligned execution
                        and parallel kernel optimization."
                      </p>
                      {/* Decoration */}
                      <div className="absolute bottom-0 right-0 w-24 h-px bg-gradient-to-r from-transparent to-cyan-500/50" />
                    </div>
                  </motion.div>

                  {/* 02_EXPERIENCE_VECTOR */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    <div className="md:col-span-3 space-y-2">
                      <h2 className="text-xs font-mono text-cyan-500 uppercase tracking-[0.5em] font-black flex items-center gap-2">
                        <span className="w-4 h-px bg-cyan-500"></span> 02_EXPERIENCE
                      </h2>
                      <div className="text-[10px] font-mono text-cyan-500/30 uppercase tracking-widest pl-6">Career_Milestones</div>
                    </div>
                    <div className="md:col-span-9 space-y-12">
                      {[
                        {
                          year: 'JUL 2026-PRESENT',
                          role: 'Author & Lead Architect',
                          company: 'Earthos Platform (earthos.shop)',
                          desc: "Authored 'The AGI Question: What Does It Take to Become a Mind?', bridging cognitive philosophy, neuroscience, and architecture. Engineered the production storefront, interactive reader workspace, and automated nearest-node multi-warehouse logistics.",
                          icon: <Zap size={18} className="text-cyan-400" />
                        },
                        {
                          year: '2026',
                          role: 'Best Student Paper & Session Chair',
                          company: 'IEEE CCNCPS 2026 (Dubai, UAE)',
                          desc: 'Awarded Best Student Paper for FieldChain (GPU-centric storage integrity at 166.86 GiB/s via Vulkan). Invited as designated Session Chair.',
                          icon: <Award size={18} className="text-yellow-400" />
                        },
                        {
                          year: '2026',
                          role: '1st Place Champion (Smart Vehicles)',
                          company: 'Tekathon 2026 / SIH Internal (ISRO PS: SIH26168)',
                          desc: 'Ranked 1st place in Chandigarh University internal selection for Smart India Hackathon solving ISRO problem statement SIH26168 with high-reliability edge telemetry.',
                          icon: <Award size={18} className="text-green-400" />
                        },
                        {
                          year: '2025-PRESENT',
                          role: 'Independent Research Engineer',
                          company: 'Emergent Ventures Grantee',
                          desc: 'Awarded $5,500 for independent research in physics-constrained AI (Project TARS). Focused on discovering exoplanets via TESS data using custom XGBoost/ECHO pipelines.',
                          icon: <Award size={18} className="text-cyan-400" />
                        },
                        {
                          year: 'DEC 2025-JAN 2026',
                          role: 'L3 IT Intern',
                          company: 'SMG Electric Scooters Ltd',
                          desc: 'Designed and developed an internal CRM portal to automate logistics and vendor development workflows.',
                          icon: <Briefcase size={18} className="text-blue-400" />
                        },
                        {
                          year: 'OCT 2025 - SEP 2026',
                          role: 'Former Dept Student Representative',
                          company: 'Chandigarh University',
                          desc: 'Represented a department of 1200+ students. Facilitated academic/research coordination and recipient of University Research Excellence Award.',
                          icon: <Users size={18} className="text-purple-400" />
                        }
                      ].map((exp, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="group relative pl-8 md:pl-12 pb-12 border-l border-white/5 last:pb-0"
                        >
                          <div className="absolute top-0 left-0 -translate-x-1/2 w-10 h-10 rounded-full border border-white/10 bg-[#020205] flex items-center justify-center group-hover:border-white/20 transition-all group-hover:bg-white/5">
                            {exp.icon}
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                              <div>
                                <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic">{exp.role}</h3>
                                <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">{exp.company}</div>
                              </div>
                              <div className="text-[10px] font-mono text-white/30 tracking-[0.2em]">{exp.year}</div>
                            </div>
                            <p className="text-sm text-white/50 font-sans leading-relaxed max-w-2xl">
                              {exp.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 03_STACK */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12"
                  >
                    <div className="md:col-span-3 space-y-2">
                      <h2 className="text-xs font-mono text-cyan-500 uppercase tracking-[0.5em] font-black flex items-center gap-2">
                        <span className="w-4 h-px bg-cyan-500"></span> 03_STACK
                      </h2>
                      <div className="text-[10px] font-mono text-cyan-500/30 uppercase tracking-widest pl-6">Weapon_System</div>
                    </div>
                    <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                        { cat: 'Systems', skills: ['C/C++', 'CUDA', 'Vulkan', 'HPC / SIMD'] },
                        { cat: 'ML_Core', skills: ['PyTorch', 'PINNs', 'TESS_Dataload', 'Tensor_Ops'] },
                        { cat: 'AI_Infra', skills: ['RAG_Pipe', 'Vector_DB', 'SFF_Hardware', 'Local_LLM'] },
                        { cat: 'Web_GL', skills: ['React/Next', 'Three.js', 'Tailwind', 'Zustand'] }
                      ].map(group => (
                        <div key={group.cat} className="space-y-4 p-4 border border-white/5 bg-white/[0.01] hover:bg-cyan-500/[0.03] transition-colors group">
                          <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black flex justify-between">
                            {group.cat} <span className="text-[8px] opacity-20 group-hover:opacity-100 italic">LOADED</span>
                          </h3>
                          <div className="space-y-2">
                            {group.skills.map(s => (
                              <div key={s} className="text-xs font-mono text-white/50 flex items-center gap-2 group-hover:text-white transition-colors">
                                <span className="w-1 h-1 bg-cyan-500/30 group-hover:bg-cyan-500 transition-colors"></span> {s}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* 04_ARTIFACTS */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12"
                  >
                    <div className="md:col-span-3 space-y-2">
                      <h2 className="text-xs font-mono text-cyan-500 uppercase tracking-[0.5em] font-black flex items-center gap-2">
                        <span className="w-4 h-px bg-cyan-500"></span> 04_ARTIFACTS
                      </h2>
                      <div className="text-[10px] font-mono text-cyan-500/30 uppercase tracking-widest pl-6">Project_Dossier</div>
                    </div>
                    <div className="md:col-span-9 space-y-24">
                      {[
                        {
                          title: "FieldChain GPU Storage",
                          id: "proj_fieldchain",
                          tags: ["IEEE_Best_Paper", "Systems", "CUDA", "Vulkan"],
                          metrics: ["AWARD: BEST_STUDENT_PAPER", "VENUE: IEEE_CCNCPS_DUBAI", "PEAK: 166.86 GiB/s"],
                          desc: "GPU-accelerated storage integrity layer sustaining 7GB/s sequential writes via PCIe 4.0, outperforming specialized DPUs by 4.2x. Awarded Best Student Paper & Session Chair at IEEE CCNCPS 2026 (Dubai, UAE)."
                        },
                        {
                          title: "Project Earthos & Monograph",
                          id: "proj_earthos",
                          tags: ["Monograph", "Cognition", "Next.js 16", "Supabase"],
                          metrics: ["WORK: AUTHORED_VOLUME", "LIVE: EARTHOS.SHOP"],
                          desc: "Authored 'The AGI Question: What Does It Take to Become a Mind?', bridging cognitive philosophy, neuroscience, and computational intelligence. Engineered the production storefront, interactive reader workspace, and Synapse Arch substrate."
                        },
                        {
                          title: "Tekathon 2026 / Smart Vehicles",
                          id: "proj_tekathon",
                          tags: ["SIH_Internal", "ISRO", "Smart_Vehicles", "Edge_Vision"],
                          metrics: ["RANK: 1ST_PLACE", "PS: SIH26168"],
                          desc: "Ranked 1st place in Smart India Hackathon internal round for ISRO problem statement SIH26168. Developed high-reliability edge vision and deterministic telemetry processing for smart vehicle navigation."
                        },
                        {
                          title: "Hacktoberfest 2026",
                          id: "proj_hacktoberfest",
                          tags: ["Open_Source", "Global", "Systems_Engineering"],
                          metrics: ["RANK: 4TH_GLOBAL", "SPRINT: 2026"],
                          desc: "Ranked 4th place globally for high-impact software contributions across open-source systems repositories and deterministic runtimes."
                        },
                        {
                          title: "Project TARS Ecosystem",
                          id: "proj_tars",
                          tags: ["Emergent_Ventures", "ML", "Physics", "NASA"],
                          metrics: ["GRANT: $5,500", "PRECISION: 70.1%"],
                          desc: "Physics-constrained ML pipeline for sparse NASA TESS exoplanet candidate vetting. Backed by a $5,500 Emergent Ventures grant. Engineered tars_infra parallel FITS ingestion engine processing 150,000+ files."
                        },
                        {
                          title: "ModelVM Semantic Virtualization",
                          id: "proj_modelvm",
                          tags: ["LLM", "Virtualization", "Memory_Architecture"],
                          metrics: ["STATUS: PREPRINT", "PRIMITIVE: CSP_STATE"],
                          desc: "Virtualizing semantic state and model residency for resource-constrained language model systems via user-space memory virtualization and typed Cognitive State Packets (CSP)."
                        },
                        {
                          title: "Cryptic DAO Dashboard",
                          id: "proj_cryptic",
                          tags: ["Web3", "UI", "DeFi"],
                          metrics: ["RANK: CHAMPION", "EVENT: ZeroToOne"],
                          desc: "Spatial DeFi manager utilizing dimensional depth for Treasury oversight. Won national hackathon for UI excellence in governance visualization."
                        },
                        {
                          title: "HSA* Routing Engine",
                          id: "proj_hsastar",
                          tags: ["Algorithms", "Pathfinding", "IP"],
                          metrics: ["COMPUTE: 97µs", "STATUS: IP_PENDING"],
                          desc: "Real-time pathfinding engine utilizing inverse square law heuristics. Designed for safety-aware navigation in high-density data environments."
                        },
                        {
                          title: "QUANTA / Entropic Noise Boundary",
                          id: "proj_quanta",
                          tags: ["Quantum", "NISQ", "Surface_Codes"],
                          metrics: ["PHASE: WORKING_PAPER", "SIM: STIM_PYMATCHING"],
                          desc: "Derives purity-distinguishability bounds and Rényi-2 information witnesses for noisy NISQ channels; simulates logical correctability in the 'Undead Zone'."
                        }
                      ].map((p, idx) => (
                        <div key={p.id} className="relative group pl-8 md:pl-12 border-l border-white/10 hover:border-cyan-500/50 transition-colors py-4">
                          <div className="absolute -left-4 top-4 text-[30px] md:text-[40px] font-black opacity-5 text-white group-hover:opacity-10 transition-opacity">0{idx + 1}</div>
                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                            <div className="space-y-1">
                              <div className="flex flex-wrap gap-2">
                                {p.tags.map(tag => (
                                  <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 border border-cyan-500/20 text-cyan-500/60 uppercase">{tag}</span>
                                ))}
                              </div>
                              <h3 className="text-4xl font-black text-white uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                              {p.metrics.map(m => (
                                <div key={m} className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 px-2 py-0.5 border border-cyan-500/20">{m}</div>
                              ))}
                            </div>
                          </div>
                          <p className="max-w-3xl text-lg text-white/50 leading-relaxed font-sans group-hover:text-white/80 transition-colors">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* 05_CERT */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12"
                  >
                    <div className="md:col-span-3 space-y-2">
                      <h2 className="text-xs font-mono text-cyan-500 uppercase tracking-[0.5em] font-black flex items-center gap-2">
                        <span className="w-4 h-px bg-cyan-500"></span> 05_CERT
                      </h2>
                      <div className="text-[10px] font-mono text-cyan-500/30 uppercase tracking-widest pl-6">Formal_Nodes</div>
                    </div>
                    <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 border-t border-cyan-500/50 bg-cyan-950/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-cyan-500/20 italic">0x_IEEE</div>
                        <h4 className="text-xl font-bold text-white uppercase mb-2">IEEE CCNCPS 2026 Dubai</h4>
                        <div className="font-mono text-[10px] text-yellow-400 mb-4 tracking-widest">[ BEST_STUDENT_PAPER & SESSION_CHAIR ]</div>
                        <p className="text-sm text-white/60 leading-relaxed">FieldChain GPU-accelerated storage wire-speed integrity primitive published with Best Student Paper award.</p>
                      </div>
                      <div className="p-8 border-t border-cyan-500/50 bg-cyan-950/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-cyan-500/20 italic">0x_VENTURE</div>
                        <h4 className="text-xl font-bold text-white uppercase mb-2">Emergent Ventures</h4>
                        <div className="font-mono text-[10px] text-cyan-400 mb-4 tracking-widest">[ FUNDING_CAPITAL: $5.5K ]</div>
                        <p className="text-sm text-white/60 leading-relaxed">Awarded $5,500 research grant support for physics-constrained exoplanet candidate vetting on NASA TESS data.</p>
                      </div>
                      <div className="p-8 border-t border-cyan-500/50 bg-cyan-950/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-cyan-500/20 italic">0x_ISRO_SIH</div>
                        <h4 className="text-xl font-bold text-white uppercase mb-2">Tekathon 2026 (SIH Internal)</h4>
                        <div className="font-mono text-[10px] text-green-400 mb-4 tracking-widest">[ 1ST_PLACE: SMART_VEHICLES ]</div>
                        <p className="text-sm text-white/60 leading-relaxed">Winner in Smart Vehicles category for ISRO problem statement SIH26168. 4th Place globally in Hacktoberfest 2026.</p>
                      </div>
                      <div className="p-8 border-t border-cyan-500/50 bg-cyan-950/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-cyan-500/20 italic">0x_ACADEMY</div>
                        <h4 className="text-xl font-bold text-white uppercase mb-2">Chandigarh University</h4>
                        <div className="font-mono text-[10px] text-cyan-500 mb-4 tracking-widest">[ RESEARCH_EXCELLENCE_AWARD ]</div>
                        <p className="text-sm text-white/60 leading-relaxed">UID: 25BCS10109. Department Student Representative (Tenure: Oct 2025 – Sep 2026, 400+ students). Awarded University Research Excellence Award.</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* 05_FOOTER: BIO_HARDWARE_SIGNATURE */}
                  <div className="pt-32 pb-4 opacity-50 flex flex-col md:flex-row justify-between items-end border-t border-white/5">
                    <div className="space-y-4">
                      <div className="text-[64px] font-black tracking-tighter text-white/10 uppercase italic select-none">RK_GUPTA</div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1 font-mono text-[8px] uppercase tracking-[0.4em] leading-relaxed opacity-40">
                        <span>ORIGIN: CHANDIGARH</span>
                        <span>LATENCY: 12ms</span>
                        <span>SYSTEM: C13_NEURAL</span>
                        <span>VECTOR: [0.94, 0.12, 0.88]</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="w-12 h-12 border-2 border-cyan-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-cyan-500 animate-pulse" />
                      </div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-500">System_Integrity_Verified</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Neural View Side Panels */}
        {viewMode === 'neural' && isLargeScreen && (
          <>
            <div className="hidden lg:flex w-[30%] min-w-[320px] h-full border-l border-cyan-500/20 bg-black/40 backdrop-blur-none transition-transform duration-500 ease-in-out z-40 flex-col">
              {/* ZONE A: The Inspector (Top Half - 55%) */}
              <div className="flex-[5.5] relative overflow-hidden flex flex-col p-4 custom-scrollbar text-white">
                {activeNode ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full space-y-4">
                    <div className="space-y-3 pb-3 border-b border-cyan-500/20">
                      <div className="font-mono text-sm text-cyan-400 tracking-widest bg-cyan-950/30 px-3 py-2 border border-cyan-500/30 w-full uppercase">
                        [ ID: {activeNode.id.toUpperCase()} ]
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight text-white uppercase leading-none">
                        {activeNode.title}
                      </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <p className="text-sm text-white/80 leading-relaxed font-sans mb-6">
                        {activeNode.description}
                      </p>
                    </div>

                    {activeNode.type === 'project' && (
                      <div className="pt-4 mt-auto">
                        <a
                          href={activeNode.links?.[0]?.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-[10px] text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
                        >
                          <span>RES_SRC_ACCESS</span>
                          <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </a>

                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="font-mono text-sm text-cyan-400 tracking-widest bg-cyan-950/30 px-3 py-2 border border-cyan-500/30 w-full mb-2 uppercase text-center">
                      [ ID: SYS_CORE ] // STATUS: ACTIVE
                    </div>
                    <div className="text-center space-y-4 py-8">
                      <h2 className="text-xl font-bold uppercase tracking-wider text-white">Neural Overview</h2>
                      <p className="text-xs text-white/60 leading-relaxed max-w-[240px] mx-auto">
                        Select a node in the latent space to inspect specific project metrics,
                        technological vector links, and engineering philosophies.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ZONE B: The AI Terminal / Chat (Bottom Half - 45%) */}
              <div className="flex-[4.5] flex flex-col overflow-hidden relative border-t border-white/5">
                <ChatTerminal />
              </div>
            </div>
          </>
        )}
        <ContactModal />
      </div>
    </main>
  );
}
