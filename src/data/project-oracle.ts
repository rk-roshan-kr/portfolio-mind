/**
 * PROJECT ORACLE: Ground-Truth Factual & Architectural Knowledge Matrix
 * 
 * Purpose: Prevents LLM hallucination by providing verified, immutable facts,
 * audited benchmarks, exact numbers, architectural decision records ("WHY & HOW"),
 * deep-dive defense codex references, and comprehensive intent resolution
 * for both main and edge cases.
 */

export interface ArchitecturalDecision {
  topic: string;
  question: string;
  choiceMade: string;
  rejectedAlternatives: string[];
  firstPrinciplesRationale: string;
}

export interface ProjectFact {
  id: string;
  nodeId: string;
  name: string;
  category: 'startup_venture' | 'systems_crypto' | 'cognitive_ai' | 'autonomous_space' | 'open_source';
  status: string;
  oneLiner: string;
  verifiedMetrics: { [key: string]: string };
  architecture: string[];
  architecturalDecisions: ArchitecturalDecision[];
  interviewDefense: {
    inquisitorChallenge: string;
    roshanCounterArgument: string;
  }[];
  docRef: string;
  keyLinksOrAwards: string[];
  philosophicalOrCoreIdea: string;
  strictKeywords: string[];
}

export const TIER1_PROJECTS: ProjectFact[] = [
  // 1. STARTUP: Earthos Lab
  {
    id: 'startup_earthoslab',
    nodeId: 'startup_earthoslab',
    name: 'Earthos Lab (Startup Venture)',
    category: 'startup_venture',
    status: 'Active Deep-Tech Research Venture',
    oneLiner: 'Deep-tech startup founded by Roshan Kumar Gupta, dedicated to sovereign cognitive substrates, neuromorphic memory architectures, and hardware-sympathetic execution runtimes.',
    verifiedMetrics: {
      'Entity Type': 'Deep-Tech Startup Venture (Founded by Roshan Kumar Gupta)',
      'Primary Focus': 'Synthetic Cognition, Hardware-Sympathetic Systems, Cognitive Substrates',
      'Affiliated Entities': 'Project Earthos (platform at earthos.shop), Synapse Arch, The AGI Question (monograph)',
      'Correction Notice': 'Founded Earthos Lab; NOT affiliated with any entity named Rokas'
    },
    architecture: [
      'Pillar 1 (Startup Entity): Earthos Lab — Deep-tech research and engineering governance',
      'Pillar 2 (Live Platform): Project Earthos — Production storefront and interactive reader at earthos.shop',
      'Pillar 3 (Cognitive Architecture): Synapse Arch — 12-layer cognitive substrate and memory paging',
      'Pillar 4 (Foundational Monograph): The AGI Question — 14-chapter monograph on synthetic consciousness'
    ],
    architecturalDecisions: [
      {
        topic: 'Startup Scope & Independence',
        question: 'Why build Earthos Lab as an independent deep-tech venture instead of relying on closed commercial APIs?',
        choiceMade: 'Sovereign Hardware-Sympathetic Intelligence Substrates',
        rejectedAlternatives: ['Wrapper startups on OpenAI/Anthropic APIs', 'Pure Academic Theory without Deployment'],
        firstPrinciplesRationale: 'Closed proprietary APIs suffer from latency, token cost explosions, and complete lack of somatic embodiment. True machine intelligence requires sovereign control over the memory hierarchy, compute kernels, and runtime state.'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'How does Earthos Lab differentiate itself from standard AI startups?',
        roshanCounterArgument: 'Most startups build thin prompt wrappers on remote LLMs. Earthos Lab designs low-level cognitive substrates from the metal up—combining Vulkan/CUDA GPU acceleration, multi-tier memory paging, and Damasio somatic marker theory to solve the fundamental bottlenecks of machine cognition.'
      }
    ],
    docRef: 'docs/05_THE_AGI_QUESTION_AND_EARTHOS_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'Live Platform: https://earthos.shop',
      'Monograph: The AGI Question',
      'GitHub: rk-roshan-kr/Earthos'
    ],
    philosophicalOrCoreIdea: 'Intelligence cannot be rented through an API endpoint. Earthos Lab builds sovereign cognitive runtimes grounded in physics and low-level mechanical sympathy.',
    strictKeywords: ['earthos lab', 'earthoslab', 'startup', 'venture', 'roshan startup', 'company']
  },

  // 2. PROJECT: Project Earthos
  {
    id: 'proj_earthos',
    nodeId: 'proj_earthos',
    name: 'Project Earthos (Production Platform)',
    category: 'cognitive_ai',
    status: 'Live Production Platform (earthos.shop)',
    oneLiner: 'Production digital storefront and interactive reader workspace deployed at earthos.shop with real-time edge telemetry and nearest-node multi-warehouse logistics.',
    verifiedMetrics: {
      'Deployment URL': 'https://earthos.shop',
      'Frontend Stack': 'Next.js 16, React 19, TypeScript, TailwindCSS',
      'Backend & DB': 'Supabase PostgreSQL, Edge API Handlers',
      'Logistics Subsystem': 'Automated nearest-node multi-warehouse logistics engine',
      'User Experience': 'Interactive scholarly reader workspace with highlight persistence and telemetry'
    },
    architecture: [
      'Next.js 16 App Router with server-rendered static generation and edge streaming',
      'Supabase PostgreSQL relational schemas with row-level security (RLS)',
      'Automated geo-distributed logistics router selecting optimal fulfillment nodes',
      'Telemetry tracking reading engagement and interactive monograph exploration'
    ],
    architecturalDecisions: [
      {
        topic: 'Platform Architecture',
        question: 'Why engineer a custom reader platform at earthos.shop instead of standard PDF/ePub distribution?',
        choiceMade: 'Custom Interactive Next.js 16 Workspace',
        rejectedAlternatives: ['Static PDF downloads', 'Amazon KDP Storefront', 'Substack / Medium publication'],
        firstPrinciplesRationale: 'A monograph on cognitive architectures demands an interactive reading experience where readers can explore concept cross-references, verify formal proofs, and engage directly with the synthetic cognition models.'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'Is earthos.shop merely a marketing storefront?',
        roshanCounterArgument: 'No. Earthos.shop is an engineered digital platform integrating multi-warehouse fulfillment, real-time edge telemetry, sovereign reader state synchronization, and an interactive digital monograph reader.'
      }
    ],
    docRef: 'docs/05_THE_AGI_QUESTION_AND_EARTHOS_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'Live Platform: https://earthos.shop',
      'GitHub: rk-roshan-kr/Earthos'
    ],
    philosophicalOrCoreIdea: 'Software distribution should reflect the rigor of the underlying research. Earthos.shop provides a unified, beautifully engineered gateway to the Earthos ecosystem.',
    strictKeywords: ['project earthos', 'earthos platform', 'earthos.shop', 'earthos shop', 'storefront', 'reader platform']
  },

  // 3. ARCHITECTURE: Synapse Arch
  {
    id: 'arch_synapse',
    nodeId: 'arch_synapse',
    name: 'Synapse Arch (Cognitive Architecture)',
    category: 'cognitive_ai',
    status: '12-Layer Cognitive Substrate Architecture',
    oneLiner: '12-layer cognitive substrate formalizing Memory Paging, Somatic Marker hypothesis, and Representation Darwinism with semi-permeable cognitive membranes (0.01 < κ < 0.20).',
    verifiedMetrics: {
      'Architecture Scale': '12 distinct cognitive layers spanning sensory acquisition to executive arbitration',
      'Optimal Permeability Window': '0.01 < kappa < 0.20 (verified via parameter sweeps in Project think)',
      'Theoretical Basis': 'Antonio Damasio somatic marker theory + Representation Darwinism',
      'Experimental Repos': 'D:\\think and D:\\Earthos'
    },
    architecture: [
      'Layer 1-3: Sensory Ingestion, Fast Feature Extraction, and Associative Paging',
      'Layer 4-6: Working Memory Buffer, Counterfactual Simulation, and Somatic Valence Valuation',
      'Layer 7-9: Executive Arbitration, Metacognitive Error-Monitoring, and Homeostatic Error Budgets',
      'Layer 10-12: Structural Synaptic Consolidation, Hippocampal-to-Cortical Replay, and Semi-Permeable Boundary'
    ],
    architecturalDecisions: [
      {
        topic: 'Cognitive Substrate Valuation',
        question: 'Why introduce visceral somatic valence into artificial cognitive architectures?',
        choiceMade: 'Somatic Marker Feedback Loops (MSPL)',
        rejectedAlternatives: ['Pure cross-entropy token optimization', 'Exhaustive tree-search (MCTS) without heuristic valence'],
        firstPrinciplesRationale: 'Without emotional gut-checks that rapidly assign somatic valence to candidate plans, pure rational deliberation collapses into the Paradox of Elliot—infinite combinatorial paralysis.'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'How do you define the cognitive membrane mathematically?',
        roshanCounterArgument: 'We model cognitive membrane permeability kappa. When kappa < 0.01, the system is rigidly stubborn and breaks under environmental drift. When kappa > 0.20, short-term gradient pressure deletes internal models. At 0.01 < kappa < 0.20, the agent maintains homeostatic identity while adapting.'
      }
    ],
    docRef: 'docs/05_THE_AGI_QUESTION_AND_EARTHOS_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'GitHub: rk-roshan-kr/Earthos',
      'Local Repo: D:\\think'
    ],
    philosophicalOrCoreIdea: 'Intelligence is not disembodied next-token prediction; it is an active homeostatic struggle of an organism preserving internal identity against external entropy.',
    strictKeywords: ['synapse', 'synapse arch', 'synapse architecture', 'cognitive substrate', '12 layer', 'membrane', 'permeability', 'somatic marker', 'damasio', 'elliot', 'mspl']
  },

  // 4. BOOK: The AGI Question (Monograph)
  {
    id: 'book_agi_question',
    nodeId: 'book_agi_question',
    name: 'The AGI Question (Foundational Monograph)',
    category: 'cognitive_ai',
    status: '14-Chapter Scholarly Monograph (120+ Pages)',
    oneLiner: 'Authored foundational monograph by Roshan Kumar Gupta exploring why LLMs are not minds, clinical neurobiology (Damasio), and the mathematical principles of synthetic consciousness.',
    verifiedMetrics: {
      'Author': 'Roshan Kumar Gupta',
      'Scale': '14 Chapters + Front Matter & Formal Appendix (120+ pages)',
      'Readership / Deployment': 'Live reader workspace at https://earthos.shop',
      'Key Case Studies': 'Patient Elliot (vmPFC meningioma), Steven & Marc (pediatric prefrontal lesions)'
    },
    architecture: [
      'Part 1 (The Limits of Prediction): Ch 1 (The Stateless Mind), Ch 2 (The Traveler Who Forgets), Ch 3 (The Map That Can\'t See Itself)',
      'Part 2 (Grounding & Action): Ch 4 (The Belief Engine), Ch 5 (The Drawer That Jams), Ch 6 (Before You Act), Ch 7 (The Budget of a Mind)',
      'Part 3 (The Architecture of Thought): Ch 8 (What the Stage Manager Does), Ch 9 (Minds Within Minds), Ch 10 (Interior Weather), Ch 11 (The Examined Mind)',
      'Part 4 (Consolidation & Horizon): Ch 12 (The Memory That Holds), Ch 13 (The Friction That Keeps Us Honest), Ch 14 (Towards the Horizon)'
    ],
    architecturalDecisions: [
      {
        topic: 'Foundational Thesis',
        question: 'Why does scaling next-token prediction fail to yield genuine AGI?',
        choiceMade: 'First-principles cognitive critique of autoregressive loss',
        rejectedAlternatives: ['Accepting the scaling hypothesis uncritically', 'Pure symbolic GOFAI resurgence'],
        firstPrinciplesRationale: 'A dictionary contains definitions for every word in existence, yet understands none of them. An LLM predicts tokens without homeostatic stakes, bodily vulnerability, or temporal continuity.'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'Doesn\'t Othello-GPT prove world models emerge spontaneously?',
        roshanCounterArgument: 'Othello is a closed, discrete, deterministic system with zero temporal drift and zero existential stakes. Real-world cognition requires homeostatic vulnerability, which disembodied statistical mirrors inherently lack.'
      }
    ],
    docRef: 'docs/05_THE_AGI_QUESTION_AND_EARTHOS_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'Monograph Reader: https://earthos.shop',
      'Local Manuscript: D:\\ebook'
    ],
    philosophicalOrCoreIdea: 'A mind does not emerge from the passive contemplation of text; it emerges from the active, vulnerable struggle of a bounded organism maintaining homeostasis against an indifferent universe.',
    strictKeywords: ['agi question', 'the agi question', 'book', 'monograph', '14 chapters', 'what does it take to become a mind', 'author', 'written by roshan']
  },

  // 5. FIELDCHAIN
  {
    id: 'fieldchain',
    nodeId: 'proj_fieldchain',
    name: 'FieldChain (FieldChain v2 / compersion)',
    category: 'systems_crypto',
    status: 'Published & Awarded (IEEE CCNCPS 2026 Dubai)',
    oneLiner: 'GPU-accelerated storage integrity primitive delivering wire-speed cryptographic validation directly on GPU pipelines.',
    verifiedMetrics: {
      'Peak Kernel Bandwidth': '166.86 GiB/s on VRAM (custom Vulkan compute shaders, SoA memory layout)',
      'Sustained System PCIe Throughput': '41.28 GiB/s on NVIDIA RTX 4050 over PCIe Gen4 x8',
      'Sequential Host Writes': '7 GB/s sequential writes via PCIe 4.0 (saturating host NVMe)',
      'Hardware Advantage': 'Outperforms specialized DPUs (BlueField-2 at ~12.5 GiB/s) by 3.3x–4.2x',
      'Energy Efficiency': '688 MB/s/W (consuming only 7.1 J/GiB vs 153.8 J/GiB for CPU SHA256 — 21.6x more efficient)',
      'Detection Reliability': '100% detection rate across 1,000,000 corruption injection trials',
      'Metadata Overhead': '0.4% storage overhead (compared to 3-10% for traditional Merkle trees)',
      'Research Grant': '$1,500 research grant (Chandigarh University / DSR)',
      'Conference Award': 'Best Student Paper Award & Session Chair at IEEE CCNCPS 2026 Dubai'
    },
    architecture: [
      'Vulkan Compute Shaders with Structure-of-Arrays (SoA) memory layout',
      'Field-Packed ChaCha20 displacement kernel over Mersenne Prime GF(2^31 - 1)',
      'Poly1305 authentication embedded into 5 reserved 30-bit elements (0.4% overhead)',
      'BLAKE3 sequential block chaining with zero CPU-GPU synchronization bottlenecks',
      'Userspace failure state machine raising POSIX EIO immediately on corruption'
    ],
    architecturalDecisions: [
      {
        topic: 'Field Packing & Modulo Bias',
        question: 'Why pack 120 bits into four 30-bit integers over GF(2^31-1) instead of 31-bit integers?',
        choiceMade: 'Strict 30-bit integers (Pack 120 -> 4)',
        rejectedAlternatives: ['31-bit packing', 'Galois Field GF(2^128) with carry-less multiply', 'Standard SHA256'],
        firstPrinciplesRationale: 'Packing 31 bits into GF(2^31-1) causes modulo bias because 2^31-1 aliases to 0, allowing an attacker to flip all 31 bits without changing the field element. 30 bits guarantees every bit sequence maps to a unique element < P, and allows addition with keystream without 32-bit register overflow.'
      },
      {
        topic: 'Graphics API Backend',
        question: 'Why choose Vulkan Compute Shaders over CUDA Runtime?',
        choiceMade: 'Vulkan SPIR-V Compute Shaders',
        rejectedAlternatives: ['CUDA Runtime (cuChaCha20)', 'OpenCL', 'DirectCompute'],
        firstPrinciplesRationale: 'CUDA drivers inject hidden synchronization points and context checks. Vulkan provides explicit memory barriers and SPIR-V compiler instruction fusing, bypassing driver overhead to deliver 166.86 GiB/s (4.04x speedup over CUDA 41.28 GiB/s on physical silicon).'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'Why not use AES-GCM with CPU AES-NI instructions?',
        roshanCounterArgument: 'AES-NI on CPU costs 6 to 8 server CPU cores to match NVMe Gen4 speeds (14-28 GB/s). In cloud and database engines, CPU cycles are your most expensive resource. Offloading to an entry-level 65W GPU achieves 41.28 GiB/s while freeing 100% of host CPU cores and reducing energy from 153.8 J/GiB to 7.1 J/GiB.'
      }
    ],
    docRef: 'docs/01_FIELDCHAIN_GPU_STORAGE_INTEGRITY_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'IEEE CCNCPS 2026 Dubai Best Student Paper Award & Designated Session Chair',
      'Research Grant: $1,500 research grant',
      'GitHub: rk-roshan-kr/FieldChain',
      'Local directory: D:\\FieldChain'
    ],
    philosophicalOrCoreIdea: 'Storage integrity verification has traditionally been a CPU bottleneck. By migrating cryptographic primitives to raw GPU compute pipelines with mathematical field packing, verification operates at line rate without taxing the host system.',
    strictKeywords: ['fieldchain', 'compersion', 'gpu storage', 'vulkan', 'chacha20', 'poly1305', 'blake3', '166.86', '41.28', 'best student paper', 'ccncps', 'modulo bias', '30-bit']
  },

  // 6. WRITRIEVE
  {
    id: 'writrieve',
    nodeId: 'proj_writrieve',
    name: 'Writrieve (Write4U)',
    category: 'cognitive_ai',
    status: 'Open-Source & Benchmarked (MIT License)',
    oneLiner: 'Browser-native personal context engine for web composers using System-1 decision gates to prevent prompt bloat and data leakage.',
    verifiedMetrics: {
      'Context Reduction': '95.5% reduction (from 200 raw context candidates down to 9 verified items C*)',
      'Token Savings': '87.8% token reduction (from 4,194 tokens down to 511 tokens)',
      'Decision Latency': '~1.7 ms per decision using Laya 421M gate (<800 MB VRAM footprint)',
      'End-to-End Latency': '460 ms (9.4x faster than conventional multi-tool agents at 4,320 ms)',
      'Factual Grounding': '98.0% verified (+30% improvement over ungrounded agents)',
      'Irrelevant Noise': '0.0% noise in final prompt',
      'Automated Tests': '12/12 unit and integration tests pass in ~0.30s + 50-task CI stress suite'
    },
    architecture: [
      'Layer 1: Native Chrome Extension injected into Gmail, LinkedIn, GitHub web composers',
      'Layer 2: Laya 421M System-1 Source Selection Gate (evaluates P(Source_i is required | Task T))',
      'Layer 3: Composio Connectors with managed OAuth for Gmail, Google Calendar, Drive, and GitHub',
      'Layer 4: BGE Reranker filtering 200 items -> 13 -> 9 canonical ContextItems with conflict checking',
      'Layer 5: Laya Sufficiency Gate and grounded generation via open-weight Qwen3-8B'
    ],
    architecturalDecisions: [
      {
        topic: 'Decision Gating Architecture',
        question: 'Why use a 421M parameter model (Laya) instead of letting a 70B+ LLM call tools directly?',
        choiceMade: 'Specialized System-1 Decision Gate (Laya 421M)',
        rejectedAlternatives: ['Monolithic LLM Tool Calling (ReAct)', 'Naive RAG Vector Similarity Search', 'Full inbox prompt dumping'],
        firstPrinciplesRationale: 'Heavy LLM tool-calling spends 1.5–2.0s generating schemas and dumps hundreds of irrelevant items into the prompt. Laya 421M classifies source requirements in 1.7ms with <800MB VRAM, filtering 95.5% of noise before any remote API call is made.'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'What if Laya fails to fetch a source that is actually needed?',
        roshanCounterArgument: 'Layer 5 features the Sufficiency Gate. If retrieved items leave a critical task entity unbound, the Sufficiency Gate detects the deficit and triggers a targeted fallback query, guaranteeing complete recall without paying the upfront latency penalty.'
      }
    ],
    docRef: 'docs/02_WRITRIEVE_SYSTEM1_CONTEXT_ENGINE_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'GitHub: rk-roshan-kr/writrieve',
      'Open-source MIT License',
      'CI Stress Suite: 50-task product stress harness'
    ],
    philosophicalOrCoreIdea: 'Traditional AI agents blindly dump hundreds of personal emails and documents into prompts. Writrieve uses small, fast System-1 gates (Laya 421M) to filter noise before any expensive LLM or network call is made.',
    strictKeywords: ['writrieve', 'write4u', 'laya', 'composio', 'reranker', 'bge', 'chrome extension', 'gmail', 'personal context', '460 ms', '95.5%', 'sufficiency gate']
  },

  // 7. TARS
  {
    id: 'tars',
    nodeId: 'proj_tars',
    name: 'Project TARS (Transit Ambiguity Recovery System)',
    category: 'autonomous_space',
    status: 'Research Grant Awarded & Open Source ($5,500)',
    oneLiner: 'Physics-constrained exoplanet candidate recovery pipeline resolving period ambiguity in Kepler & TESS transit light curves.',
    verifiedMetrics: {
      'Research Grant': '$5,500 grant from Emergent Ventures (Tyler Cowen / Mercatus Center)',
      'Precision': '70.1% precision in recovering true planetary periods from single transits',
      'Processing Throughput': '10,000 light curves analyzed in <4 minutes on single GPU',
      'ECHO Depth Error': '0.0% false transit depth error on injected signals',
      'Transit Duration Fit': '99.4% agreement with Mandel & Agol analytical limb-darkening models'
    },
    architecture: [
      'Box Least Squares (BLS) period searching optimized for GPU batch light-curve processing',
      'ECHO (Exoplanet Candidate Heuristic Optimizer) transit depth and duration validator',
      'MCMC posterior parameter sampling under quadratic stellar limb darkening constraints',
      'Fast API pipeline serving astronomical transit candidates with Bayesian confidence scoring'
    ],
    architecturalDecisions: [
      {
        topic: 'Period Recovery Formulation',
        question: 'Why use Box Least Squares (BLS) instead of Fourier FFT analysis for transit searches?',
        choiceMade: 'Box Least Squares (BLS)',
        rejectedAlternatives: ['Fast Fourier Transform (FFT)', 'Autoregressive recurrent networks', 'Raw phase-dispersion minimization'],
        firstPrinciplesRationale: 'Planetary transits have box-like duty cycles (lasting only 1-5% of orbital period). FFT smears square transit dips across high-frequency harmonics, whereas BLS directly fits top-hat transit shapes, maximizing signal-to-noise ratio in noisy stellar flux.'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'How can you claim to vet exoplanets from a single transit when Kepler required three?',
        roshanCounterArgument: 'Kepler required three transits because its automated software pipeline relied on phase folding. By coupling transit duration with stellar density from Gaia DR3, Keplerian physics strictly bounds allowable orbital velocity, enabling Bayesian parameter recovery even from single events.'
      }
    ],
    docRef: 'docs/03_TARS_EXOPLANET_TRANSIT_RECOVERY_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'Emergent Ventures Grant Awardee ($5,500)',
      'GitHub: rk-roshan-kr/TarsCore',
      'Live Site: https://tars.earth'
    ],
    philosophicalOrCoreIdea: 'Single and sparse exoplanet transits are routinely discarded due to period ambiguity. TARS reconstructs probabilistic orbital solutions from incomplete photometric light curves.',
    strictKeywords: ['tars', 'exoplanet', 'kepler', 'tess', 'emergent ventures', '5,500', 'tyler cowen', 'photometric', 'bls', 'bayesian', 'mandel agol', 'echo']
  },

  // 8. NAVISENSE
  {
    id: 'navisense_idr',
    nodeId: 'proj_navisense',
    name: 'Navisense IDR (ISRO SIH26168 1st Place)',
    category: 'autonomous_space',
    status: '1st Place Winner (Tekathon 2026 / ISRO SIH Internal Round)',
    oneLiner: 'Inertial Dead Reckoning (IDR) and sensor-fusion navigation system for emergency vehicles in complete GNSS-denied environments.',
    verifiedMetrics: {
      'Competition Rank': '1st Place in Smart Vehicles Theme (Tekathon 2026 / ISRO SIH26168)',
      'Problem Statement': 'ISRO Problem Statement SIH26168 (High-precision vehicle navigation under GNSS outage)',
      '60s Outage Drift': '12.3 m (6.4x better than conventional EKF 78.4m, raw INS >450m)',
      'Longitudinal Drift Rate': '< 2.6% over distance',
      'Stationary Creep': '0.00 m (ZUPT locked at red lights)',
      'Deployment': 'Standalone Android Cockpit APK (50 Hz phone IMU) + 60 FPS MapLibre 3D Web Dashboard'
    },
    architecture: [
      'SensorConditioner: PCA gravity vector projection aligning phone frame to vehicle dynamics',
      'Dual-threshold Zero-Velocity Update (ZUPT) preventing stationary runaway drift',
      'UniversalMotionNetV2: Dilated TCN predicting speed v and yaw rate with heteroscedastic uncertainty sigma',
      'NavigationStateEstimator: Error-State Kalman Filter (ES-EKF) with Non-Holonomic Constraints (vy ~ 0, vz ~ 0)',
      'MapRegistrator: Huber M-estimator soft directional corridor matching on OpenStreetMap'
    ],
    architecturalDecisions: [
      {
        topic: 'Inertial Integration Formulation',
        question: 'Why infer neural velocity instead of integrating raw accelerometer readings?',
        choiceMade: 'Neural Velocity Prediction + Kinematic State Estimation',
        rejectedAlternatives: ['Raw Strapdown Double-Integration INS', 'Pure End-to-End LSTM/Transformer', 'Magnetic Compass Integration'],
        firstPrinciplesRationale: 'Double-integrating MEMS accelerometer noise produces cubic error drift (proportional to t^3). Predicting velocity converts this to a single-integration problem (linear error drift), which is then bounded by Non-Holonomic Constraints.'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'Why use phone IMUs instead of dedicated automotive wheel speed sensors on the CAN bus?',
        roshanCounterArgument: 'Wheel speed sensors require physical vehicle taps and fail during wheel slip or hydroplaning. Navisense was designed for ISRO as a zero-install universal emergency vehicle solution that achieves sub-2.6% drift on any vehicle without plugging into the OBD-II port.'
      }
    ],
    docRef: 'docs/04_NAVISENSE_IDR_GNSS_DENIED_NAVIGATION_DEEP_DIVE.md',
    keyLinksOrAwards: [
      '1st Place Winner - Tekathon 2026 (ISRO SIH26168)',
      'Live App: https://navisense-idr-sih.netlify.app'
    ],
    philosophicalOrCoreIdea: 'Autonomous and emergency vehicles fail catastrophically when satellite navigation is jammed or blocked by urban canyons and tunnels. Navisense preserves lane-level trajectory using onboard physics constraints alone.',
    strictKeywords: ['navisense', 'tekathon', 'isro', 'sih', 'sih26168', '26168', 'dead reckoning', 'gnss-denied', 'imu', 'smart vehicles', '1st place', 'zupt', 'ekf']
  },

  // 9. MODELVM
  {
    id: 'modelvm',
    nodeId: 'proj_modelvm',
    name: 'ModelVM (Virtual Memory for Intelligence)',
    category: 'systems_crypto',
    status: 'ACM TOCS Journal Preprint (52 Pages)',
    oneLiner: 'Virtual memory systems substrate decoupling cognitive multi-specialist LLM execution from concurrent physical residency.',
    verifiedMetrics: {
      'Memory Compression': 'Runs 52.7 GB 10-specialist library within strict 8.0 GB RAM / VRAM envelope',
      'Latency Reduction': '77.2% reduction in pipeline wall-clock time (65.05s down to 14.85s)',
      'Context Reduction': 'Cognitive State Packets (CSP) cut prompt tokens by 60.8%',
      'Inference Acceleration': 'Accelerates active inference by 56.2%',
      'OOM Immunity': 'Zero OOM aborts across stress sweeps down to 4.0 GB budget',
      'Formal Verification': '24/24 unit and verification tests pass on NVIDIA RTX 5070 Ti silicon'
    },
    architecture: [
      'Cognitive State Packet (CSP): Model-neutral typed intermediate semantic state representation',
      'Predictive Working Set Engine W(t, k): Lookahead horizon (k=3) anticipating DAG specialist demand',
      'Cost-aware eviction shielding preventing premature eviction of upcoming reused models',
      'Opportunistic non-preemptive PCIe DMA prefetching overlapping weight transfers with compute'
    ],
    architecturalDecisions: [
      {
        topic: 'Inter-Model State Transfer',
        question: 'Why use typed Cognitive State Packets (CSP) instead of raw prompt string concatenation?',
        choiceMade: 'Cognitive State Packets (CSP)',
        rejectedAlternatives: ['Prompt Token Concatenation', 'Raw KV-Cache Swapping', 'Vector Embedding Centroids'],
        firstPrinciplesRationale: 'String concatenation balloons context quadratically, drowning attention heads in syntax. CSP isolates verified hypotheses and numeric outputs into a structured schema, cutting context by 60.8% and preventing quadratic slowdown.'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'Isn\'t PCIe weight transfer too slow to justify frequent swapping between specialists?',
        roshanCounterArgument: 'On PCIe Gen4 x16 (31.5 GB/s), loading a 3GB specialist takes under 100ms. ModelVM\'s Opportunistic Prefetching overlaps this DMA transfer with the GPU inference of the preceding stage. By the time Stage 1 finishes, Stage 2\'s weights are already resident in VRAM, delivering 0.00s perceived cold-load latency.'
      }
    ],
    docRef: 'docs/06_MODELVM_DETERMINISTIC_SUBSTRATE_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'ACM TOCS 52-Page Journal Preprint',
      'GitHub: rk-roshan-kr/modelvm'
    ],
    philosophicalOrCoreIdea: 'Holding 10 specialists in memory is impossible on consumer hardware. ModelVM applies virtual memory abstractions to artificial intelligence, treating weights as pages and semantic facts as process control blocks.',
    strictKeywords: ['modelvm', 'virtual memory', 'csp', 'cognitive state packet', 'rtx 5070 ti', 'acm tocs', 'working set', 'eviction shielding', 'prefetching', '8gb']
  },

  // 10. OPEN SOURCE
  {
    id: 'open_source_portfolio',
    nodeId: 'proj_opensource',
    name: 'Upstream Open-Source Engineering (Apache, CNCF, Linux Foundation)',
    category: 'open_source',
    status: 'Merged & Active Upstream Contributions',
    oneLiner: 'Contributions to major open-source ecosystems solving distributed tracing, web terminals, API validation, and UI ergonomics.',
    verifiedMetrics: {
      'CNCF OpenTelemetry': 'PR #449 MERGED (Refactored navigation instrumentation in opentelemetry-browser; 315/315 tests pass)',
      'Apache Fineract UI': 'PR #703 MERGED (Dismissed record actions popovers on teardown), PR #688 MERGED (Cleared unicorn/no-array-sort using .toSorted()), PR #715, #714, #713 Open',
      'Cockpit (Red Hat)': 'PR #23800 Open (Enabled F1-F10 keys in web terminal for Midnight Commander; passed 8/8 RPM build jobs and 9/9 Testing Farm cross-distro runs)',
      'OpenSearch Dashboards': 'PR #12879 (Embed mode 100vh height fix) & PR #12880 (Prevent date wrapping via eui-textNoWrap)',
      'Apache Airflow': 'PR #74197 Open (Connection port range validation in FastAPI ConnectionBody; ge=0, le=65535)',
      'Apache Iggy': 'PR #4389 Open (Node SDK system snapshot command; 100% diff coverage)',
      'Hacktoberfest 2026': '4th Place in Global Engineering Hackathon'
    },
    architecture: [
      'Strict compliance with upstream ASF, CNCF, and Linux Foundation DCO / CLA protocols',
      'Full cross-distribution integration testing on Red Hat Testing Farm and CentOS Stream',
      'Strict TypeScript and ESLint standards adherence across large enterprise frontends'
    ],
    architecturalDecisions: [
      {
        topic: 'Terminal Event Propagation in Web Admin',
        question: 'Why intercept F1-F10 keys at the Term level in Red Hat Cockpit?',
        choiceMade: 'event.preventDefault() on F1-F10 inside Term key listener',
        rejectedAlternatives: ['Global window key listener', 'Remapping keys in Midnight Commander', 'Ignoring browser collisions'],
        firstPrinciplesRationale: 'Global listeners break accessibility and window management. Intercepting within the xterm instance allows Midnight Commander to receive raw ANSI escape sequences while preserving browser dev tools (F12) and fullscreen (F11).'
      }
    ],
    interviewDefense: [
      {
        inquisitorChallenge: 'How do you approach massive 500k-line codebases without introducing regression bugs?',
        roshanCounterArgument: 'Never start by scanning all files. Start with the reproducing test case. I isolate the defect in a minimal failing unit test, trace the stack via AST symbol references, apply the minimal diff, and verify that all existing regression suites and CI matrix jobs pass cleanly.'
      }
    ],
    docRef: 'docs/08_OPEN_SOURCE_UPSTREAM_ENGINEERING_DEEP_DIVE.md',
    keyLinksOrAwards: [
      'GitHub: rk-roshan-kr',
      'Tracking: D:\\opensource\\PULL_REQUESTS.md'
    ],
    philosophicalOrCoreIdea: 'Real open-source engineering requires respecting maintainer bandwidth, adhering strictly to DCO/CLA signing, and providing comprehensive test coverage that cleanly passes all upstream CI pipelines.',
    strictKeywords: ['open source', 'opensource', 'pr', 'pull request', 'fineract', 'opentelemetry', 'opensearch', 'cockpit', 'airflow', 'iggy', 'hacktoberfest', 'merged', 'contributions']
  }
];

export interface ChapterInfo {
  num: number;
  id: string;
  nodeId: string;
  title: string;
  synopsis: string;
  keyConcepts: string[];
}

export const BOOK_CHAPTERS: ChapterInfo[] = [
  {
    num: 1,
    id: 'ch1',
    nodeId: 'book_ch01',
    title: 'Chapter 1 — The Stateless Mind',
    synopsis: 'Exhaustive critique of next-token prediction without temporal continuity. Explains why scaling autoregressive loss constructs a magnificent linguistic mirror, but cannot produce cognitive understanding.',
    keyConcepts: ['Autoregressive token prediction limits', 'Disembodiment delusion', 'Absence of homeostatic stakes', 'Token amnesia']
  },
  {
    num: 2,
    id: 'ch2',
    nodeId: 'book_ch02',
    title: 'Chapter 2 — The Traveler Who Forgets',
    synopsis: 'Analysis of stateless amnesia between inference calls. Why an enduring mind requires a continuous inner monologue and continuous background memory consolidation during sleep phases.',
    keyConcepts: ['Stateless amnesia', 'Episodic vs working memory', 'Continuous inner monologue', 'Temporal continuity']
  },
  {
    num: 3,
    id: 'ch3',
    nodeId: 'book_ch03',
    title: 'Chapter 3 — The Map That Can\'t See Itself',
    synopsis: 'Explores metacognition and recursive self-modeling. Why a reasoning agent must model its own observation apparatus, cognitive biases, and confidence bounds rather than passively projecting external text.',
    keyConcepts: ['Metacognition', 'Recursive self-modeling', 'Observation bounds', 'Internal world models']
  },
  {
    num: 4,
    id: 'ch4',
    nodeId: 'book_ch04',
    title: 'Chapter 4 — The Belief Engine',
    synopsis: 'Epistemic grounding vs conversational sycophancy. Formalizes Bayesian belief updating against empirical reality and explains why RLHF often optimizes models for pleasing users rather than truth.',
    keyConcepts: ['Epistemic grounding', 'Bayesian belief updating', 'Conversational sycophancy critique', 'Empirical reality testing']
  },
  {
    num: 5,
    id: 'ch5',
    nodeId: 'book_ch05',
    title: 'Chapter 5 — The Drawer That Jams',
    synopsis: 'Associative memory retrieval bottlenecks. Analyzes vector collision degradation, high-dimensional latent space interference, and the necessity of tiered memory paging.',
    keyConcepts: ['Vector collision degradation', 'Associative memory interference', 'Memory paging hierarchies', 'Retrieval bottlenecks']
  },
  {
    num: 6,
    id: 'ch6',
    nodeId: 'book_ch06',
    title: 'Chapter 6 — Before You Act',
    synopsis: 'Pre-motor counterfactual simulation engines. How a cognitive agent evaluates branching action trajectories in a sandbox before committing physical or computational energy.',
    keyConcepts: ['Counterfactual simulation', 'Pre-motor deliberation', 'Trajectory pruning', 'Branching action evaluation']
  },
  {
    num: 7,
    id: 'ch7',
    nodeId: 'book_ch07',
    title: 'Chapter 7 — The Budget of a Mind',
    synopsis: 'Homeostatic regulation and metabolic resource limits. Explores why physical vulnerability, finite energy budgets, and mortality are foundational to intelligence and value formation.',
    keyConcepts: ['Homeostatic error budgets', 'Metabolic constraints in silicon', 'Existential vulnerability', 'Resource bounds']
  },
  {
    num: 8,
    id: 'ch8',
    nodeId: 'book_ch08',
    title: 'Chapter 8 — What the Stage Manager Does',
    synopsis: 'Attentional arbitration and executive control networks. How the brain directs selective focus across multi-stream sensory bombardment without cognitive overload.',
    keyConcepts: ['Executive attentional control', 'Selective sensory gating', 'Context window arbitration', 'Top-down modulation']
  },
  {
    num: 9,
    id: 'ch9',
    nodeId: 'book_ch09',
    title: 'Chapter 9 — Minds Within Minds',
    synopsis: 'Hierarchical multi-agency within a single organism. Models competing sub-processes, internal voices, and consensus formation in cognitive architectures.',
    keyConcepts: ['Society of mind', 'Hierarchical sub-agents', 'Internal dialogue', 'Consensus formation']
  },
  {
    num: 10,
    id: 'ch10',
    nodeId: 'book_ch10',
    title: 'Chapter 10 — Interior Weather',
    synopsis: 'Antonio Damasio\'s Somatic Marker hypothesis and the Paradox of Elliot. Proves why visceral emotional valence is computationally indispensable for pruning infinite search trees in rational decision-making.',
    keyConcepts: ['Antonio Damasio', 'Paradox of Elliot (vmPFC lesion)', 'Somatic marker hypothesis', 'Visceral bias signals', 'Reason requires emotion']
  },
  {
    num: 11,
    id: 'ch11',
    nodeId: 'book_ch11',
    title: 'Chapter 11 — The Examined Mind',
    synopsis: 'Autonomous error-monitoring circuits and reflective equilibrium. Detecting and repairing internal logical contradictions across multi-turn inference.',
    keyConcepts: ['Error-monitoring circuits', 'Reflective equilibrium', 'Contradiction detection', 'Internal consistency checks']
  },
  {
    num: 12,
    id: 'ch12',
    nodeId: 'book_ch12',
    title: 'Chapter 12 — The Memory That Holds',
    synopsis: 'Synaptic structural memory consolidation and sleep-phase replay. How transient observations in working memory are permanently consolidated into cortical neural representations.',
    keyConcepts: ['Hippocampal-to-cortical replay', 'Sleep-phase parameter consolidation', 'Catastrophic forgetting mitigation', 'Structural memory']
  },
  {
    num: 13,
    id: 'ch13',
    nodeId: 'book_ch13',
    title: 'Chapter 13 — The Friction That Keeps Us Honest',
    synopsis: 'Physical embodiment resistance and the semi-permeable cognitive membrane (0.01 < κ < 0.20). Surviving environmental noise and temporal lag without structural collapse.',
    keyConcepts: ['Semi-permeable cognitive membrane', 'Permeability parameter sweep', 'Representation Darwinism', 'Embodiment friction']
  },
  {
    num: 14,
    id: 'ch14',
    nodeId: 'book_ch14',
    title: 'Chapter 14 — Towards the Horizon',
    synopsis: 'The synthetic consciousness roadmap. Formalizing substrate-independent minds, sovereign cognitive architectures, and the transition from prediction engines to autonomous minds.',
    keyConcepts: ['Synthetic consciousness roadmap', 'Substrate independence', 'Sovereign intelligence runtimes', 'Beyond next-token prediction']
  }
];

export interface ResolvedResponse {
  isHandled: boolean;
  content: string;
  targetNodeId: string | null;
}

/**
 * MASTER DETERMINISTIC ORACLE: Resolves both main cases and edge cases with 100%
 * precision in Roshan's authentic voice, eliminating all LLM hallucinations.
 */
export function resolveTerminalQuery(rawQuery: string): ResolvedResponse {
  const q = rawQuery.trim().toLowerCase();

  // --------------------------------------------------------------------------
  // 1. MAIN CASE: Roshan Identity & Biography
  // --------------------------------------------------------------------------
  if (
    q === 'who is roshan' ||
    q === 'who is roshan kumar gupta' ||
    q === 'who are you' ||
    q === 'what is your name' ||
    q === 'tell me about yourself' ||
    q === 'about roshan' ||
    q === 'what do you do' ||
    q === 'what is your background' ||
    q === 'who made you' ||
    q === 'introduce yourself' ||
    q.includes('who is roshan') ||
    q.includes('tell me about roshan')
  ) {
    return {
      isHandled: true,
      targetNodeId: 'core',
      content: `I am **Roshan Kumar Gupta**, a Research Engineer and Systems Architect (B.Tech CSE at Chandigarh University).

I engineer **hardware-sympathetic software**, high-performance GPU systems (Vulkan, CUDA, PTX, C++), and cognitive architectures. I founded **Earthos Lab** (the startup), lead **Project Earthos** (platform at \`roshankumargupta.tech\`), architected **Synapse Arch**, and authored ***The AGI Question*** monograph.

What systems or architectural decisions would you like to explore?`
    };
  }

  // --------------------------------------------------------------------------
  // 2. MAIN CASE: Earthos Ecosystem Distinction (The 4 Pillars)
  // --------------------------------------------------------------------------
  if (q.includes('earthos lab') || q === 'what is earthos lab' || q.includes('earthoslab')) {
    return {
      isHandled: true,
      targetNodeId: 'startup_earthoslab',
      content: `**Earthos Lab** is the deep-tech research startup venture I founded.

We design sovereign cognitive substrates, neuromorphic memory architectures, and hardware-sympathetic execution runtimes that bridge low-level systems programming with genuine machine intelligence.`
    };
  }

  if (q.includes('project earthos') || q === 'what is earthos' || q.includes('earthos.shop') || q.includes('earthos platform')) {
    return {
      isHandled: true,
      targetNodeId: 'proj_earthos',
      content: `**Project Earthos** is the production platform and interactive reader workspace deployed at \`https://roshankumargupta.tech\` (and \`https://earthos.shop\`).

Built with Next.js 16 and Supabase PostgreSQL, it integrates interactive reading telemetry, persistent reader sessions, and multi-warehouse logistics.`
    };
  }

  if (q.includes('synapse') || q.includes('synapse arch') || q.includes('synapse architecture')) {
    return {
      isHandled: true,
      targetNodeId: 'arch_synapse',
      content: `**Synapse Arch** is my 12-layer cognitive architecture and hardware-sympathetic execution substrate.

It formalizes multi-tier memory paging, Antonio Damasio's somatic marker hypothesis to prevent decision paralysis, and Representation Darwinism with semi-permeable cognitive membranes ($0.01 < \\kappa < 0.20$).`
    };
  }

  if (
    q.includes('the agi question') ||
    q.includes('agi question') ||
    q.includes('what does it take to become a mind') ||
    (q.includes('book') && !q.includes('chapter')) ||
    q.includes('monograph')
  ) {
    return {
      isHandled: true,
      targetNodeId: 'book_agi_question',
      content: `***The AGI Question: What Does It Take to Become a Mind?*** is my 14-chapter foundational monograph (120+ pages).

It presents a first-principles critique of disembodied LLMs, examines Damasio's neurobiology (the Paradox of Elliot), and formalizes the conditions for synthetic consciousness.

You can explore individual chapters (e.g. "Chapter 10: Interior Weather") or read it at \`https://roshankumargupta.tech\`.`
    };
  }

  // --------------------------------------------------------------------------
  // 3. MAIN CASE: The 14 Book Chapters
  // --------------------------------------------------------------------------
  for (const ch of BOOK_CHAPTERS) {
    const chRegex = new RegExp(`\\b(chapter|ch)\\s*${ch.num}\\b`, 'i');
    const titlePart = ch.title.split('—')[1]?.trim().toLowerCase() || '___';
    const chMatch = chRegex.test(q) || q.includes(titlePart);

    if (chMatch) {
      return {
        isHandled: true,
        targetNodeId: ch.nodeId,
        content: `📖 **${ch.title}** (from *The AGI Question*):

**Synopsis**: ${ch.synopsis}

**Key Formal Concepts**:
${ch.keyConcepts.map(c => `  • ${c}`).join('\n')}

*(Camera focused on node \`${ch.nodeId}\` in the 3D Neural Universe).*`
      };
    }
  }

  // --------------------------------------------------------------------------
  // 4. MAIN CASE: Flagship Engineering Projects
  // --------------------------------------------------------------------------
  for (const project of TIER1_PROJECTS) {
    const matched = project.strictKeywords.some(kw => q.includes(kw.toLowerCase()));
    if (matched) {
      const keyMetricsList = Object.entries(project.verifiedMetrics)
        .slice(0, 3)
        .map(([k, v]) => `• **${k}**: ${v}`)
        .join('\n');
      const firstDecision = project.architecturalDecisions[0];
      
      let ans = `**${project.name}** (${project.status})\n${project.oneLiner}\n\n`;
      ans += `📊 **Key Verified Metrics**:\n${keyMetricsList}\n\n`;
      if (firstDecision) {
        ans += `⚙️ **Key Decision** [${firstDecision.topic}]:\n${firstDecision.choiceMade} — ${firstDecision.firstPrinciplesRationale}\n\n`;
      }
      ans += `📖 Deep-Dive Reference: \`${project.docRef}\``;
      return {
        isHandled: true,
        targetNodeId: project.nodeId,
        content: ans
      };
    }
  }

  // --------------------------------------------------------------------------
  // 5. EDGE CASES: Personal Boundaries, Family, Real-World General Queries
  // --------------------------------------------------------------------------
  if (
    q.includes('father') ||
    q.includes('mother') ||
    q.includes('parents') ||
    q.includes('family') ||
    q.includes('born in 1972')
  ) {
    return {
      isHandled: true,
      targetNodeId: 'core',
      content: `I keep personal and family matters private and focus my interactive portfolio on systems architecture, high-performance computing, and cognitive research.`
    };
  }

  if (
    q.includes('google ceo') ||
    q.includes('ceo of google') ||
    q.includes('sundar pichai') ||
    q.includes('sundar pichandajee')
  ) {
    return {
      isHandled: true,
      targetNodeId: null,
      content: `Sundar Pichai is the CEO of Alphabet and Google (appointed CEO of Google in August 2015 and CEO of Alphabet in December 2019).`
    };
  }

  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'greetings' ||
    q.startsWith('hello ') ||
    q.startsWith('hey ')
  ) {
    return {
      isHandled: true,
      targetNodeId: 'core',
      content: `Hey! I'm **Roshan Kumar Gupta**. Welcome to my interactive portfolio terminal.

You can explore my systems projects in the 3D universe, challenge my architectural decisions with \`[ 🔥 GRILL_ME ]\`, or ask me about:
• **Earthos Lab** (startup) & **Project Earthos** (platform)
• **Synapse Arch** (cognitive architecture) & ***The AGI Question*** (14-chapter book)
• **FieldChain** (166.86 GiB/s Vulkan GPU storage)
• **Writrieve** (System-1 context engine, 95.5% token reduction)
• **Navisense** (ISRO PS 26168 1st place, drift < 12.3m)
• **ModelVM** (ACM TOCS preprint, 52.7GB models in 8GB envelope)`
    };
  }

  if (
    q.includes('resume') ||
    q.includes('cv') ||
    q.includes('download resume')
  ) {
    return {
      isHandled: true,
      targetNodeId: 'cat_edu',
      content: `You can download my verified single-page resumes directly:
• **Systems & HPC Resume**: \`/resume.pdf\`
• **Research Engineer Resume**: \`/resume-research.pdf\`
• **Portfolio Website**: \`https://roshankumargupta.tech\`

All versions have been updated to reflect my concluded tenure as Department Student Representative (Oct 2025 – Sep 2026) and strictly adhere to the 1-page layout.`
    };
  }

  if (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('phone') ||
    q.includes('linkedin') ||
    q.includes('github')
  ) {
    return {
      isHandled: true,
      targetNodeId: 'core',
      content: `You can reach me directly:
• **Email**: \`roshankumargupta.sh@gmail.com\`
• **Phone**: \`+91 9334098565\`
• **GitHub**: \`https://github.com/rk-roshan-kr\`
• **LinkedIn**: \`https://linkedin.com/in/roshankumargupta-0xc0de\`
• **Portfolio**: \`https://roshankumargupta.tech\``
    };
  }

  if (
    q.includes('dsr') ||
    q.includes('student representative')
  ) {
    return {
      isHandled: true,
      targetNodeId: 'exp_dsr',
      content: `I served as the **Department Student Representative (DSR)** at Chandigarh University from **October 2025 to September 2026** (my tenure concluded in September 2026). During this period, I represented over 400 computer science students, coordinated academic liaisons with administration, and organized departmental tech initiatives.`
    };
  }

  // Not handled by deterministic oracle
  return {
    isHandled: false,
    content: '',
    targetNodeId: null
  };
}

export function queryProjectOracle(userQuery: string): ProjectFact[] {
  const query = userQuery.toLowerCase();
  return TIER1_PROJECTS.filter(project => {
    return project.strictKeywords.some(keyword => query.includes(keyword.toLowerCase()));
  });
}

export function formatProjectFactsForPrompt(facts: ProjectFact[]): string {
  if (facts.length === 0) return '';

  let out = '\n[AUDITED_PROJECT_GROUND_TRUTH_DATA - STRICT CITATION REQUIRED]\n';
  out += 'You must use these verified facts, architectural rationales, and exact numbers. Do NOT alter metrics or invent numbers:\n\n';

  for (const fact of facts) {
    out += `PROJECT: ${fact.name}\n`;
    out += `Node ID: ${fact.nodeId}\n`;
    out += `Status: ${fact.status}\n`;
    out += `Summary: ${fact.oneLiner}\n`;
    out += `Deep-Dive Reference Doc: ${fact.docRef}\n`;
    out += `Verified Metrics:\n`;
    for (const [k, v] of Object.entries(fact.verifiedMetrics)) {
      out += `  - ${k}: ${v}\n`;
    }
    out += `Key Architecture Points:\n`;
    fact.architecture.forEach(point => out += `  * ${point}\n`);
    
    if (fact.architecturalDecisions.length > 0) {
      out += `Key Architectural Decisions ("WHY & HOW"):\n`;
      for (const d of fact.architecturalDecisions) {
        out += `  * Decision on [${d.topic}]: ${d.question}\n`;
        out += `    - Choice: ${d.choiceMade}\n`;
        out += `    - Rationale: ${d.firstPrinciplesRationale}\n`;
      }
    }

    if (fact.interviewDefense.length > 0) {
      out += `Interview Defense Counter-Argument:\n`;
      for (const d of fact.interviewDefense) {
        out += `  * Challenge: "${d.inquisitorChallenge}"\n`;
        out += `    - Defense: "${d.roshanCounterArgument}"\n`;
      }
    }

    out += `Core Intellectual / Systems Rationale: ${fact.philosophicalOrCoreIdea}\n\n`;
  }

  out += '[END_GROUND_TRUTH_DATA]\n';
  return out;
}
