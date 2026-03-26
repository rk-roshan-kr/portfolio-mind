const fs = require('fs');
const path = require('path');

const shells = [
  // SHELL 0 - Core
  {
    radius: 0,
    items: ['Roshan Kumar Gupta']
  },
  // SHELL 1 - Foundational layer
  {
    radius: 12,
    items: ['High-Performance Systems', 'FieldChain GPU Storage', 'Roshan Architecture', 'CUDA', 'C / C++', 'Advanced Memory Management', 'Deterministic Runtimes', 'SIMD Instructions', 'Warp Scheduling', 'VRAM Allocation']
  },
  // SHELL 2 - Logic layer
  {
    radius: 24,
    items: ['Physics-Constrained ML', 'Project TARS', 'QUANTA Thesis', 'PyTorch', 'Physics-Informed NNs', 'NASA TESS Light Curves', 'Exoplanet Transit Photometry', 'Tensor Operations', 'Backpropagation']
  },
  // SHELL 3 - Network layer
  {
    radius: 36,
    items: ['AI Infrastructure & LLMs', 'Large Language Models', 'Latent Vector Spaces', 'Vector Embeddings', 'RAG', 'Agentic AI Workflows', 'Attention Mechanisms', 'Vector Databases', 'Context Window Management']
  },
  // SHELL 4 - Surface layer
  {
    radius: 48,
    items: ['Web & UI Architecture', 'Safety Pod App', 'React.js', 'WebGL', 'Three.js', 'Compute Shaders', 'Raymarching', 'Zustand State', 'Framer Motion', 'Decentralized Systems', 'Cryptic DAO Dashboard', 'DAO Organizations', 'Distributed Systems Design', 'UI/UX Design']
  }
];

const nodes = [];
const edges = [];
const shellNodes = [[], [], [], [], []];

let idCounter = 0;

shells.forEach((shell, shellIndex) => {
  shell.items.forEach((item, itemIndex) => {
    let x = 0, y = 0, z = 0;
    
    if (shellIndex === 0) {
      x = 0; y = 0; z = 0; // Core identity locked to absolute zero
    } else {
      // Uniform random spherical distribution
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = Math.random() * 2 * Math.PI;
      
      // Organic Jitter adapted for tighter shells
      const finalRadius = shell.radius + (Math.random() * 5 - 2.5);
      
      x = finalRadius * Math.sin(phi) * Math.cos(theta);
      y = finalRadius * Math.sin(phi) * Math.sin(theta);
      z = finalRadius * Math.cos(phi);
    }
    
    const nodeObj = {
      id: shellIndex === 0 ? "core" : `node-${idCounter++}`,
      title: item,
      type: (shellIndex === 0 || itemIndex < 2) ? 'project' : 'skill',
      description: `A vertex inhabiting Shell ${shellIndex} (${shell.radius} units deep) of the Concentric Latent Swarm.`,
      position: [x, y, z]
    };
    
    nodes.push(nodeObj);
    shellNodes[shellIndex].push(nodeObj.id);
  });
});

// The Neural Wiring (Inward-flowing Loki ropes)
const coreId = shellNodes[0][0];

for (let i = 1; i < shellNodes.length; i++) {
  const currentShell = shellNodes[i];
  const previousShell = shellNodes[i - 1];
  
  currentShell.forEach(nodeId => {
    // 1. Link to a random node in Shell N-1
    const randomPrevNode = previousShell[Math.floor(Math.random() * previousShell.length)];
    edges.push({
      source: nodeId,
      target: randomPrevNode,
      opacity: 0.15 - (i * 0.02) 
    });
    
    // 2. Link back directly to the Core (Shell 0)
    // Avoid double linking if Shell 1 already connected to Core
    if (i > 1) {
       edges.push({
         source: nodeId,
         target: coreId,
         opacity: 0.08 - (i * 0.01)
       });
    }
  });
}

const outputDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'knowledge-base.json'), JSON.stringify({ nodes, edges }, null, 2));
console.log(`Tighter Concentric Dyson Swarm generated: ${nodes.length} nodes across ${shells.length} shells.`);
