const fs = require('fs');
const path = require('path');

const rawData = [
  // Gen 0
  { id: "core", label: "Roshan Kumar Gupta", type: "project", parentId: null },
  
  // Gen 1 (Pillars)
  { id: "pillar_sys", label: "High-Performance Systems", type: "skill", parentId: "core" },
  { id: "pillar_ai", label: "Physics-Constrained ML", type: "skill", parentId: "core" },
  { id: "pillar_web", label: "Web & UI Architecture", type: "skill", parentId: "core" },
  { id: "pillar_defi", label: "Decentralized Systems", type: "skill", parentId: "core" },
  { id: "pillar_edu", label: "Identity & Education", type: "skill", parentId: "core" },
  
  // Gen 2 (Anchor Projects/Skills)
  // Sys
  { id: "proj_fieldchain", label: "FieldChain GPU Storage", type: "project", parentId: "pillar_sys" },
  { id: "proj_roshan_arch", label: "Roshan Architecture", type: "project", parentId: "pillar_sys" },
  { id: "skill_cuda", label: "CUDA", type: "skill", parentId: "pillar_sys" },
  { id: "skill_cpp", label: "C / C++", type: "skill", parentId: "pillar_sys" },
  // AI
  { id: "proj_tars", label: "Project TARS", type: "project", parentId: "pillar_ai" },
  { id: "proj_quanta", label: "QUANTA Thesis", type: "project", parentId: "pillar_ai" },
  { id: "skill_pytorch", label: "PyTorch", type: "skill", parentId: "pillar_ai" },
  { id: "skill_pinns", label: "Physics-Informed NNs", type: "skill", parentId: "pillar_ai" },
  // Web
  { id: "proj_safety", label: "Safety Pod App", type: "project", parentId: "pillar_web" },
  { id: "skill_react", label: "React.js", type: "skill", parentId: "pillar_web" },
  { id: "skill_webgl", label: "WebGL", type: "skill", parentId: "pillar_web" },
  { id: "skill_threejs", label: "Three.js", type: "skill", parentId: "pillar_web" },
  // DeFi
  { id: "proj_cryptic", label: "Cryptic DAO Dashboard", type: "project", parentId: "pillar_defi" },
  { id: "skill_dao", label: "DAO Organizations", type: "skill", parentId: "pillar_defi" },
  { id: "skill_sys_design", label: "Distributed Systems Design", type: "skill", parentId: "pillar_defi" },
  // Edu
  { id: "edu_btech", label: "B.Tech Computer Science", type: "skill", parentId: "pillar_edu" },
  { id: "award_ev", label: "Emergent Ventures Grantee", type: "skill", parentId: "pillar_edu" },
  { id: "exp_lt", label: "L&T Intern", type: "skill", parentId: "pillar_edu" },

  // Gen 3 (Micro-Concepts)
  // Sys concepts
  { id: "sys_memory", label: "Advanced Memory Management", type: "skill", parentId: "proj_roshan_arch" },
  { id: "sys_deterministic", label: "Deterministic Runtimes", type: "skill", parentId: "proj_roshan_arch" },
  { id: "concept_simd", label: "SIMD Instructions", type: "skill", parentId: "skill_cuda" },
  { id: "concept_warp", label: "Warp Scheduling", type: "skill", parentId: "skill_cuda" },
  { id: "concept_vram", label: "VRAM Allocation", type: "skill", parentId: "skill_cuda" },
  // AI concepts
  { id: "data_tess", label: "NASA TESS Light Curves", type: "skill", parentId: "proj_tars" },
  { id: "concept_exoplanet", label: "Exoplanet Transit Photometry", type: "skill", parentId: "proj_tars" },
  { id: "concept_tensors", label: "Tensor Operations", type: "skill", parentId: "skill_pytorch" },
  { id: "concept_backprop", label: "Backpropagation", type: "skill", parentId: "skill_pytorch" },
  // Web concepts
  { id: "concept_shaders", label: "Compute Shaders", type: "skill", parentId: "skill_webgl" },
  { id: "concept_raymarching", label: "Raymarching", type: "skill", parentId: "skill_webgl" },
  { id: "state_zustand", label: "Zustand State", type: "skill", parentId: "skill_react" },
  { id: "anim_framer", label: "Framer Motion", type: "skill", parentId: "skill_react" }
];

const nodes = [];
const edges = [];

function processNode(nodeId, cx, cy, cz, radius, generation) {
  const nodeData = rawData.find(n => n.id === nodeId);
  if (!nodeData) return;

  nodes.push({
    id: nodeData.id,
    title: nodeData.label,
    type: nodeData.type,
    description: `Generation ${generation} Concept: Connected structurally by relationships in the Latent Space.`,
    position: [cx, cy, cz]
  });

  if (nodeData.parentId) {
    edges.push({
      source: nodeData.parentId,
      target: nodeData.id,
      opacity: generation === 1 ? 0.3 : (generation === 2 ? 0.15 : 0.08)
    });
  }

  const children = rawData.filter(n => n.parentId === nodeId);
  if (children.length === 0) return;

  const phiStep = Math.PI * (3 - Math.sqrt(5)); // Golden angle for even spherical distribution
  
  children.forEach((child, i) => {
    let childRadius;
    if (generation === 0) childRadius = 25; // Closer Pillars from Core
    else if (generation === 1) childRadius = 12; // Anchor distance from Pillar
    else childRadius = 5; // Micro-Concept distance from Anchor

    let offsetX, offsetY, offsetZ;
    if (children.length === 1) {
      offsetX = childRadius; offsetY = 0; offsetZ = 0;
    } else {
      const y = 1 - (i / (children.length - 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiStep * i;

      offsetX = Math.cos(theta) * radiusAtY * childRadius;
      offsetY = y * childRadius;
      offsetZ = Math.sin(theta) * radiusAtY * childRadius;
      
      // Jitter
      offsetX += (Math.random() - 0.5) * (childRadius * 0.1);
      offsetY += (Math.random() - 0.5) * (childRadius * 0.1);
      offsetZ += (Math.random() - 0.5) * (childRadius * 0.1);
    }

    processNode(child.id, cx + offsetX, cy + offsetY, cz + offsetZ, childRadius, generation + 1);
  });
}

processNode("core", 0, 0, 0, 0, 0);

const outputDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'knowledge-base.json'), JSON.stringify({ nodes, edges }, null, 2));
console.log(`Universe grown organically with ${nodes.length} nodes and ${edges.length} majestic connections!`);
