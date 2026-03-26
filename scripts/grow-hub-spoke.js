const fs = require('fs');
const path = require('path');

const dataRaw = [
  // L0
  { id: "core", label: "Roshan Kumar Gupta", type: "project", parentId: null, level: 0 },
  // L1
  { id: "cat_edu", label: "Education & Identity", type: "project", parentId: "core", level: 1 },
  { id: "cat_exp", label: "Experience & Milestones", type: "project", parentId: "core", level: 1 },
  { id: "cat_proj", label: "Architectural Projects", type: "project", parentId: "core", level: 1 },
  { id: "cat_skills", label: "Core Technical Skills", type: "project", parentId: "core", level: 1 },
  // L2 - Projects
  { id: "proj_fieldchain", label: "FieldChain GPU Storage", type: "project", parentId: "cat_proj", level: 2 },
  { id: "proj_roshan_arch", label: "Roshan Architecture", type: "project", parentId: "cat_proj", level: 2 },
  { id: "proj_tars", label: "Project TARS API", type: "project", parentId: "cat_proj", level: 2 },
  { id: "proj_quanta", label: "QUANTA Thesis", type: "project", parentId: "cat_proj", level: 2 },
  { id: "proj_cryptic", label: "Cryptic DAO Dashboard", type: "project", parentId: "cat_proj", level: 2 },
  { id: "proj_safety", label: "Safety Pod App", type: "project", parentId: "cat_proj", level: 2 },
  // L2 - Skills
  { id: "skill_sys", label: "High-Performance Systems", type: "skill", parentId: "cat_skills", level: 2 },
  { id: "skill_physics", label: "Physics-Constrained ML", type: "skill", parentId: "cat_skills", level: 2 },
  { id: "skill_ai", label: "AI Infrastructure", type: "skill", parentId: "cat_skills", level: 2 },
  { id: "skill_web", label: "Web & UI Architecture", type: "skill", parentId: "cat_skills", level: 2 },
  // L2 - Edu/Exp
  { id: "edu_btech", label: "B.Tech Computer Science", type: "skill", parentId: "cat_edu", level: 2 },
  { id: "edu_uni", label: "Chandigarh University", type: "skill", parentId: "cat_edu", level: 2 },
  { id: "exp_lt", label: "L&T Intern", type: "skill", parentId: "cat_exp", level: 2 },
  { id: "award_ev", label: "Emergent Ventures Grantee", type: "skill", parentId: "cat_exp", level: 2 },
  // L3 - Micro Concepts
  { id: "concept_cuda", label: "CUDA Multi-Threading", type: "skill", parentId: "proj_fieldchain", level: 3 },
  { id: "concept_pcie", label: "PCIe 4.0 Streaming", type: "skill", parentId: "proj_fieldchain", level: 3 },
  { id: "sys_memory", label: "Advanced Memory Mgmt", type: "skill", parentId: "proj_roshan_arch", level: 3 },
  { id: "sys_deterministic", label: "Deterministic Runtimes", type: "skill", parentId: "proj_roshan_arch", level: 3 },
  { id: "data_tess", label: "NASA TESS Light Curves", type: "skill", parentId: "proj_tars", level: 3 },
  { id: "concept_exoplanet", label: "Exoplanet Iterations", type: "skill", parentId: "proj_tars", level: 3 },
  { id: "concept_simd", label: "SIMD Instructions", type: "skill", parentId: "skill_sys", level: 3 },
  { id: "concept_warp", label: "Warp Scheduling", type: "skill", parentId: "skill_sys", level: 3 },
  { id: "concept_cpp", label: "C / C++", type: "skill", parentId: "skill_sys", level: 3 },
  { id: "concept_vulkan", label: "Vulkan Pipelines", type: "skill", parentId: "skill_sys", level: 3 },
  { id: "concept_pytorch", label: "PyTorch", type: "skill", parentId: "skill_physics", level: 3 },
  { id: "concept_tensors", label: "Tensor Operations", type: "skill", parentId: "skill_physics", level: 3 },
  { id: "concept_backprop", label: "Backpropagation", type: "skill", parentId: "skill_physics", level: 3 },
  { id: "concept_pinns", label: "Physics-Informed NNs", type: "skill", parentId: "skill_physics", level: 3 },
  { id: "concept_llm", label: "Large Language Models", type: "skill", parentId: "skill_ai", level: 3 },
  { id: "concept_rag", label: "RAG Architecture", type: "skill", parentId: "skill_ai", level: 3 },
  { id: "concept_vector", label: "Vector Embeddings", type: "skill", parentId: "skill_ai", level: 3 },
  { id: "concept_react", label: "React.js", type: "skill", parentId: "skill_web", level: 3 },
  { id: "concept_webgl", label: "WebGL", type: "skill", parentId: "skill_web", level: 3 },
  { id: "concept_three", label: "Three.js", type: "skill", parentId: "skill_web", level: 3 }
];

const nodes = [];
const edges = [];

function crossProduct(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}
function normalize(v) {
  const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  if (len === 0) return [0,0,1];
  return [v[0]/len, v[1]/len, v[2]/len];
}
function addScale(p, v, s) {
  return [p[0] + v[0]*s, p[1] + v[1]*s, p[2] + v[2]*s];
}

const l0 = dataRaw.find(d => d.level === 0);
l0.position = [0, 0, 0];
nodes.push({ id: l0.id, title: l0.label, type: l0.type, level: 0, parentId: null, description: "Synthesis Core Vector", position: l0.position });

// Transform flat 2D categories into a pure, majestic 3D Tetrahedron bursting outwards globally!
const l1s = dataRaw.filter(d => d.level === 1);
const tetrahedronPoints = [
  [1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]
];
l1s.forEach((l1, i) => {
  const radius = 6; // Pulled extremely tight based on user request!
  const factor = radius / Math.sqrt(3);
  l1.position = [
    tetrahedronPoints[i][0] * factor, 
    tetrahedronPoints[i][1] * factor, 
    tetrahedronPoints[i][2] * factor
  ];
  nodes.push({ id: l1.id, title: l1.label, type: l1.type, level: 1, parentId: l1.parentId || "core", description: "Category Primary Hub", position: l1.position });
  edges.push({ source: l1.id, target: l0.id, opacity: 0.3 });
});

[2, 3].forEach(level => {
  const items = dataRaw.filter(d => d.level === level);
  items.forEach(item => {
    const parent = dataRaw.find(d => d.id === item.parentId);
    const cp = [parent.position[0], parent.position[1], parent.position[2]];
    const u = normalize(cp);
    let temp = [0, 0, 1];
    if (Math.abs(u[2]) > 0.9) temp = [0, 1, 0];
    const v1 = normalize(crossProduct(temp, u));
    const v2 = crossProduct(u, v1);
    
    // Apply explosive massive 3D conic spreading so nodes beautifully surround their Hub
    const degToRad = Math.PI / 180;
    const fanAngle = (20 + Math.random() * 40) * degToRad; // Fanning deeply outward in a full cone!
    const spinAngle = Math.random() * 2 * Math.PI; 
    
    const ux = Math.cos(fanAngle) * u[0] + Math.sin(fanAngle) * Math.cos(spinAngle) * v1[0] + Math.sin(fanAngle) * Math.sin(spinAngle) * v2[0];
    const uy = Math.cos(fanAngle) * u[1] + Math.sin(fanAngle) * Math.cos(spinAngle) * v1[1] + Math.sin(fanAngle) * Math.sin(spinAngle) * v2[1];
    const uz = Math.cos(fanAngle) * u[2] + Math.sin(fanAngle) * Math.cos(spinAngle) * v1[2] + Math.sin(fanAngle) * Math.sin(spinAngle) * v2[2];
    
    const pushDist = level === 2 ? 9 : 5; // Extremely dense tracking!
    item.position = addScale(parent.position, [ux, uy, uz], pushDist);
    nodes.push({ id: item.id, title: item.label, type: item.type, level: level, parentId: item.parentId, description: `Level ${level} Concept`, position: item.position });
    edges.push({ source: item.id, target: parent.id, opacity: level === 2 ? 0.2 : 0.08 });
  });
});

for (let iter = 0; iter < 1500; iter++) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dx = nodes[i].position[0] - nodes[j].position[0];
      let dy = nodes[i].position[1] - nodes[j].position[1];
      let dz = nodes[i].position[2] - nodes[j].position[2];
      let dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.001;
      
      let minDist = 2.5; 
      if (dist < minDist) {
        let force = (minDist - dist) / dist * 0.15;
        if (nodes[i].id !== 'core') {
            nodes[i].position[0] += dx * force; nodes[i].position[1] += dy * force; nodes[i].position[2] += dz * force;
        }
        if (nodes[j].id !== 'core') {
            nodes[j].position[0] -= dx * force; nodes[j].position[1] -= dy * force; nodes[j].position[2] -= dz * force;
        }
      }
    }
  }
}

const outputDir = path.join(__dirname, '../src/data');
fs.writeFileSync(path.join(outputDir, 'knowledge-base.json'), JSON.stringify({ nodes, edges }, null, 2));
console.log(`True 3D Hub-and-Spoke successfully mapped with Tetrahedron structural logic!`);
