'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Cpu, Layers, Play, Sparkles, Code2, Database, Terminal, Wrench, Box } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import MuseumRoomHeader from './MuseumRoomHeader';

/**
 * INSTALLATION 01 — Live Interactive Three.js Sculpture
 */
function ThreeJsInstallation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const wireRef = useRef(false);

  useEffect(() => {
    wireRef.current = wireframe;
  }, [wireframe]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xf5f0e8, 0.75);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xd6c7b2, 2.2);
    dir.position.set(3, 4, 4);
    scene.add(dir);
    const blue = new THREE.PointLight(0x38bdf8, 2.0, 12);
    blue.position.set(-3, -2, 3);
    scene.add(blue);

    const knotGeo = new THREE.TorusKnotGeometry(0.95, 0.28, 110, 20);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xd6c7b2,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    const cageGeo = new THREE.IcosahedronGeometry(1.72, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xd6c7b2,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    scene.add(cage);

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let rotY = 0;
    let rotX = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      container.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * 0.015;
      rotX += (e.clientY - lastY) * 0.015;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
    };

    container.addEventListener('pointerdown', down);
    container.addEventListener('pointermove', move);
    container.addEventListener('pointerup', up);
    container.addEventListener('pointercancel', up);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      knotMat.wireframe = wireRef.current;
      if (!dragging) {
        rotY += 0.008;
        rotX += 0.004;
      }
      knot.rotation.y += (rotY - knot.rotation.y) * 0.12;
      knot.rotation.x += (rotX - knot.rotation.x) * 0.12;
      cage.rotation.y = -knot.rotation.y * 0.45;
      cage.rotation.x = knot.rotation.x * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', down);
      container.removeEventListener('pointermove', move);
      container.removeEventListener('pointerup', up);
      container.removeEventListener('pointercancel', up);
      knotGeo.dispose();
      knotMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="museum-plaque rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#d6c7b2]">
            INSTALLATION 01
          </span>
          <h3 className="font-serif text-2xl text-[#f5f0e8]">The Three.js Installation</h3>
        </div>
        <button
          type="button"
          onClick={() => setWireframe((w) => !w)}
          className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border border-[#d6c7b2]/35 bg-[#0f1013] text-[#d6c7b2] hover:bg-[#d6c7b2] hover:text-[#0f1013] transition-colors cursor-pointer"
        >
          {wireframe ? 'Solid Mesh' : 'Wireframe'}
        </button>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[210px] rounded-2xl bg-[#0b0d11] border border-[#d6c7b2]/15 cursor-grab active:cursor-grabbing touch-none overflow-hidden"
      />

      <div className="mt-4 pt-3.5 border-t border-[#d6c7b2]/12 flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#8e877c]">Drag 3D sculpture to inspect</span>
        <span className="text-[#d6c7b2]">Used in: Vertex X1 &amp; Museum</span>
      </div>
    </div>
  );
}

/**
 * INSTALLATION 02 — Interactive React Component Architecture Visualizer
 */
function ReactInstallation() {
  const { playAudioCue } = usePortfolio();
  const [selectedNode, setSelectedNode] = useState<'app' | 'context' | 'hall' | 'plaque'>('app');

  const nodeDetails: Record<
    'app' | 'context' | 'hall' | 'plaque',
    { label: string; props: string; description: string }
  > = {
    app: {
      label: '<DigitalMuseum />',
      props: 'stage="portfolio" • 7 Galleries',
      description: 'Root orchestrator mounting the 7 architectural rooms, shared context, and HUD navigation.',
    },
    context: {
      label: '<PortfolioProvider />',
      props: 'data, playAudioCue, resumeModal',
      description: 'Central React Context distributing curator profile data, Web Audio cues, and modal state.',
    },
    hall: {
      label: '<ExhibitionHall />',
      props: 'activeExhibitId, wingFilter',
      description: 'Stateful gallery stage coordinating Three.js canvas lifecycles and dynamic exhibit spotlighting.',
    },
    plaque: {
      label: '<ExhibitPlaque />',
      props: 'exhibit={project} • memoized',
      description: 'Reusable atomic presentation component rendering structured archival metadata with zero bloat.',
    },
  };

  return (
    <div className="museum-plaque rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="mb-3">
        <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#d6c7b2]">
          INSTALLATION 02
        </span>
        <h3 className="font-serif text-2xl text-[#f5f0e8]">The React Installation</h3>
      </div>

      {/* Live Interactive Component Tree Diagram */}
      <div className="rounded-2xl bg-[#0b0d11] border border-[#d6c7b2]/15 p-4 h-[210px] flex flex-col justify-between">
        <div className="flex flex-col items-center gap-2.5">
          {/* Root Node */}
          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setSelectedNode('app');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
              selectedNode === 'app'
                ? 'border-[#d6c7b2] bg-[#d6c7b2]/20 text-[#f5f0e8] shadow-[0_0_18px_rgba(214,199,178,0.28)]'
                : 'border-[#d6c7b2]/20 bg-[#141720] text-[#d5cec2]/80 hover:border-[#d6c7b2]/50'
            }`}
          >
            &lt;DigitalMuseum /&gt;
          </button>

          {/* Connecting Branches */}
          <div className="flex items-center justify-center w-48 h-3 relative">
            <div className="w-px h-full bg-[#d6c7b2]/35" />
            <div className="absolute bottom-0 inset-x-4 h-px bg-[#d6c7b2]/35" />
          </div>

          {/* Child Nodes */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {(['context', 'hall', 'plaque'] as const).map((key) => {
              const active = selectedNode === key;
              const shortLabel =
                key === 'context' ? 'Context' : key === 'hall' ? 'Hall3D' : 'Plaque';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    playAudioCue('click');
                    setSelectedNode(key);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                    active
                      ? 'border-[#38bdf8] bg-[#38bdf8]/15 text-[#f5f0e8] shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'border-[#d6c7b2]/15 bg-[#141720] text-[#d5cec2]/75 hover:border-[#d6c7b2]/45'
                  }`}
                >
                  &lt;{shortLabel} /&gt;
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Live Inspector */}
        <div className="p-2.5 rounded-xl bg-[#13161f] border border-[#d6c7b2]/12 text-[11px]">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#d6c7b2] mb-0.5">
            <span>{nodeDetails[selectedNode].label}</span>
            <span className="text-[#8e877c] truncate max-w-[140px]">
              {nodeDetails[selectedNode].props}
            </span>
          </div>
          <p className="text-[11px] text-[#d5cec2]/80 font-light leading-snug">
            {nodeDetails[selectedNode].description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#d6c7b2]/12 flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#8e877c]">Click nodes to inspect tree</span>
        <span className="text-[#d6c7b2]">Used in: PRISMIO &amp; Next.js 16</span>
      </div>
    </div>
  );
}

/**
 * INSTALLATION 03 — Interactive JavaScript & GSAP Motion Installation
 */
function JavaScriptGsapInstallation() {
  const { playAudioCue } = usePortfolio();
  const blocksRef = useRef<HTMLDivElement>(null);
  const [preset, setPreset] = useState<'wave' | 'elastic' | 'arch'>('wave');

  const runChoreography = (mode: 'wave' | 'elastic' | 'arch') => {
    playAudioCue('click');
    setPreset(mode);
    const container = blocksRef.current;
    if (!container) return;
    const boxes = Array.from(container.children);
    gsap.killTweensOf(boxes);

    if (mode === 'wave') {
      gsap.fromTo(
        boxes,
        { y: 18, scaleY: 0.6, opacity: 0.4 },
        { y: 0, scaleY: 1, opacity: 1, stagger: 0.06, duration: 0.55, ease: 'power3.out' }
      );
    } else if (mode === 'elastic') {
      gsap.fromTo(
        boxes,
        { y: -26, rotation: -18, scale: 0.7 },
        { y: 0, rotation: 0, scale: 1, stagger: 0.05, duration: 0.9, ease: 'elastic.out(1, 0.45)' }
      );
    } else {
      gsap.fromTo(
        boxes,
        { y: 24, borderRadius: '50%' },
        { y: 0, borderRadius: '8px', stagger: { each: 0.05, from: 'center' }, duration: 0.65, ease: 'expo.out' }
      );
    }
  };

  const snippetMap: Record<'wave' | 'elastic' | 'arch', string> = {
    wave: `gsap.to(pillars, { y: 0, stagger: 0.06, ease: "power3.out" });`,
    elastic: `gsap.to(pillars, { rotation: 0, ease: "elastic.out(1, 0.45)" });`,
    arch: `gsap.to(pillars, { stagger: { from: "center" }, ease: "expo.out" });`,
  };

  return (
    <div className="museum-plaque rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="mb-3">
        <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#d6c7b2]">
          INSTALLATION 03
        </span>
        <h3 className="font-serif text-2xl text-[#f5f0e8]">The JavaScript &amp; GSAP Lab</h3>
      </div>

      <div className="rounded-2xl bg-[#0b0d11] border border-[#d6c7b2]/15 p-4 h-[210px] flex flex-col justify-between">
        {/* Preset Triggers */}
        <div className="flex items-center gap-1.5">
          {(['wave', 'elastic', 'arch'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => runChoreography(m)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                preset === m
                  ? 'border-[#d6c7b2] bg-[#d6c7b2] text-[#0f1013] font-bold'
                  : 'border-[#d6c7b2]/20 bg-[#141720] text-[#d5cec2] hover:border-[#d6c7b2]/50'
              }`}
            >
              <Play className="w-2.5 h-2.5" />
              <span>{m}</span>
            </button>
          ))}
        </div>

        {/* Animated Architectural Pillars */}
        <div ref={blocksRef} className="flex items-end justify-center gap-2.5 h-20 px-2">
          {[42, 62, 78, 66, 84, 58, 46].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="w-6 rounded-lg bg-gradient-to-t from-[#d6c7b2]/25 via-[#d6c7b2]/70 to-[#ece3d4] border border-[#ece3d4]/50 shadow-[0_0_15px_rgba(214,199,178,0.2)]"
            />
          ))}
        </div>

        {/* Live Code Readout */}
        <div className="px-3 py-2 rounded-lg bg-[#13161f] border border-[#d6c7b2]/12 font-mono text-[10px] text-[#d6c7b2] truncate">
          {snippetMap[preset]}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#d6c7b2]/12 flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#8e877c]">Trigger real DOM physics</span>
        <span className="text-[#d6c7b2]">Used in: ScrollTrigger &amp; UI</span>
      </div>
    </div>
  );
}

const ARCHIVAL_TECH_WINGS = [
  {
    code: 'WING A',
    title: 'Frontend & Motion Architecture',
    icon: Layers,
    technologies: ['React', 'Next.js 16', 'JavaScript (ES6+)', 'TypeScript', 'HTML5 & CSS3', 'Tailwind CSS', 'Three.js', 'GSAP'],
    demonstratedIn: 'Vertex Phone X1 3D Prototype, The Digital Museum, CodSoft Web Suite',
  },
  {
    code: 'WING B',
    title: 'Core Languages & Algorithms',
    icon: Code2,
    technologies: ['Java (Core & OOP)', 'Data Structures & Algorithms', 'Python', 'C / C++', 'Theory of Computation'],
    demonstratedIn: 'J.A.R.V.I.S Voice Assistant, NPTEL TOC Certification, DSA Problem Solving',
  },
  {
    code: 'WING C',
    title: 'Backend & Database Systems',
    icon: Database,
    technologies: ['Node.js', 'Express.js', 'RESTful APIs', 'MongoDB', 'SQL', 'Postman API Testing'],
    demonstratedIn: 'CodSoft Full-Stack Web Apps, MERN Stack Workshop, API Micro-Integrations',
  },
  {
    code: 'WING D',
    title: 'Engineering Tooling & Hardware',
    icon: Wrench,
    technologies: ['Git & GitHub', 'Vite Build Pipeline', 'Vercel Cloud', 'VS Code', 'Internet of Things (IoT)'],
    demonstratedIn: 'PRISMIO Production Deployments, NPTEL IoT Certification, Robotics Labs',
  },
];

export default function TechnologyGallery() {
  return (
    <section
      id="technology-gallery"
      className="relative py-28 sm:py-36 px-4 sm:px-8 border-t border-[#d6c7b2]/10 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/30 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <MuseumRoomHeader
          roomNumber="03"
          wingLabel="TECHNOLOGY GALLERY"
          title="Interactive"
          accentWord="Installations"
          accentTone="cyan"
          subtitle="Instead of arbitrary percentage bars, every core technology is exhibited as a live interactive installation paired with the real engineering works that demonstrate it."
        />

        {/* 3 Live Interactive Museum Installations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          <ThreeJsInstallation />
          <ReactInstallation />
          <JavaScriptGsapInstallation />
        </div>

        {/* Full Architectural Technology Vitrines (Evidence-backed, Zero Percentage Bars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARCHIVAL_TECH_WINGS.map((wing) => {
            const IconComp = wing.icon;
            return (
              <div
                key={wing.code}
                className="museum-plaque rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:border-[#d6c7b2]/45 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase bg-[#0f1013] border border-[#d6c7b2]/25 text-[#d6c7b2]">
                      {wing.code}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/20 flex items-center justify-center text-[#d6c7b2]">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="font-serif text-2xl text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors mb-4">
                    {wing.title}
                  </h4>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {wing.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#0f1013] border border-[#d6c7b2]/15 text-[#f5f0e8]/90 hover:border-[#d6c7b2]/45 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#d6c7b2]/12 flex items-start gap-2.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#d6c7b2] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono uppercase tracking-wider text-[10px] text-[#8e877c] block">
                      Demonstrated In
                    </span>
                    <span className="text-[#d5cec2]/90 font-light">{wing.demonstratedIn}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

