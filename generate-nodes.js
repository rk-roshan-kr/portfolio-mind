const fs = require('fs');

function rnd(spread) { return (Math.random() - 0.5) * spread; }

function createNodes(prefix, cx, cy, cz, spread, items, projectCount) {
  return items.map((t, i) => {
    if (prefix === 'core' && i === 0) {
       return {
         id: `core-0`, title: t, type: 'project', description: 'Absolute Synthesis Core', position: [0, 0, 0]
       };
    }
    
    const isProject = i < projectCount;
    const distSpread = isProject ? spread * 0.4 : spread * 1.5;
    
    let px = cx + rnd(distSpread);
    let py = cy + rnd(distSpread);
    let pz = cz + rnd(distSpread);
    
    if (prefix === 'core' && i > 0) {
       // Clear the area exactly around the massive 5D core by injecting a push radius of 7 units!
       while (px*px + py*py + pz*pz < 49) {
          px = cx + rnd(distSpread * 1.8);
          py = cy + rnd(distSpread * 1.8);
          pz = cz + rnd(distSpread * 1.8);
       }
    }

    return {
      id: `${prefix}-${i}`,
      title: t,
      type: isProject ? 'project' : 'skill',
      description: `${t} represents a major knowledge vertex in the Latent Space.`,
      position: [px, py, pz]
    };
  });
}

// Expanding the galaxy massively for structural clarity and supreme reading legibility
const data = [
  ...createNodes('core',  0,   0,   0,  15, ['Roshan Kumar Gupta', 'Research Engineer', 'Systems Architect', 'B.Tech Computer Science', 'Chandigarh University', 'Emergent Ventures Grantee', 'NVIDIA DevTech Applicant', 'ZeroToOne Hackathon', 'Zinnovatio Hackathon', 'L&T Intern', 'Student Representative', 'Scientific Writing Cell', 'Patent Law & Inventing', 'Mentorship (Dr. Garima)'], 4),
  ...createNodes('hpc', -30,  15, -10,  20, ['FieldChain GPU Storage', 'Roshan Architecture', 'HSA* Algorithm', 'C / C++', 'CUDA', 'Vulkan', 'HPC Rendering', 'Advanced Memory Management', 'Deterministic Runtimes', 'SIMD Instructions', 'Warp Scheduling', 'Memory Coalescing', 'VRAM Allocation', 'Multithreading', 'Mutex & Spinlocks', 'Pointer Arithmetic', 'Compute Shaders', 'Vulkan Pipelines', 'Command Buffers', 'A* Search', 'BFS'], 3),
  ...createNodes('phys', 30,  20, -15,  20, ['Project TARS API', 'Quanta Thesis', 'Physics-Informed Neural Networks', 'NASA TESS Light Curves', 'Exoplanet Transit Photometry', 'Qubit SNR', 'Python', 'PyTorch', 'Tensor Operations', 'Autograd', 'Gradient Descent', 'Backpropagation', 'PDEs', 'Hilbert Space', 'Schrödinger Equation'], 3),
  ...createNodes('ai',   20, -20, -25,  20, ['Large Language Models', 'Latent Vector Spaces', 'Vector Embeddings', 'RAG', 'Agentic AI Workflows', 'Attention Mechanisms', 'Transformer Architecture', 'Cosine Similarity', 'Dimensionality Reduction', 'Vector Databases', 'Context Window Management', 'Vercel AI SDK'], 2),
  ...createNodes('web',   0, -30,  25,  20, ['Cryptic DAO Dashboard', 'Safety Pod App', 'React.js', 'Next.js', 'WebGL', 'Three.js', 'React Three Fiber', '@react-three/drei', 'Zustand State', 'Framer Motion', 'GSAP', 'UI/UX Design', 'Glassmorphism', 'GLSL', 'Fragment Shaders', 'Vertex Shaders', 'Raymarching', 'Signed Distance Fields', 'Post-Processing', 'Simplex Noise', 'Boids Flocking'], 2),
  ...createNodes('defi',-25, -20,  15,  20, ['DAO Organizations', 'DeFi Frameworks', 'Smart Contract Treasury', 'Distributed Systems Design', 'Microservices Architecture', 'WebSocket Communication', 'RESTful API Architecture'], 2)
];

// Powerful physics repulsion solver out-of-band exactly as previously built
for (let iter = 0; iter < 1500; iter++) {
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      let dx = data[i].position[0] - data[j].position[0];
      let dy = data[i].position[1] - data[j].position[1];
      let dz = data[i].position[2] - data[j].position[2];
      let dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.001;
      
      let minDist = 4.5; 
      if (dist < minDist) {
        let force = (minDist - dist) / dist * 0.15;
        if (data[i].id !== 'core-0') {
            data[i].position[0] += dx * force; data[i].position[1] += dy * force; data[i].position[2] += dz * force;
        }
        if (data[j].id !== 'core-0') {
            data[j].position[0] -= dx * force; data[j].position[1] -= dy * force; data[j].position[2] -= dz * force;
        }
      }
    }
  }
}

fs.writeFileSync('d:/portfolio-mind/src/data/knowledge-base.json', JSON.stringify(data, null, 2));
console.log('Restored expansive geometry ensuring full legibility and proper cluster spacing.');
