// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Html, Stars, Sphere, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore, PortfolioNode } from '@/store/useStore';
import { BackgroundDust } from './BackgroundDust';
import { useFrame, useThree } from '@react-three/fiber';

function CameraFlyController() {
  const controlsRef = useRef<CameraControls>(null);
  const activeNodeId = useStore((state) => state.activeNodeId);
  const nodes = useStore((state) => state.nodes);

  useEffect(() => {
    if (activeNodeId && controlsRef.current) {
      const node = nodes.find(n => n.id === activeNodeId);
      if (node) {
        const [x, y, z] = node.position;
        // Keep a wider, cinematic orbital distance from the selected node
        controlsRef.current.setLookAt(x + 14, y + 6, z + 14, x, y, z, true);
      }
    } else if (controlsRef.current && !activeNodeId) {
      // Return identically to overview if unselected
      controlsRef.current.setLookAt(0, 0, 25, 0, 0, 0, true);
    }
  }, [activeNodeId, nodes]);

  return <CameraControls ref={controlsRef} makeDefault dampingFactor={0.05} minDistance={2} maxDistance={80} />;
}

// Core Level 0: The Quantum Vortex
function QuantumVortex({ size, isDimmed, count = 3000 }: { size: number, isDimmed: boolean, count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const [positions] = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       const phi = Math.acos(1 - 2 * Math.random());
       const theta = Math.random() * 2 * Math.PI;
       const r = size * Math.cbrt(Math.random()); 
       p[i*3] = r * Math.sin(phi) * Math.cos(theta);
       p[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
       p[i*3+2] = r * Math.cos(phi);
    }
    return [p];
  }, [size, count]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.4;
      groupRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#ffffff" transparent opacity={isDimmed ? 0.4 : 0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <mesh>
        <icosahedronGeometry args={[size * 0.9, 1]} />
        <meshBasicMaterial color="#00ffcc" wireframe transparent opacity={isDimmed ? 0.15 : 0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// Hubs Level 1: Energy Orbs (Optical Sprites)
function EnergyOrb({ color, size, isDimmed, isFocused }: { color: string, size: number, isDimmed: boolean, isFocused: boolean }) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.9)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.4)');
      gradient.addColorStop(0.8, 'rgba(255,255,255,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Don't hide others, just make the focused node dramatically pop
  const opacity = isDimmed ? 0.5 : (isFocused ? 1.0 : 0.8);
  const finalSize = isFocused ? size * 5.5 : size * 4;

  return (
    <sprite scale={[finalSize, finalSize, 1]}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  );
}

// Outer Nodes Level 2+: Razor-Sharp Diamonds
function RazorDiamond({ color, size, isDimmed, isFocused }: { color: string, size: number, isDimmed: boolean, isFocused: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.x += delta * 0.4;
    }
  });

  // Keep background visible but amplify the selected node
  const baseOpacity = isDimmed ? 0.5 : (isFocused ? 1.0 : 0.9);
  const glowOpacity = isDimmed ? 0.15 : (isFocused ? 0.8 : 0.3);

  return (
    <mesh ref={meshRef} scale={isFocused ? 2.0 : 1.0}>
      <octahedronGeometry args={[size, 0]} />
      <meshBasicMaterial color={color} wireframe={false} transparent opacity={baseOpacity} blending={THREE.AdditiveBlending} depthWrite={false} />
      <mesh scale={1.3}>
         <octahedronGeometry args={[size, 0]} />
         <meshBasicMaterial color={color} wireframe transparent opacity={glowOpacity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </mesh>
  );
}

const SingleNode = forwardRef(({ node, isMobile }: { node: PortfolioNode, isMobile: boolean }, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowingNodeIds = useStore((state) => state.glowingNodeIds);
  const setActiveNode = useStore((state) => state.setActiveNode);
  const activeNodeId = useStore((state) => state.activeNodeId);
  const attentionCluster = useStore((state) => state.attentionCluster);

  useImperativeHandle(ref, () => groupRef.current);

  const isQuery = node.type === 'query';
  const isGlowing = glowingNodeIds.includes(node.id);
  const isCoreIdentity = node.id === 'core' || node.level === 0;

  // Cluster dimming logic
  const isFocused = activeNodeId ? attentionCluster.includes(node.id) : false;
  const isDimmed = activeNodeId !== null && !isFocused;

  useEffect(() => {
    if (!groupRef.current) return;

    if (!isQuery && !isCoreIdentity) {
      const [tx, ty, tz] = node.position;
      groupRef.current.position.set(0, 0, 0); 

      const dist = Math.sqrt(tx * tx + ty * ty + tz * tz);
      const rippleDelay = (dist * 0.25);

      gsap.to(groupRef.current.position, {
        x: tx, y: ty, z: tz,
        duration: 8.0,
        ease: "power2.out",
        delay: rippleDelay + 0.5
      });
    } else if (isCoreIdentity) {
      groupRef.current.position.set(0, 0, 0);
    } else if (isQuery) {
      groupRef.current.position.set(node.position[0], node.position[1], node.position[2]);
      groupRef.current.scale.set(0, 0, 0);
      const tl = gsap.timeline();
      tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "elastic.out(1, 0.3)" })
        .to(groupRef.current.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }
  }, []);

  let color = isQuery ? "#00ffcc" : "#3b82f6";
  if (isGlowing) color = "#ff00dd";
  if (node.level === 2 && !isGlowing) color = "#a855f7"; 
  if (node.level === 3 && !isGlowing) color = "#ec4899"; 
  if (isCoreIdentity) color = "#ffffff";
  if (isFocused && activeNodeId) color = "#00ffff"; // Super bright cyan for cluster spotlight

  const htmlYOffset = isCoreIdentity ? -3.5 : (node.level === 1 ? -1.8 : -1.0);
  const htmlOpacity = isDimmed ? 0.4 : 1.0;

  // Keep background instances fully visible and interactive while maintaining visual hierarchy
  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        if (activeNodeId === node.id) {
           setActiveNode(null); // click again to clear
        } else {
           setActiveNode(node.id);
        }
      }}
      onPointerOver={() => {
        if (!isDimmed) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {isCoreIdentity && <QuantumVortex size={1.8} isDimmed={isDimmed} count={isMobile ? 1200 : 3000} />}
      {(node.level === 1) && <EnergyOrb color={color} size={1.2} isDimmed={isDimmed} isFocused={isFocused && activeNodeId !== null} />}
      {(node.level !== undefined && node.level >= 2 || isQuery) && <RazorDiamond color={color} size={isQuery ? 0.8 : 0.4} isDimmed={isDimmed} isFocused={isFocused && activeNodeId !== null} />}

      <Html 
        center 
        position={[0, htmlYOffset, 0]} 
        zIndexRange={[100, 0]} 
        distanceFactor={isMobile 
          ? (isCoreIdentity ? 45 : (node.level === 1 ? 35 : 25)) 
          : (isCoreIdentity ? 35 : (node.level === 1 ? 25 : 15))
        }
      >
        <div
          className="pointer-events-none select-none text-center transition-opacity duration-300"
          style={{
            opacity: htmlOpacity,
            color: isCoreIdentity ? '#ffffff' : (isQuery ? '#00ffcc' : 'white'),
            fontSize: isMobile 
              ? (isCoreIdentity ? '22px' : (node.level === 1 ? '13px' : '9px'))
              : (isCoreIdentity ? '42px' : (node.level === 1 ? '20px' : '11px')),
            fontWeight: isCoreIdentity || isQuery || isFocused ? '900' : '500',
            letterSpacing: isMobile && isCoreIdentity ? '0.05em' : (isCoreIdentity ? '0.15em' : '0.05em'),
            textShadow: isCoreIdentity ? '0px 0px 15px rgba(255,255,255,0.8), 0px 2px 4px rgba(0,0,0,0.9), 0px 0px 30px rgba(0,0,0,1)' : '0px 2px 4px rgba(0,0,0,0.9), 0px 0px 8px rgba(0,0,0,1), 0px 0px 25px rgba(0,0,0,1)',
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
            textTransform: isCoreIdentity ? 'uppercase' : 'none'
          }}
        >
          {isCoreIdentity ? "ROSHAN KUMAR GUPTA" : node.title}
        </div>
      </Html>
    </group>
  );
});
SingleNode.displayName = 'SingleNode';

function DynamicEdges({ nodeRefs }) {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const activeNodeId = useStore((state) => state.activeNodeId);
  const attentionCluster = useStore((state) => state.attentionCluster);
  
  const lineGeo = useMemo(() => new THREE.BufferGeometry(), []);
  const matRef = useRef<THREE.LineDashedMaterial>(null);
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);

  const activeEdges = useMemo(() => {
    if (!activeNodeId) return edges;
    return edges.filter(e => attentionCluster.includes(e.source) && attentionCluster.includes(e.target));
  }, [edges, activeNodeId, attentionCluster]);

  useEffect(() => {
    const positions = new Float32Array(activeEdges.length * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [activeEdges, lineGeo]);

  useFrame((state, delta) => {
    if (matRef.current && activeNodeId) {
      // Data flowing animation effect continuously running
      matRef.current.dashOffset -= delta * 2;
    }

    const refs = nodeRefs.current;
    if (!refs) return;
    const positionAttr = lineGeo.attributes.position;
    if (!positionAttr) return;
    const positions = positionAttr.array;
    let idx = 0;

    activeEdges.forEach((edge) => {
      const sIdx = nodes.findIndex(n => n.id === edge.source);
      const tIdx = nodes.findIndex(n => n.id === edge.target);

      if (sIdx !== -1 && tIdx !== -1 && refs[sIdx] && refs[tIdx]) {
        const p1 = refs[sIdx].position;
        const p2 = refs[tIdx].position;
        positions[idx++] = p1.x; positions[idx++] = p1.y; positions[idx++] = p1.z;
        positions[idx++] = p2.x; positions[idx++] = p2.y; positions[idx++] = p2.z;
      }
    });
    positionAttr.needsUpdate = true;
    if (lineSegmentsRef.current) {
      lineSegmentsRef.current.computeLineDistances();
    }
  });

  return (
    <lineSegments ref={lineSegmentsRef} geometry={lineGeo}>
      {activeNodeId ? (
         <lineDashedMaterial 
            ref={matRef} 
            color="#00ffff" 
            transparent 
            opacity={0.8} 
            dashSize={0.5} 
            gapSize={0.5} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
      ) : (
         <lineBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
      )}
    </lineSegments>
  );
}

function NodeCluster({ isMobile }: { isMobile: boolean }) {
  const nodes = useStore((state) => state.nodes);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const { camera } = useThree();

  useFrame(() => {
    const refs = nodeRefs.current;
    if (!refs) return;
    const len = refs.length;

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const posA = new THREE.Vector3();
    const posB = new THREE.Vector3();

    for (let i = 0; i < len; i++) {
      if (!refs[i]) continue;
      const isCoreI = nodes[i].id === 'core';
      posA.copy(refs[i].position);

      if (isCoreI) {
        refs[i].position.set(0, 0, 0);
      } else {
        const target = nodes[i].position;
        const dx = target[0] - posA.x;
        const dy = target[1] - posA.y;
        const dz = target[2] - posA.z;
        refs[i].position.x += dx * 0.05;
        refs[i].position.y += dy * 0.05;
        refs[i].position.z += dz * 0.05;
      }

      for (let j = i + 1; j < len; j++) {
        if (!refs[j]) continue;
        const isCoreJ = nodes[j].id === 'core';
        posB.copy(refs[j].position);

        const diff = new THREE.Vector3().subVectors(posA, posB);
        const pX = diff.dot(right);
        const pY = diff.dot(up);
        const screenDistSq = pX * pX + pY * pY;

        const minVisualSeparation = 4.0;

        if (screenDistSq < minVisualSeparation * minVisualSeparation && screenDistSq > 0.001) {
          const screenDist = Math.sqrt(screenDistSq);
          const force = (minVisualSeparation - screenDist) / screenDist * 0.15;

          const pushX = pX * force;
          const pushY = pY * force;

          if (!isCoreI) {
            refs[i].position.addScaledVector(right, pushX);
            refs[i].position.addScaledVector(up, pushY);
          }
          if (!isCoreJ) {
            refs[j].position.addScaledVector(right, -pushX);
            refs[j].position.addScaledVector(up, -pushY);
          }
        }
      }
    }
  });

  return (
    <group>
      <DynamicEdges nodeRefs={nodeRefs} />
      {nodes.map((node, i) => (
        <SingleNode
          key={node.id}
          node={node}
          isMobile={isMobile}
          ref={(el) => { nodeRefs.current[i] = el; }}
        />
      ))}
    </group>
  );
}

export function LatentSpace() {
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);

  return (
    <>
      <fog attach="fog" args={['#020205', 10, 65]} />
      <ambientLight intensity={0.1} />
      <BackgroundDust count={isMobile ? 2500 : 10000} />
      <Stars 
        radius={50} 
        depth={50} 
        count={isMobile ? 1000 : 3000} 
        factor={isMobile ? 4 : 6} 
        fade 
        speed={1} 
      />
      <NodeCluster isMobile={isMobile} />
      {/* Dynamic Camera Hijacking based on Global Click Listeners */}
      <CameraFlyController />
    </>
  );
}
