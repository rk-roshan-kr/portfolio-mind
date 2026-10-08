import json
import math

def build_universe():
    nodes = []
    edges = []

    # Helper to add node
    def add_node(id, title, type, level, parent_id, description, pos, links=None, tech_stack=None):
        node = {
            "id": id,
            "title": title,
            "type": type,
            "level": level,
            "parentId": parent_id,
            "description": description,
            "position": [round(pos[0], 2), round(pos[1], 2), round(pos[2], 2)]
        }
        if links:
            node["links"] = links
        if tech_stack:
            node["techStack"] = tech_stack
        nodes.append(node)
        return node

    # Helper to add edge
    def add_edge(source, target, opacity=0.8):
        edges.append({
            "source": source,
            "target": target,
            "opacity": opacity
        })

    # =========================================================================
    # LEVEL 0: Absolute Core
    # =========================================================================
    add_node(
        "core",
        "Roshan Kumar Gupta",
        "project",
        0,
        None,
        "Research Engineer and Systems Architect. Founder of Earthos Lab, Author of 'The AGI Question', creator of FieldChain, Writrieve, TARS, Navisense, and ModelVM. Specializes in hardware-sympathetic software, GPU computing (Vulkan/CUDA/C++), and cognitive architectures.",
        [0.0, 0.0, 0.0]
    )

    # =========================================================================
    # LEVEL 1: Primary Pillars / Category Hubs
    # =========================================================================
    add_node(
        "cat_startup",
        "Earthos Lab & Ventures",
        "project",
        1,
        "core",
        "Deep-tech venture ecosystem founded by Roshan Kumar Gupta. Houses Earthos Lab (startup), Project Earthos (platform), Synapse Arch (cognitive substrate), and The AGI Question (monograph).",
        [-4.5, 5.0, -3.0]
    )
    add_edge("core", "cat_startup", 0.9)

    add_node(
        "cat_proj",
        "Architectural Projects",
        "project",
        1,
        "core",
        "Flagship engineering systems: FieldChain (166.86 GiB/s GPU storage), Writrieve (System-1 context engine), TARS (exoplanet recovery), Navisense (ISRO GNSS-denied navigation), and ModelVM (virtual memory for LLMs).",
        [-4.0, -4.5, 4.0]
    )
    add_edge("core", "cat_proj", 0.9)

    add_node(
        "cat_skills",
        "Core Technical Skills",
        "project",
        1,
        "core",
        "Hardware-sympathetic stack: Low-level GPU systems (Vulkan, CUDA, PTX, C++), Physics-Constrained ML, Deterministic Runtimes, and Distributed Web Architecture.",
        [4.5, -4.0, -3.5]
    )
    add_edge("core", "cat_skills", 0.9)

    add_node(
        "cat_edu",
        "Education & Identity",
        "project",
        1,
        "core",
        "Academic foundation and research leadership. B.Tech Computer Science at Chandigarh University, Department Student Representative (Oct 2025 – Sep 2026), and independent systems research.",
        [4.0, 4.5, 3.5]
    )
    add_edge("core", "cat_edu", 0.9)

    add_node(
        "cat_exp",
        "Experience & Milestones",
        "project",
        1,
        "core",
        "Research grants, enterprise engineering, hackathon championships, and upstream open-source contributions across Apache, CNCF, and Linux Foundation.",
        [-2.0, -5.0, -4.0]
    )
    add_edge("core", "cat_exp", 0.9)

    # =========================================================================
    # EARTHOS ECOSYSTEM (THE 4 PILLARS REQUESTED BY USER)
    # 1. Earthos Lab (Startup)
    # 2. Project Earthos (Project / Platform)
    # 3. Synapse Arch (Architecture)
    # 4. The AGI Question (Book / Monograph)
    # =========================================================================
    
    # 1. THE STARTUP: Earthos Lab
    add_node(
        "startup_earthoslab",
        "Earthos Lab (Startup)",
        "project",
        2,
        "cat_startup",
        "The deep-tech research venture and startup founded by Roshan Kumar Gupta. Focuses on sovereign cognitive substrates, neuromorphic memory architectures, and hardware-sympathetic synthetic intelligence.",
        [-8.5, 9.5, -4.0],
        links=[{"label": "VENTURE_ROOT", "url": "https://earthos.shop"}]
    )
    add_edge("cat_startup", "startup_earthoslab", 0.9)

    # 2. THE PROJECT: Project Earthos
    add_node(
        "proj_earthos",
        "Project Earthos (Platform)",
        "project",
        2,
        "startup_earthoslab",
        "Production digital platform and interactive reader workspace deployed at earthos.shop. Built with Next.js 16, Supabase PostgreSQL, real-time edge telemetry, nearest-node multi-warehouse logistics, and sovereign reader sessions.",
        [-13.5, 12.0, -7.0],
        links=[{"label": "LIVE_DEPLOY", "url": "https://earthos.shop"}]
    )
    add_edge("startup_earthoslab", "proj_earthos", 0.85)

    # 3. THE ARCHITECTURE: Synapse Arch
    add_node(
        "arch_synapse",
        "Synapse Arch (Cognitive Substrate)",
        "project",
        2,
        "startup_earthoslab",
        "12-layer cognitive architecture and hardware-sympathetic execution substrate. Formalizes Memory Paging, Somatic Marker hypothesis, and Representation Darwinism with semi-permeable cognitive membranes (0.01 < κ < 0.20).",
        [-13.0, 7.0, -9.5],
        links=[{"label": "ARCH_DOC", "url": "https://github.com/rk-roshan-kr/Earthos"}]
    )
    add_edge("startup_earthoslab", "arch_synapse", 0.85)

    # 4. THE BOOK: The AGI Question (Monograph)
    add_node(
        "book_agi_question",
        "The AGI Question (Monograph)",
        "project",
        2,
        "startup_earthoslab",
        "Foundational 14-chapter monograph authored by Roshan Kumar Gupta: 'The AGI Question: What Does It Take to Become a Mind?'. Critiques disembodied next-token prediction, explores Antonio Damasio's neurobiology, and charts synthetic consciousness.",
        [-7.0, 13.5, -1.5],
        links=[{"label": "MONOGRAPH_READER", "url": "https://earthos.shop"}]
    )
    add_edge("startup_earthoslab", "book_agi_question", 0.9)
    add_edge("book_agi_question", "arch_synapse", 0.6)
    add_edge("book_agi_question", "proj_earthos", 0.6)

    # =========================================================================
    # THE 14 CHAPTERS OF THE BOOK (LEVEL 3 UNDER book_agi_question)
    # Arranged in an elegant orbital helix around book_agi_question
    # =========================================================================
    chapters = [
        ("book_ch01", "Ch 1: The Stateless Mind", "Critique of next-token prediction without temporal continuity. Why statistical linguistic mirrors lack cognitive understanding.", "concept_llm"),
        ("book_ch02", "Ch 2: The Traveler Who Forgets", "The amnesia of stateless inference passes. Investigates why continuous inner monologue and memory consolidation are necessary for a mind.", "concept_episodic_memory"),
        ("book_ch03", "Ch 3: The Map That Can't See Itself", "Metacognitive recursive loops. Why an agent must model its own observation and reasoning process, not merely the external world.", "concept_metacognition"),
        ("book_ch04", "Ch 4: The Belief Engine", "Epistemic grounding vs conversational sycophancy. Formalizes Bayesian belief updating against empirical reality.", "concept_epistemic_grounding"),
        ("book_ch05", "Ch 5: The Drawer That Jams", "Associative memory retrieval bottlenecks. Analyzes vector collision degradation, memory paging, and interference in high-dimensional latent spaces.", "sys_memory"),
        ("book_ch06", "Ch 6: Before You Act", "Pre-motor counterfactual simulation engines. How a cognitive agent evaluates branching action trajectories before committing physical energy.", "concept_counterfactuals"),
        ("book_ch07", "Ch 7: The Budget of a Mind", "Homeostatic regulation and metabolic resource limits. Why vulnerability, energy budgets, and mortality are foundational to intelligence.", "concept_homeostasis"),
        ("book_ch08", "Ch 8: What the Stage Manager Does", "Attentional arbitration and executive control networks. How the mind directs focus across multi-stream sensory inputs.", "concept_executive_attention"),
        ("book_ch09", "Ch 9: Minds Within Minds", "Hierarchical multi-agent internal sub-processes. Modeling competing cognitive drives and internal consensus formation.", "concept_hierarchical_agency"),
        ("book_ch10", "Ch 10: Interior Weather", "Antonio Damasio's Somatic Marker hypothesis and the Paradox of Elliot. Why emotion and visceral gut-checks are indispensable to rational choice.", "concept_somatic_markers"),
        ("book_ch11", "Ch 11: The Examined Mind", "Autonomous error-monitoring circuits and reflective equilibrium. Detecting and repairing internal logical and sensory contradictions.", "concept_error_monitoring"),
        ("book_ch12", "Ch 12: The Memory That Holds", "Synaptic structural memory consolidation and sleep-phase replay. How acute working memory stabilizes into enduring world knowledge.", "concept_synaptic_consolidation"),
        ("book_ch13", "Ch 13: The Friction That Keeps Us Honest", "Physical embodiment resistance and the semi-permeable cognitive membrane (0.01 < κ < 0.20). Surviving environmental noise without structural collapse.", "concept_membrane"),
        ("book_ch14", "Ch 14: Towards the Horizon", "The synthetic consciousness roadmap. Formalizing substrate-independent minds, sovereign cognitive architectures, and artificial life.", "concept_synthetic_consciousness")
    ]

    bx, by, bz = -7.0, 13.5, -1.5
    for i, (cid, ctitle, cdesc, upstream_concept) in enumerate(chapters):
        angle = (i / len(chapters)) * 2 * math.pi
        radius = 5.5 + (i % 2) * 1.5
        height_offset = -3.5 + (i * 0.55)
        cx = bx + radius * math.cos(angle)
        cy = by + height_offset
        cz = bz + radius * math.sin(angle)

        add_node(cid, ctitle, "project", 3, "book_agi_question", cdesc, [cx, cy, cz])
        add_edge("book_agi_question", cid, 0.75)
        # Downstream link to Synapse Arch
        if i in [0, 4, 6, 9, 12, 13]:
            add_edge(cid, "arch_synapse", 0.45)

    # =========================================================================
    # UPSTREAM COGNITIVE CONCEPTS & PHILOSOPHY (LEVEL 3)
    # =========================================================================
    add_node(
        "concept_somatic_markers",
        "Antonio Damasio: Somatic Markers",
        "skill",
        3,
        "arch_synapse",
        "Visceral bias signals generated by the ventromedial prefrontal cortex (vmPFC). Prunes infinite combinatorial search spaces into computationally tractable decisions.",
        [-17.0, 9.5, -9.0]
    )
    add_edge("arch_synapse", "concept_somatic_markers", 0.7)
    add_edge("book_ch10", "concept_somatic_markers", 0.8)

    add_node(
        "concept_elliot_paradox",
        "The Paradox of Elliot (vmPFC)",
        "skill",
        3,
        "arch_synapse",
        "Patient Elliot exhibited superior IQ, intact grammar, and perfect logic, yet was paralyzed in real-world decisions due to lack of emotional somatic markers. Proof that reason requires visceral emotion.",
        [-18.5, 7.5, -11.0]
    )
    add_edge("concept_somatic_markers", "concept_elliot_paradox", 0.8)
    add_edge("book_ch10", "concept_elliot_paradox", 0.75)

    add_node(
        "concept_membrane",
        "Semi-Permeable Cognitive Membrane",
        "skill",
        3,
        "arch_synapse",
        "Mathematical cognitive boundary (permeability 0.01 < κ < 0.20). Balances structural memory retention against environmental noise and reward exploitation.",
        [-15.0, 5.0, -12.0]
    )
    add_edge("arch_synapse", "concept_membrane", 0.8)
    add_edge("book_ch13", "concept_membrane", 0.8)

    add_node(
        "concept_representation_darwinism",
        "Representation Darwinism",
        "skill",
        3,
        "arch_synapse",
        "Survival law for internal world models: representations survive gradient optimization only if they actively support homeostatic balance against entropy.",
        [-13.5, 3.5, -10.5]
    )
    add_edge("arch_synapse", "concept_representation_darwinism", 0.8)
    add_edge("concept_membrane", "concept_representation_darwinism", 0.7)

    add_node(
        "concept_homeostasis",
        "Homeostatic Error Budgets",
        "skill",
        3,
        "arch_synapse",
        "Substrate-independent homeostatic error budgets over compute, memory, latency, and predictive uncertainty. Gives synthetic systems existential stakes.",
        [-11.0, 3.0, -8.0]
    )
    add_edge("arch_synapse", "concept_homeostasis", 0.7)
    add_edge("book_ch07", "concept_homeostasis", 0.75)

    add_node(
        "concept_metacognition",
        "Metacognitive Self-Modeling",
        "skill",
        3,
        "arch_synapse",
        "Recursive internal observers that model the agent's own reasoning process and error confidence rather than passively predicting tokens.",
        [-9.0, 4.5, -6.5]
    )
    add_edge("arch_synapse", "concept_metacognition", 0.7)
    add_edge("book_ch03", "concept_metacognition", 0.75)

    add_node(
        "concept_episodic_memory",
        "Episodic Memory Paging",
        "skill",
        3,
        "arch_synapse",
        "Multi-tier memory architecture decoupling working context from permanent episodic stores via semantic indexing and decay weighting.",
        [-15.5, 11.5, -5.5]
    )
    add_edge("arch_synapse", "concept_episodic_memory", 0.7)
    add_edge("book_ch02", "concept_episodic_memory", 0.75)

    add_node(
        "concept_counterfactuals",
        "Pre-Motor Counterfactual Simulation",
        "skill",
        3,
        "arch_synapse",
        "Simulation engine modeling alternative action trajectories before physical actuation, pruning high-risk paths using somatic marker heuristics.",
        [-16.0, 8.0, -7.5]
    )
    add_edge("arch_synapse", "concept_counterfactuals", 0.7)
    add_edge("book_ch06", "concept_counterfactuals", 0.75)

    add_node(
        "concept_epistemic_grounding",
        "Epistemic Grounding",
        "skill",
        3,
        "arch_synapse",
        "Truth-anchored verification distinguishing reality from persuasive hallucinations and user sycophancy.",
        [-5.5, 15.0, 1.0]
    )
    add_edge("book_ch04", "concept_epistemic_grounding", 0.75)

    add_node(
        "concept_executive_attention",
        "Executive Attentional Control",
        "skill",
        3,
        "arch_synapse",
        "Dynamic arbitration mechanism managing sensory bandwidth and multi-modal attention focus.",
        [-4.0, 16.0, 2.5]
    )
    add_edge("book_ch08", "concept_executive_attention", 0.75)

    add_node(
        "concept_hierarchical_agency",
        "Hierarchical Multi-Agency",
        "skill",
        3,
        "arch_synapse",
        "Sub-agent specialization and internal dialogue modeled as a society of cooperating processes.",
        [-2.5, 17.0, 3.5]
    )
    add_edge("book_ch09", "concept_hierarchical_agency", 0.75)

    add_node(
        "concept_error_monitoring",
        "Reflective Error Monitoring",
        "skill",
        3,
        "arch_synapse",
        "Internal supervisory loops monitoring contradiction, divergence, and uncertainty across inference passes.",
        [-1.0, 16.5, 4.5]
    )
    add_edge("book_ch11", "concept_error_monitoring", 0.75)

    add_node(
        "concept_synaptic_consolidation",
        "Synaptic Structural Consolidation",
        "skill",
        3,
        "arch_synapse",
        "Long-term structural memory replay stabilizing transient observations into resilient network priors.",
        [-0.5, 15.0, 5.5]
    )
    add_edge("book_ch12", "concept_synaptic_consolidation", 0.75)

    add_node(
        "concept_synthetic_consciousness",
        "Synthetic Consciousness Roadmap",
        "skill",
        3,
        "arch_synapse",
        "Substrate-independent framework integrating homeostasis, somatic valuation, and self-referential modeling.",
        [1.0, 14.0, 6.0]
    )
    add_edge("book_ch14", "concept_synthetic_consciousness", 0.8)
    add_edge("arch_synapse", "concept_synthetic_consciousness", 0.75)

    # =========================================================================
    # FLAGSHIP ARCHITECTURAL PROJECTS (LEVEL 2 UNDER cat_proj)
    # =========================================================================
    add_node(
        "proj_fieldchain",
        "FieldChain GPU Storage",
        "project",
        2,
        "cat_proj",
        "Wire-speed GPU storage integrity layer delivering 166.86 GiB/s peak bandwidth on Vulkan compute and 41.28 GiB/s over PCIe 4.0. Best Student Paper Award at IEEE CCNCPS 2026 Dubai.",
        [-9.5, -4.5, 7.5],
        links=[{"label": "IEEE_PAPER", "url": "https://github.com/rk-roshan-kr/FieldChain"}]
    )
    add_edge("cat_proj", "proj_fieldchain", 0.85)

    add_node(
        "proj_writrieve",
        "Writrieve System-1 Engine",
        "project",
        2,
        "cat_proj",
        "Personal context engine using Laya 421M System-1 gates to filter 95.5% of prompt noise in 1.7ms. 460ms end-to-end latency, 98% factual grounding.",
        [-7.5, -8.0, 6.0],
        links=[{"label": "GITHUB", "url": "https://github.com/rk-roshan-kr/writrieve"}]
    )
    add_edge("cat_proj", "proj_writrieve", 0.85)

    add_node(
        "proj_tars",
        "Project TARS Exoplanet Recovery",
        "project",
        2,
        "cat_proj",
        "Physics-constrained exoplanet detection engine securing a $5,500 Emergent Ventures grant. Recovers noisy transits from NASA TESS light curves using BLS and Mandel & Agol MCMC.",
        [-5.0, -9.5, 8.5],
        links=[{"label": "GRANT_DETAILS", "url": "https://tars.earth"}]
    )
    add_edge("cat_proj", "proj_tars", 0.85)

    add_node(
        "proj_navisense",
        "Navisense IDR (ISRO 1st Place)",
        "project",
        2,
        "cat_proj",
        "GNSS-denied inertial dead reckoning system winning 1st Place for ISRO PS SIH26168. ES-EKF with Zero Velocity Updates (ZUPT) and Non-Holonomic Constraints; drift < 12.3m over 1.2km.",
        [-2.5, -9.0, 9.5],
        links=[{"label": "ISRO_SYSTEM", "url": "https://navisense-idr-sih.netlify.app"}]
    )
    add_edge("cat_proj", "proj_navisense", 0.85)

    add_node(
        "proj_modelvm",
        "ModelVM Virtual Substrate",
        "project",
        2,
        "cat_proj",
        "Virtual memory substrate for LLMs. 52-page ACM TOCS preprint. Runs 52.7 GB 10-specialist library within strict 8.0 GB envelope; cuts latency by 77.2% via Cognitive State Packets (CSP).",
        [-8.0, -2.0, 9.0],
        links=[{"label": "ACM_PREPRINT", "url": "https://github.com/rk-roshan-kr/modelvm"}]
    )
    add_edge("cat_proj", "proj_modelvm", 0.85)

    add_node(
        "proj_patentzero",
        "Patent-Zero ZK Auditor",
        "project",
        2,
        "cat_proj",
        "Zero-knowledge IP novelty verification using Tree-Sitter AST semantic hashing. Generates cryptographic inclusion proofs without exposing proprietary source code.",
        [-4.0, -2.5, 11.0],
        links=[{"label": "SYSTEM_REPO", "url": "https://github.com/rk-roshan-kr"}]
    )
    add_edge("cat_proj", "proj_patentzero", 0.8)

    add_node(
        "proj_worldring",
        "WorldRing 4D Reality Engine",
        "project",
        2,
        "cat_proj",
        "Continuous 4D spatiotemporal coordinate system for real-time physics environments, eliminating discrete spatial chunk boundaries.",
        [-6.0, -6.5, 11.5],
        links=[{"label": "EXPERIMENT", "url": "https://github.com/rk-roshan-kr"}]
    )
    add_edge("cat_proj", "proj_worldring", 0.8)

    add_node(
        "proj_cryptic",
        "Cryptic DAO Dashboard",
        "project",
        2,
        "cat_proj",
        "ZeroToOne Hackathon Winner. High-performance DeFi Treasury interface with 3D spatial asset visualization, WebGL shaders, and multi-sig state synchronization.",
        [-1.0, -7.5, 7.5],
        links=[{"label": "HACKATHON_WIN", "url": "https://cryptic-webapp.netlify.app"}]
    )
    add_edge("cat_proj", "proj_cryptic", 0.8)

    add_node(
        "proj_hsastar",
        "HSA* Routing Engine",
        "project",
        2,
        "cat_proj",
        "Hierarchical Spatial A* routing algorithm delivering 140x faster pathfinding than standard Dijkstra through quadtree hierarchical decomposition and heuristic caching.",
        [-10.0, -6.5, 4.0]
    )
    add_edge("cat_proj", "proj_hsastar", 0.75)

    add_node(
        "proj_safety",
        "Safety Pod App",
        "project",
        2,
        "cat_proj",
        "Zinnovatio Hackathon Winner. Edge telemetry, offline mesh networking, and rapid emergency dispatch coordinate system for remote industrial campuses.",
        [-3.0, -11.0, 6.0],
        links=[{"label": "SAFETY_APP", "url": "https://safety-pod.netlify.app"}]
    )
    add_edge("cat_proj", "proj_safety", 0.75)

    add_node(
        "proj_trash2cash",
        "Trash2Cash Circular Logistics",
        "project",
        2,
        "cat_proj",
        "Automated reverse logistics marketplace connecting recyclable waste generators to processing plants using automated pricing heuristics.",
        [-1.5, -9.5, 4.5]
    )
    add_edge("cat_proj", "proj_trash2cash", 0.75)

    add_node(
        "proj_roshan_arch",
        "Roshan Architecture",
        "project",
        2,
        "cat_proj",
        "Personal hardware-sympathetic engineering doctrine: memory coalescing, deterministic runtimes, and low-level mechanical sympathy.",
        [-6.5, -0.5, 7.0]
    )
    add_edge("cat_proj", "proj_roshan_arch", 0.75)

    # =========================================================================
    # CORE TECHNICAL SKILLS (LEVEL 2 UNDER cat_skills)
    # =========================================================================
    add_node(
        "skill_sys",
        "High-Performance Systems",
        "skill",
        2,
        "cat_skills",
        "Low-level systems programming: Vulkan Compute, CUDA, PTX, C++, Structure-of-Arrays (SoA) layout, cache-conscious algorithms, and custom kernel tuning.",
        [8.5, -3.5, -4.5]
    )
    add_edge("cat_skills", "skill_sys", 0.85)

    add_node(
        "skill_physics",
        "Physics-Constrained ML",
        "skill",
        2,
        "cat_skills",
        "Embedding physical conservation laws into neural networks. Hamiltonian mechanics, differential equations, and noise-tolerant astronomy pipelines.",
        [7.0, -6.5, -2.5]
    )
    add_edge("cat_skills", "skill_physics", 0.85)

    add_node(
        "skill_ai",
        "AI Infrastructure",
        "skill",
        2,
        "cat_skills",
        "Deterministic model serving, WebGPU serverless inference, speculative decoding, parameter quantization, and cognitive state packet streaming.",
        [9.5, -1.5, -6.0]
    )
    add_edge("cat_skills", "skill_ai", 0.85)

    add_node(
        "skill_web",
        "Web & UI Architecture",
        "skill",
        2,
        "cat_skills",
        "Next.js 16, React 19, Three.js, React Three Fiber, WebGL, custom GLSL compute/fragment shaders, and high-framerate interactive client runtimes.",
        [6.0, -6.0, -5.5]
    )
    add_edge("cat_skills", "skill_web", 0.85)

    # Level 3 Skills
    add_node("concept_cuda", "CUDA & PTX Assembly", "skill", 3, "skill_sys", "Raw CUDA kernels, warp primitives, shared memory banking, and PTX inline assembly.", [11.5, -4.5, -5.0])
    add_edge("skill_sys", "concept_cuda", 0.7)
    add_edge("proj_fieldchain", "concept_cuda", 0.6)

    add_node("concept_vulkan", "Vulkan Compute Pipelines", "skill", 3, "skill_sys", "SPIR-V compute shaders, explicit pipeline barriers, and multi-queue dispatch for wire-speed GPU compute.", [12.0, -2.5, -6.5])
    add_edge("skill_sys", "concept_vulkan", 0.7)
    add_edge("proj_fieldchain", "concept_vulkan", 0.8)

    add_node("concept_cpp", "Modern C++ (C++20/23)", "skill", 3, "skill_sys", "Zero-cost abstractions, RAII, move semantics, template metaprogramming, and cache-conscious data structures.", [10.5, -6.0, -3.5])
    add_edge("skill_sys", "concept_cpp", 0.7)

    add_node("concept_simd", "SIMD & Warp Scheduling", "skill", 3, "skill_sys", "AVX-512, NEON vectorization, warp shuffle instructions, and divergence minimization.", [13.0, -1.0, -4.0])
    add_edge("skill_sys", "concept_simd", 0.6)

    add_node("sys_memory", "Advanced Memory Mgmt", "skill", 3, "skill_sys", "Custom arena allocators, slab allocators, zero-copy DMA buffers, and NUMA-aware paging.", [9.5, -7.5, -4.5])
    add_edge("skill_sys", "sys_memory", 0.7)
    add_edge("proj_modelvm", "sys_memory", 0.75)

    add_node("sys_deterministic", "Deterministic Runtimes", "skill", 3, "skill_sys", "Lock-free ring buffers, single-threaded cooperative event loops, and replayable execution traces.", [11.0, -8.0, -2.5])
    add_edge("skill_sys", "sys_deterministic", 0.7)

    add_node("concept_pytorch", "PyTorch Core", "skill", 3, "skill_physics", "Custom C++/CUDA autograd extensions, distributed data parallel, and quantized model graphs.", [8.5, -9.0, -1.5])
    add_edge("skill_physics", "concept_pytorch", 0.7)

    add_node("concept_pinns", "Physics-Informed NNs", "skill", 3, "skill_physics", "Loss functions enforcing Navier-Stokes, Hamiltonian dynamics, and Keplerian orbital constraints.", [6.0, -9.5, -3.5])
    add_edge("skill_physics", "concept_pinns", 0.7)
    add_edge("proj_tars", "concept_pinns", 0.7)

    add_node("concept_llm", "Large Language Models", "skill", 3, "skill_ai", "Attention mechanisms, KV-cache management, Rotary Positional Embeddings, and token economics.", [12.5, -0.5, -8.0])
    add_edge("skill_ai", "concept_llm", 0.7)

    add_node("concept_rag", "Context & RAG Architecture", "skill", 3, "skill_ai", "Dense vector embeddings, cross-encoder rerankers, semantic gating, and sparse-dense hybrid retrieval.", [10.5, 1.0, -8.5])
    add_edge("skill_ai", "concept_rag", 0.7)
    add_edge("proj_writrieve", "concept_rag", 0.75)

    add_node("concept_react", "React 19 & Next.js 16", "skill", 3, "skill_web", "Server components, streaming SSR, edge functions, and fine-grained state management with Zustand.", [7.5, -8.0, -7.5])
    add_edge("skill_web", "concept_react", 0.7)
    add_edge("proj_earthos", "concept_react", 0.7)

    add_node("concept_three", "Three.js & WebGL Shaders", "skill", 3, "skill_web", "3D spatial scene graphs, instanced meshes, custom GLSL fragment shaders, and procedural particle systems.", [5.0, -8.5, -7.0])
    add_edge("skill_web", "concept_three", 0.7)
    add_edge("proj_cryptic", "concept_three", 0.7)

    # =========================================================================
    # EDUCATION & IDENTITY (LEVEL 2 UNDER cat_edu)
    # =========================================================================
    add_node(
        "edu_btech",
        "B.Tech Computer Science",
        "skill",
        2,
        "cat_edu",
        "Chandigarh University (2025–2029). Coursework: High-Performance Computing, Low-Level Systems, Database Architecture, Parallel Computing. CGPA: 6.98.",
        [7.0, 7.5, 4.5]
    )
    add_edge("cat_edu", "edu_btech", 0.85)

    add_node(
        "edu_uni",
        "Chandigarh University",
        "skill",
        2,
        "cat_edu",
        "Mohali, Punjab, India. Institutional research hub for systems engineering, IEEE conference papers, and departmental initiatives.",
        [5.0, 9.0, 6.0]
    )
    add_edge("cat_edu", "edu_uni", 0.85)

    add_node(
        "exp_dsr",
        "Former Student Representative",
        "skill",
        2,
        "cat_edu",
        "Department Student Representative (Tenure: Oct 2025 – Sep 2026). Represented 400+ computer science students, liaised with faculty, managed academic conflict resolution, and organized tech initiatives.",
        [9.0, 5.5, 6.0]
    )
    add_edge("cat_edu", "exp_dsr", 0.8)

    # =========================================================================
    # EXPERIENCE & MILESTONES (LEVEL 2 UNDER cat_exp)
    # =========================================================================
    add_node(
        "award_ev",
        "Emergent Ventures Grantee",
        "project",
        2,
        "cat_exp",
        "Awarded $5,500 grant from Emergent Ventures (founded by Tyler Cowen / Mercatus Center) for pioneering independent research in physics-constrained machine learning and astronomy data pipelines.",
        [-4.5, -8.5, -5.5],
        links=[{"label": "EV_GRANT", "url": "https://tars.earth"}]
    )
    add_edge("cat_exp", "award_ev", 0.85)
    add_edge("proj_tars", "award_ev", 0.75)

    add_node(
        "award_ieee",
        "IEEE CCNCPS Best Paper Award",
        "project",
        2,
        "cat_exp",
        "Best Student Paper Award & Session Chair designation at IEEE CCNCPS 2026 Dubai for the FieldChain GPU storage integrity architecture.",
        [-6.5, -6.5, -7.0]
    )
    add_edge("cat_exp", "award_ieee", 0.85)
    add_edge("proj_fieldchain", "award_ieee", 0.8)

    add_node(
        "award_cu_research",
        "CU Research Excellence Award",
        "project",
        2,
        "cat_exp",
        "University research grant of $1,500 supporting laboratory hardware, high-end compute equipment, and GPU benchmarking clusters.",
        [-2.5, -8.0, -7.5]
    )
    add_edge("cat_exp", "award_cu_research", 0.8)
    add_edge("proj_fieldchain", "award_cu_research", 0.6)

    add_node(
        "proj_opensource",
        "Upstream Open Source (CNCF & Apache)",
        "project",
        2,
        "cat_exp",
        "Merged pull requests across CNCF OpenTelemetry (#449), Apache Fineract (#703, #688), Red Hat Cockpit (#23800), and OpenSearch Dashboards (#12879, #12880).",
        [-5.0, -4.0, -8.5],
        links=[{"label": "PR_TRACKER", "url": "https://github.com/rk-roshan-kr"}]
    )
    add_edge("cat_exp", "proj_opensource", 0.85)

    add_node(
        "exp_lt",
        "L3 IT Intern (SMG Scooters)",
        "project",
        2,
        "cat_exp",
        "Enterprise IT & systems optimization intern (Dec 2025 – Jan 2026). Engineered internal CRM portal, optimized inventory databases, and automated logistics workflows.",
        [-0.5, -7.0, -6.0]
    )
    add_edge("cat_exp", "exp_lt", 0.8)

    # Project inter-links to skills
    add_edge("proj_fieldchain", "skill_sys", 0.6)
    add_edge("proj_writrieve", "skill_ai", 0.6)
    add_edge("proj_tars", "skill_physics", 0.6)
    add_edge("proj_navisense", "skill_sys", 0.5)
    add_edge("proj_modelvm", "skill_sys", 0.6)
    add_edge("proj_cryptic", "skill_web", 0.6)
    add_edge("proj_earthos", "skill_web", 0.6)

    print(f"Generated {len(nodes)} nodes and {len(edges)} edges.")
    return {"nodes": nodes, "edges": edges}

if __name__ == "__main__":
    universe = build_universe()
    with open("src/data/knowledge-base.json", "w", encoding="utf-8") as f:
        json.dump(universe, f, indent=2)
    print("Successfully wrote expanded knowledge-base.json!")
