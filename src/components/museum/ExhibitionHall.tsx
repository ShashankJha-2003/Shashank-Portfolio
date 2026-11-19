'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ExternalLink, Sparkles, ArrowUpRight, MoveHorizontal, CheckCircle2, Layers, Sun, Moon } from 'lucide-react';
import { GithubIcon } from '../SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import MuseumRoomHeader from './MuseumRoomHeader';
import ProjectDemoPanel, { ProjectDemoKey } from './ProjectDemoPanel';

/**
 * Live interactive Three.js 3D sculpture of the VERTEX PHONE X1 prototype.
 * Renders directly inside the Exhibition Hall centrepiece pedestal.
 */
function VertexPhone3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 6.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Architectural Museum Lighting
    const ambient = new THREE.AmbientLight(0xf5f0e8, 0.7);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffe8c8, 2.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.4, 15);
    rimLight.position.set(-3.5, 2.2, 2.5);
    scene.add(rimLight);

    const warmUnderLight = new THREE.PointLight(0xd6c7b2, 1.8, 12);
    warmUnderLight.position.set(2.5, -2.5, 2);
    scene.add(warmUnderLight);

    // Group representing the Vertex Phone X1
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Brushed Titanium Chassis
    const chassisGeo = new THREE.BoxGeometry(1.75, 3.55, 0.18);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e222b,
      metalness: 0.88,
      roughness: 0.22,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    phoneGroup.add(chassis);

    // Warm Champagne Bezel Rim
    const rimGeo = new THREE.BoxGeometry(1.81, 3.61, 0.14);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd6c7b2,
      metalness: 0.92,
      roughness: 0.18,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    phoneGroup.add(rim);

    // OLED Display Glass (Front)
    const screenGeo = new THREE.PlaneGeometry(1.62, 3.38);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const sctx = screenCanvas.getContext('2d');
    if (sctx) {
      const grad = sctx.createLinearGradient(0, 0, 512, 1024);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.45, '#132238');
      grad.addColorStop(1, '#0f1013');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 512, 1024);

      // Luminous architectural ring graphic on phone screen
      sctx.strokeStyle = 'rgba(214, 199, 178, 0.75)';
      sctx.lineWidth = 4;
      sctx.beginPath();
      sctx.arc(256, 460, 140, 0, Math.PI * 2);
      sctx.stroke();

      sctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      sctx.lineWidth = 2;
      sctx.beginPath();
      sctx.arc(256, 460, 105, 0, Math.PI * 2);
      sctx.stroke();

      sctx.fillStyle = '#f5f0e8';
      sctx.font = 'bold 46px sans-serif';
      sctx.textAlign = 'center';
      sctx.fillText('VERTEX X1', 256, 455);

      sctx.fillStyle = '#d6c7b2';
      sctx.font = '22px monospace';
      sctx.fillText('EXHIBIT 001 • 3D PROTOTYPE', 256, 505);

      sctx.fillStyle = 'rgba(255,255,255,0.5)';
      sctx.font = '18px monospace';
      sctx.fillText('THREE.JS × GSAP', 256, 860);
    }
    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      roughness: 0.12,
      metalness: 0.25,
      emissive: new THREE.Color(0x16253a),
      emissiveIntensity: 0.55,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.095;
    phoneGroup.add(screen);

    // Back Camera Module Housing
    const camHousingGeo = new THREE.BoxGeometry(0.75, 0.85, 0.06);
    const camHousingMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      metalness: 0.85,
      roughness: 0.25,
    });
    const camHousing = new THREE.Mesh(camHousingGeo, camHousingMat);
    camHousing.position.set(0.35, 1.05, -0.11);
    phoneGroup.add(camHousing);

    // Triple Camera Lenses
    const lensGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 24);
    const lensRingMat = new THREE.MeshStandardMaterial({ color: 0xd6c7b2, metalness: 0.95, roughness: 0.15 });
    const lensPositions: [number, number][] = [
      [0.18, 1.24],
      [0.18, 0.88],
      [0.52, 1.06],
    ];
    lensPositions.forEach(([lx, ly]) => {
      const lens = new THREE.Mesh(lensGeo, lensRingMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(lx, ly, -0.145);
      phoneGroup.add(lens);
    });

    // Floating Museum Pedestal Rings underneath
    const ringGeo = new THREE.TorusGeometry(1.45, 0.014, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd6c7b2, transparent: true, opacity: 0.45 });
    const pedestalRing = new THREE.Mesh(ringGeo, ringMat);
    pedestalRing.rotation.x = Math.PI / 2;
    pedestalRing.position.y = -2.15;
    scene.add(pedestalRing);

    // Interactive Drag Rotation
    let isDragging = false;
    let prevX = 0;
    let targetRotY = 0.35;
    let currentRotY = 0.35;
    let targetRotX = 0.08;
    let currentRotX = 0.08;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      container.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      targetRotY += dx * 0.012;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;
      if (!isDragging) {
        targetRotY += 0.0055;
      }
      currentRotY += (targetRotY - currentRotY) * 0.09;
      currentRotX += (targetRotX - currentRotX) * 0.09;

      phoneGroup.rotation.y = currentRotY;
      phoneGroup.rotation.x = currentRotX + Math.sin(elapsed * 1.1) * 0.04;
      phoneGroup.position.y = Math.sin(elapsed * 1.4) * 0.1;
      pedestalRing.rotation.z = elapsed * 0.25;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 380;
      const nh = container.clientHeight || 360;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      chassisGeo.dispose();
      chassisMat.dispose();
      rimGeo.dispose();
      rimMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTex.dispose();
      camHousingGeo.dispose();
      camHousingMat.dispose();
      lensGeo.dispose();
      lensRingMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] flex items-center justify-center">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0f1013]/85 border border-[#d6c7b2]/25 text-[10px] font-mono tracking-widest uppercase text-[#d6c7b2] flex items-center gap-1.5">
        <MoveHorizontal className="w-3 h-3" />
        <span>Drag to Inspect 3D Prototype</span>
      </div>
    </div>
  );
}

const PROJECT_ID_TO_DEMO_KEY: Record<string, ProjectDemoKey> = {
  'project-1': 'project-vertex',
  'project-2': 'project-jarvis',
  'project-3': 'project-codsoft-portfolio',
  'project-4': 'project-netflix',
  'project-5': 'project-calculator',
};

export default function ExhibitionHall() {
  const { data, playAudioCue } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProjectId, setActiveProjectId] = useState<string>(data.projects[0]?.id || 'project-1');
  const [whiteWalls, setWhiteWalls] = useState<boolean>(true);

  const categories = ['All', 'Creative & 3D', 'Full-Stack', 'AI & Cloud'];

  const filteredProjects =
    selectedCategory === 'All'
      ? data.projects
      : data.projects.filter((p) => p.category === selectedCategory);

  const activeProject: Project =
    data.projects.find((p) => p.id === activeProjectId) || filteredProjects[0] || data.projects[0];

  const activeExhibitNum = String(
    Math.max(1, data.projects.findIndex((p) => p.id === activeProject?.id) + 1)
  ).padStart(3, '0');

  const activeDemoKey: ProjectDemoKey = PROJECT_ID_TO_DEMO_KEY[activeProject?.id || 'project-1'] || 'project-vertex';

  return (
    <section
      id="exhibition-hall"
      className={`relative py-28 sm:py-36 px-4 sm:px-8 border-t overflow-hidden transition-colors duration-500 ${
        whiteWalls
          ? 'bg-[#f4f2ec] text-stone-900 border-stone-300'
          : 'border-[#d6c7b2]/10 text-[#f5f0e8]'
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
          whiteWalls ? 'via-stone-400/60' : 'via-[#d6c7b2]/40'
        } to-transparent`}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top White-Wall Light Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className={whiteWalls ? '[&_h2]:!text-stone-900 [&_p]:!text-stone-600 [&_span]:!text-emerald-700' : ''}>
            <MuseumRoomHeader
              roomNumber="02"
              wingLabel="EXHIBITION HALL — PROJECTS & LIVE DEMOS"
              title="Curated"
              accentWord="Exhibits"
              subtitle="Explore every shipped project on bright white gallery walls—complete with interactive live demos, GitHub repositories, and live links."
            />
          </div>

          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setWhiteWalls((w) => !w);
            }}
            className={`self-start shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-sm ${
              whiteWalls
                ? 'bg-white border-stone-300 text-stone-900 hover:border-stone-500'
                : 'bg-[#161922] border-[#d6c7b2]/35 text-[#d6c7b2] hover:border-[#d6c7b2]'
            }`}
          >
            {whiteWalls ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-[#d6c7b2]" />}
            <span>{whiteWalls ? 'White Walls: ON' : 'Dark Gallery'}</span>
          </button>
        </div>

        {/* =============================================================== */}
        {/* ILLUMINATED CENTREPIECE STAGE (Active Selected Exhibit)         */}
        {/* =============================================================== */}
        {activeProject && (
          <div
            className={`relative rounded-[2rem] p-6 sm:p-10 mb-14 overflow-hidden transition-all duration-500 ${
              whiteWalls
                ? 'bg-white border border-stone-300/90 shadow-[0_24px_70px_rgba(24,24,27,0.08)]'
                : 'museum-plaque'
            }`}
          >
            {!whiteWalls && (
              <div className="pointer-events-none absolute -top-24 left-1/4 w-[480px] h-72 bg-[radial-gradient(ellipse_at_top,rgba(214,199,178,0.18)_0%,transparent_70%)] blur-2xl" />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Stage: Live 3D Prototype for Vertex X1 OR Framed Gallery Visual + Live Interactive Demo */}
              <div className="lg:col-span-6 space-y-5">
                <div
                  className={`relative rounded-2xl overflow-hidden border ${
                    whiteWalls
                      ? 'bg-[#101319] border-stone-300 shadow-lg'
                      : 'bg-[#0b0d11] border-[#d6c7b2]/20 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]'
                  }`}
                >
                  <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.22em] uppercase bg-[#0f1013]/90 border border-[#d6c7b2]/40 text-[#d6c7b2] font-bold">
                      EXHIBIT {activeExhibitNum}
                    </span>
                    {activeProject.id === 'project-1' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#7dd3fc] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Live 3D Stage
                      </span>
                    )}
                  </div>

                  {activeProject.id === 'project-1' ? (
                    <VertexPhone3DCanvas />
                  ) : (
                    <div className="relative w-full h-[300px] sm:h-[340px] overflow-hidden group">
                      {activeProject.image ? (
                        <img
                          src={activeProject.image}
                          alt={activeProject.title}
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers className="w-12 h-12 text-[#d6c7b2]/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-transparent to-black/25" />
                    </div>
                  )}
                </div>

                {/* Interactive Live Demo + GitHub & Live Project Links */}
                <ProjectDemoPanel
                  demoKey={activeDemoKey}
                  liveUrl={activeProject.liveUrl}
                  githubUrl={activeProject.githubUrl}
                  lightTheme={whiteWalls}
                  onActionClick={() => playAudioCue('click')}
                />
              </div>

              {/* Right Stage: Curatorial Story + Formal Museum Information Plaque */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div
                    className={`text-[11px] font-mono tracking-[0.22em] uppercase mb-2 font-semibold ${
                      whiteWalls ? 'text-emerald-700' : 'text-[#d6c7b2]'
                    }`}
                  >
                    NOW ILLUMINATED // EXHIBIT {activeExhibitNum}
                  </div>
                  <h3
                    className={`font-serif text-3xl sm:text-4xl font-light leading-tight mb-2 ${
                      whiteWalls ? 'text-stone-900' : 'text-[#f5f0e8]'
                    }`}
                  >
                    {activeProject.title}
                  </h3>
                  <p className={`text-xs font-mono mb-4 ${whiteWalls ? 'text-stone-500' : 'text-[#d6c7b2]/85'}`}>
                    {activeProject.tagline}
                  </p>
                  <p
                    className={`text-sm font-light leading-relaxed mb-6 ${
                      whiteWalls ? 'text-stone-700' : 'text-[#d5cec2]/85'
                    }`}
                  >
                    {activeProject.description}
                  </p>

                  {/* Formal Museum Information Plaque Table */}
                  <div
                    className={`rounded-2xl border overflow-hidden mb-6 ${
                      whiteWalls ? 'bg-stone-50 border-stone-200' : 'bg-[#0f1013]/95 border-[#d6c7b2]/20'
                    }`}
                  >
                    <div
                      className={`px-4 py-2 border-b flex items-center justify-between ${
                        whiteWalls ? 'bg-stone-100 border-stone-200' : 'bg-[#161922] border-[#d6c7b2]/15'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono tracking-[0.24em] uppercase font-semibold ${
                          whiteWalls ? 'text-stone-700' : 'text-[#d6c7b2]'
                        }`}
                      >
                        EXHIBITION INFORMATION PLAQUE
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">ARCHIVE #{activeExhibitNum}</span>
                    </div>
                    <div className={`divide-y text-xs font-mono ${whiteWalls ? 'divide-stone-200' : 'divide-[#d6c7b2]/10'}`}>
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <span className="text-stone-500 uppercase">Category</span>
                        <span className={`col-span-2 ${whiteWalls ? 'text-stone-900 font-medium' : 'text-[#f5f0e8]'}`}>
                          {activeProject.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <span className="text-stone-500 uppercase">Technology</span>
                        <span className={`col-span-2 ${whiteWalls ? 'text-emerald-700 font-medium' : 'text-[#d6c7b2]'}`}>
                          {activeProject.tags.slice(0, 4).join(' / ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <span className="text-stone-500 uppercase">Status</span>
                        <span
                          className={`col-span-2 inline-flex items-center gap-1.5 ${
                            whiteWalls ? 'text-emerald-700 font-semibold' : 'text-emerald-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed &amp; Live Demo Ready
                        </span>
                      </div>
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <span className="text-stone-500 uppercase">Creator</span>
                        <span className={`col-span-2 ${whiteWalls ? 'text-stone-900' : 'text-[#f5f0e8]'}`}>
                          {data.personal.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-3">
                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playAudioCue('click')}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                        whiteWalls
                          ? 'bg-stone-900 text-white hover:bg-emerald-700 shadow-md'
                          : 'bg-gradient-to-r from-[#e2d5c3] via-[#ece3d4] to-[#c8b79b] text-[#0f1013] hover:shadow-[0_0_30px_rgba(214,199,178,0.45)]'
                      }`}
                    >
                      <span>Open Live Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playAudioCue('click')}
                      className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border font-mono text-xs tracking-wider uppercase transition-all cursor-pointer ${
                        whiteWalls
                          ? 'border-stone-300 bg-white text-stone-900 hover:border-stone-900'
                          : 'border-[#d6c7b2]/25 bg-[#14161e] text-[#f5f0e8] hover:border-[#d6c7b2]/60 hover:text-[#d6c7b2]'
                      }`}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* GALLERY WING FILTER + INDIVIDUAL EXHIBIT PEDESTALS              */}
        {/* =============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className={`text-xs font-mono tracking-[0.2em] uppercase ${whiteWalls ? 'text-stone-600' : 'text-[#d5cec2]/70'}`}>
            Select an Exhibit for Live Demo &amp; GitHub ({filteredProjects.length} Works)
          </div>

          <div
            className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-full border ${
              whiteWalls ? 'bg-white border-stone-300' : 'bg-[#12141a] border-[#d6c7b2]/15'
            }`}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playAudioCue('click');
                  setSelectedCategory(cat);
                }}
                onMouseEnter={() => playAudioCue('hover')}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? whiteWalls
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-[#d6c7b2] text-[#0f1013] font-bold'
                    : whiteWalls
                      ? 'text-stone-600 hover:text-stone-900'
                      : 'text-[#d5cec2]/75 hover:text-[#f5f0e8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => {
            const exhibitIndex = data.projects.findIndex((p) => p.id === project.id) + 1;
            const exhibitCode = String(exhibitIndex).padStart(3, '0');
            const isSelected = project.id === activeProject?.id;

            return (
              <div
                key={project.id}
                onClick={() => {
                  playAudioCue('click');
                  setActiveProjectId(project.id);
                }}
                onMouseEnter={() => playAudioCue('hover')}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  whiteWalls
                    ? isSelected
                      ? 'border-stone-900 bg-white shadow-[0_18px_45px_rgba(24,24,27,0.12)] -translate-y-1'
                      : 'border-stone-300/90 bg-white hover:border-stone-500 hover:-translate-y-1 shadow-sm'
                    : isSelected
                      ? 'border-[#d6c7b2]/70 bg-[#1a1e28] shadow-[0_0_40px_rgba(214,199,178,0.16)] -translate-y-1'
                      : 'border-[#d6c7b2]/12 bg-[#13151c]/95 hover:border-[#d6c7b2]/45 hover:-translate-y-1'
                }`}
              >
                <div className="relative h-44 w-full overflow-hidden bg-[#0b0d11]">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

                  <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase bg-[#0f1013]/90 border border-[#d6c7b2]/35 text-[#d6c7b2] font-bold">
                      EXHIBIT {exhibitCode}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-[#0f1013]/85 border border-[#d6c7b2]/25 flex items-center justify-center text-[#d6c7b2]">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">
                      {project.category}
                    </div>
                    <h4
                      className={`font-serif text-xl transition-colors mb-2 ${
                        whiteWalls
                          ? 'text-stone-900 group-hover:text-emerald-700'
                          : 'text-[#f5f0e8] group-hover:text-[#d6c7b2]'
                      }`}
                    >
                      {project.title}
                    </h4>
                    <p
                      className={`text-xs font-light line-clamp-2 leading-relaxed mb-4 ${
                        whiteWalls ? 'text-stone-600' : 'text-[#d5cec2]/75'
                      }`}
                    >
                      {project.description}
                    </p>
                  </div>

                  <div
                    className={`pt-3 border-t flex items-center justify-between ${
                      whiteWalls ? 'border-stone-200' : 'border-[#d6c7b2]/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudioCue('click');
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${
                            whiteWalls
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/25'
                          }`}
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudioCue('click');
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono ${
                            whiteWalls
                              ? 'bg-stone-100 text-stone-800 border border-stone-300 hover:bg-stone-200'
                              : 'bg-[#0f1013] text-[#d5cec2] border border-[#d6c7b2]/20 hover:border-[#d6c7b2]'
                          }`}
                        >
                          <GithubIcon className="w-2.5 h-2.5" />
                          GitHub
                        </a>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider shrink-0 ml-2 ${
                        whiteWalls ? 'text-stone-900 font-semibold' : 'text-[#d6c7b2]'
                      }`}
                    >
                      {isSelected ? 'Demo Open' : 'Demo →'}
                    </span>
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

